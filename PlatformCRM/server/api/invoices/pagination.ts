import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt((query.page as string) || "1");
  const pageSize = parseInt((query.pageSize as string) || "10");
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const userId = parseInt((query.id as string) || "");

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        UserRole: {
          include: {
            role: true,
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
    // Determine roles
    const isAdmin = user.UserRole.some(
      (userRole) => userRole.role.name === "admin"
    );
    const isClient = user.UserRole.some(
      (userRole) => userRole.role.name === "customer"
    );

    let where: any = {};
    let total;
    let invoices;

    if (isAdmin) {
      // Un administrateur peut voir toutes les factures
      total = await prisma.invoice.count();
      invoices = await prisma.invoice.findMany({
        include: {
          quote: {
            select: { id: true, customerId: true },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        skip,
        take,
      });
    } else if (isClient) {
      const clientWhere = { userId: userId };
      total = await prisma.invoice.count({ where: clientWhere });
      invoices = await prisma.invoice.findMany({
        where: clientWhere,
        include: {
          quote: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        skip,
        take,
      });
      console.log(
        "API Factures/User - Factures trouvées pour client",
        userId,
        ":",
        invoices.length
      );
    } else {
      throw createError({
        statusCode: 403,
        statusMessage: "Accès non autorisé pour ce rôle.",
      });
    }

    const totalAmountPaidAcrossInvoices = invoices.reduce(
      (sum, inv) => sum + inv.amountPaid,
      0
    );

    return {
      message: "Factures récupérées avec succès.",
      data: invoices,
      summary: {
        totalInvoicesFound: invoices.length,
        totalAmountPaidAcrossInvoices: totalAmountPaidAcrossInvoices,
      },
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des factures :", error);
    if (error.statusCode && error.statusMessage) {
      throw error;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage:
          "Impossible de récupérer les factures en raison d'une erreur interne.",
        data: error.message || "Erreur inconnue",
      });
    }
  }
});
