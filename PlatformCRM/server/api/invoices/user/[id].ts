
import prisma from "~/server/database";


export default defineEventHandler(async (event) => {
  const userId = parseInt(event.context.params?.id as string || '');

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID utilisateur manquant.',
    });
  }

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
        statusMessage: 'Utilisateur non trouvé.',
      });
    }

    const userRoles = user.UserRole || [];
    // Vérifiez si l'utilisateur a le rôle 'admin' ou 'customer'
    const isAdmin = userRoles.some((userRole) => userRole.role?.name === 'admin');
    const isClient = userRoles.some((userRole) => userRole.role?.name === 'customer');

    let invoices;

    if (isAdmin) {
      // Un administrateur peut voir toutes les factures
      invoices = await prisma.invoice.findMany({
        include: {
          quote: {
            select: { id: true, customerId: true } 
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (isClient) {
      // Un client voit seulement ses propres factures, liées par 'userId'
      invoices = await prisma.invoice.findMany({
        where: {
          userId: userId, 
        },
        include: {
          quote: true, 
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log('API Factures/User - Factures trouvées pour client', userId, ':', invoices.length);
    } else {

      throw createError({
        statusCode: 403,
        statusMessage: 'Accès non autorisé pour ce rôle.',
      });
    }

    const totalAmountPaidAcrossInvoices = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);

    return {
      message: 'Factures récupérées avec succès.',
      data: invoices,
      summary: {
        totalInvoicesFound: invoices.length,
        totalAmountPaidAcrossInvoices: totalAmountPaidAcrossInvoices,
      }
    };

  } catch (error: any) {
    console.error('Erreur lors de la récupération des factures :', error);
    if (error.statusCode && error.statusMessage) {
      throw error; 
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Impossible de récupérer les factures en raison d\'une erreur interne.',
        data: error.message || 'Erreur inconnue',
      });
    }
  }
});