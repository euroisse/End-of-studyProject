import prisma from "~/server/database";

interface BodyRequestInterface {
  projectId: number;
  stagesWithPrices: Array<{
    projectStageId: number;
    prix: number;
  }>;
}

export default defineEventHandler(async (event) => {
  const body: BodyRequestInterface = await readBody(event);
  const { projectId, stagesWithPrices } = body;
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le projet est requis.',
    });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectStages: true,
        customer: true,
      },
    });

    if (!project) {
      throw createError({ statusCode: 400, statusMessage: 'Projet non trouvé.' });
    }
    if (!project.customer) {
      throw createError({ statusCode: 400, statusMessage: 'Projet selectionne n\'a pas de client.' });
    }
    if (!project.projectStages || project.projectStages.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Le projet n\'a pas d\'étapes définies pour générer un devis.' });
    }
    const customerId = project.customer.id;

    // 2. Générer un numéro de devis automatique
    const lastQuote = await prisma.quote.findFirst({
      orderBy: { id: 'desc' },
      select: { number: true },
    });

    let nextNumber = 1;
    if (lastQuote && lastQuote.number) {
      const match = lastQuote.number.match(/DEV-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    const newQuoteNumber = `DEV-${String(nextNumber).padStart(3, '0')}`;

    // 3. Récupérer les étapes du projet et calculer le prix total
    const stagesToCreate = project.projectStages.map(pStage => {
      const stage = stagesWithPrices.find((item) => item.projectStageId == pStage.id);
      return {
        projectStage: { connect: { id: pStage.id } },
        prix: stage?.prix || 0,
      };
    });

    const totalPrice = stagesWithPrices.reduce((acc, current) => acc + current.prix, 0);

    // 4. Enregistrer le devis en base avec l'état par défaut "EN_ATTENTE"
    const newQuote = await prisma.quote.create({
      data: {
        number: newQuoteNumber,
        customer: { connect: { id: customerId } },
        project: { connect: { id: projectId } },
        status: 'EN_ATTENTE',
        stages: {
          create: stagesToCreate,
        },
        totalPrice: totalPrice,
      },
      include: {
        customer: { select: { id: true, name: true, email: true } }, // Include customer details for notification
        project: { select: { id: true, title: true } },
        stages: {
          include: {
            projectStage: { select: { id: true, title: true } },
          },
        },
      },
    });

    const createdQuoteWithStages = await prisma.quote.findUnique({
      where: { id: newQuote.id },
      include: { stages: true }
    });
    let calculatedTotalPrice = 0;
    if (createdQuoteWithStages && createdQuoteWithStages.stages) {
      calculatedTotalPrice = createdQuoteWithStages.stages.reduce((sum, stage) => sum + stage.prix, 0);
    }

  
    try {
      // Notification for the customer - New quote created and awaiting validation
      await prisma.notification.create({
        data: {
          userId: newQuote.customer.id,
          type: 'devis_a_valider', 
          message: `Un nouveau devis "${newQuote.number}" a été généré pour votre projet "${newQuote.project.title}" et est en attente de votre validation.`,
          quoteId: newQuote.id, 
          read: false,
        },
      });
      console.log(`Notification créée pour le client ${newQuote.customer.name} (ID: ${newQuote.customer.id}) pour le devis "${newQuote.number}".`);

      // Notifications for all administrators
      const admins = await prisma.user.findMany({
        where: {
          UserRole: {
            some: {
              role: {
                name: 'admin'
              }
            }
          }
        },
        select: { id: true, name: true }
      });

      const adminNotifications = admins.map(admin => ({
        userId: admin.id,
        type: 'devis_cree_admin', 
        message: `Un nouveau devis "${newQuote.number}" a été créé pour le projet "${newQuote.project.title}" du client ${newQuote.customer.name}.`,
        quoteId: newQuote.id, 
        read: false,
      }));

      if (adminNotifications.length > 0) {
        await prisma.notification.createMany({
          data: adminNotifications,
        });
        console.log(`Notifications créées pour ${admins.length} administrateur(s) pour le devis "${newQuote.number}".`);
      }

    } catch (notificationError) {
      console.error('Erreur lors de la création des notifications pour le devis:', notificationError);
    
    }
    // --- NOTIFICATION LOGIC ENDS HERE ---

    return { ...newQuote, totalPrice: calculatedTotalPrice };

  } catch (error: any) {
    console.error('Erreur lors de la création du devis :', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Une erreur inattendue est survenue lors de la création du devis.',
      data: error.message
    });
  }
});