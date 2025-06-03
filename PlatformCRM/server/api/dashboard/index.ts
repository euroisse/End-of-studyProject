import prisma from "~/server/database";
import type { Project } from "~/generated/prisma"; // Assurez-vous que ce chemin est correct

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
      // Inclure les factures (comme avant)
      clientInvoice: {
        select: {
          id: true,
          invoiceNumber: true,
          invoiceDate: true,
          totalAmount: true,
          amountPaid: true, // Ajouté pour un résumé potentiel
          balanceDue: true, // Ajouté pour un résumé potentiel
        },
        orderBy: {
          invoiceDate: "desc",
        },
        take: 5, // Limite à 5 dernières factures
      },
      // Inclure les devis (NOUVEAU)
      clientQuote: {
        select: {
          id: true,
          number: true,
          status: true,
          totalPrice: true,
          createdAt: true,
          newTotalPrice: true, 
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5, // Limite à 5 derniers devis
      },
      _count: {
        select: {
          projects: true,
          clientInvoice: true,
          clientQuote: true, 
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
      quotes: user.clientQuote,     
      summary: {
        yourProjectsCount: projects.length,
        yourInvoicesCount: user._count?.clientInvoice || 0,
        yourQuotesCount: user._count?.clientQuote || 0, 
      },
    };
  } else {
    throw createError({
      statusCode: 403,
      statusMessage: "Accès interdit.",
    });
  }

  return {
    statusCode: 200,
    data: dashboardData,
  };
});