import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  // Récupérer l'ID utilisateur à partir des paramètres de l'événement
  const userId = parseInt(event.context.params?.id as string || '');

  // Vérifier si l'ID utilisateur est manquant
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID utilisateur manquant.',
    });
  }

  try {
    // Récupérer les informations de l'utilisateur et ses rôles
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

    // Vérifier si l'utilisateur n'a pas été trouvé
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé.',
      });
    }

    // Déterminer si l'utilisateur est un administrateur ou un client
    const isAdmin = user.UserRole.some((userRole) => userRole.role.name === 'admin');
    const isClient = user.UserRole.some((userRole) => userRole.role.name === 'customer');

    let quotes;

    if (isAdmin) {
      // Si l'utilisateur est un administrateur, récupérer tous les devis
      quotes = await prisma.quote.findMany({
        include: {
          project: {
            select: { id: true, title: true }
          },
          stages: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (isClient) {
      // Si l'utilisateur est un client, filtrer les devis pour ne récupérer que ceux liés à ses projets
      quotes = await prisma.quote.findMany({
        where: {
          project: {
            customerId: userId, 
          },
        },
        include: {
          project: {
            select: { id: true, title: true }
          },
          stages: true,
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

    // Calculer le prix total pour chaque devis
    const quotesWithTotalPrice = quotes.map(quote => {
      const totalPrice = quote.stages.reduce((sum, stage) => sum + stage.prix, 0);
      return {
        id: quote.id,
        number: quote.number,
        projectName: quote.project?.title || 'null', 
        totalPrice: totalPrice,
        status: quote.status,
        createdAt: quote.createdAt,
      };
    });

    return quotesWithTotalPrice;
  } catch (error) {
    console.error('Erreur lors de la récupération des devis :', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de récupérer les devis.',
    });
  }
});
