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

    // Determine user roles
    const isAdmin = user.UserRole.some((userRole) => userRole.role.name === 'admin');
    const isClient = user.UserRole.some((userRole) => userRole.role.name === 'customer');

    let invoices; 

    if (isAdmin) {
   
      invoices = await prisma.invoice.findMany({
        include: {
          quote: {
            select: { id: true }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (isClient) {

      invoices = await prisma.invoice.findMany({
        where: {
          quote: {
            customerId: userId,
          },
        },
        
        orderBy: {
          createdAt: 'desc'
        }
      });
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

  } catch (error) {
    console.error('Erreur lors de la récupération des factures :', error);

    
    if (error) { 
      throw error;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Impossible de récupérer les factures.',
      });
    }
  }
});