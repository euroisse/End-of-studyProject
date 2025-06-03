import prisma from "~/server/database";
import type { Project } from "~/generated/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = parseInt(query.userId as string);

  if (isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'ID utilisateur est requis et doit être un nombre valide.",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      UserRole: {
        select: {
          role: true,
        },
      },
      clientInvoice: {
        select: {
          id: true,
          invoiceNumber: true,
          invoiceDate: true,
          totalAmount: true,
        },
        orderBy: {
          invoiceDate: "desc",
        },
        take: 5,
      },
      _count: {
        select: {
          projects: true,
          clientInvoice: true,
        },
      },
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "utilisateur non trouvé.",
    });
  }

  const userRoles = user.UserRole || [];

  const isAdmin = userRoles.some((userRole) => userRole.role?.name === "admin");
  const isClient = userRoles.some((userRole) => userRole.role?.name === "customer");
  const isEmploye = userRoles.some((userRole) => userRole.role?.name === "employee");

  let dashboardData: any = {};
  let projects: Project[] = [];

  if (isAdmin) {
    const totalProjects = await prisma.project.count();
    const totalInvoices = await prisma.invoice.count();
    const totalClients = await prisma.user.count({
      where: { UserRole: { some: { role: { name: "customer" } } } },
    });
    const totalEmployees = await prisma.user.count({
      where: { UserRole: { some: { role: { name: "employee" } } } },
    });

    dashboardData = {
      summary: {
        totalProjects,
        totalInvoices,
        totalClients,
        totalEmployees,
      },
    };
  } else if (isEmploye) {
    projects = await prisma.project.findMany({
      where: {
        tasks: {
          some: {
            employeeId: userId,
          },
        },
      },
      include: {
        customer: true,
      
        projectStages: {
          include: {
            stages: true, 
          },
        },
     
        tasks: {
          where: { employeeId: userId },
          include: {
            employee: true,
          },
        },
      },
    });
    const assignedTasksCount = await prisma.tasks.count({
      where: {
        employeeId: userId,
      },
    });

    dashboardData = {
      projects: projects,
      summary: {
        assignedProjectsCount: projects.length,
        assignedTasksCount: assignedTasksCount, 
      },
    };

  } else if (isClient) {
    projects = await prisma.project.findMany({
      where: {
        customerId: userId,
      },
      include: {
        customer: true,
     
        projectStages: {
          include: {
            stages: true, 
          },
        },
       
        users: {
          include: {
            employee: true,
          },
        },
        
      },
    });

    dashboardData = {
      projects: projects,
      invoices: user.clientInvoice,
      summary: {
        yourProjectsCount: projects.length,
        yourInvoicesCount: user._count?.clientInvoice || 0,
      },
    }; 
  } else {
    throw createError({
      statusCode: 403,
      statusMessage: "Access interdit.",
    });
  }

  return {
    statusCode: 200,
    data: dashboardData,
  };
});