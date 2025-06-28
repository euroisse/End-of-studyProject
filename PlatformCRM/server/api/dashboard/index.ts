import prisma from "~/server/database";
import type { Project } from "~/generated/prisma";
import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = parseInt(query.userId as string);

  if (isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'ID utilisateur est requis et doit être un nombre valide.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        UserRole: {
          select: {
            role: true,
          },
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
        statusMessage: "Utilisateur non trouvé.",
      });
    }

    const userRoles = user.UserRole || [];

    const isAdmin = userRoles.some((userRole) => userRole.role?.name === "admin");
    const isClient = userRoles.some((userRole) => userRole.role?.name === "customer");
    const isEmploye = userRoles.some((userRole) => userRole.role?.name === "employee");

    let dashboardData: any = {};
    let projects: Project[] = [];
    let invoices: any[] = [];
    let quotes: any[] = [];

    if (isAdmin) {
      const totalProjects = await prisma.project.count();
      const totalInvoices = await prisma.invoice.count();
      const totalQuotes = await prisma.quote.count();
      const totalClients = await prisma.user.count({
        where: { UserRole: { some: { role: { name: "customer" } } } },
      });
      const totalEmployees = await prisma.user.count({
        where: { UserRole: { some: { role: { name: "employee" } } } },
      });

      invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      quotes = await prisma.quote.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      })

      dashboardData = {
        summary: {
          totalProjects,
          totalInvoices,
          totalQuotes,
          totalClients,
          totalEmployees,
        },
        invoices: invoices,
        quotes: quotes,
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
              tasks: true,
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
      invoices = await prisma.invoice.findMany({
        where: {
          userId: userId,
        },
        include: {
          quote: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      console.log('Dashboard API - Factures trouvées pour client', userId, ':', invoices.length);

      projects = await prisma.project.findMany({
        where: {
          customerId: userId,
        },
        include: {
          customer: true,
          projectStages: {
            include: {
              tasks: true,
            },
          },
          users: {
            include: {
              employee: true,
            },
          },
        },
        take: 5,
      });

      quotes = await prisma.quote.findMany({
        where: {
          customerId: userId,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      dashboardData = {
        projects: projects,
        invoices: invoices,
        quotes: quotes,
        summary: {
          yourProjectsCount: projects.length,
          yourInvoicesCount: invoices.length,
          yourQuotesCount: quotes.length,
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
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données du tableau de bord :', error);
    if (error.statusCode && error.statusMessage) {
      throw error;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Impossible de récupérer les données du tableau de bord.',
        data: error.message || 'Erreur inconnue',
      });
    }
  }
});