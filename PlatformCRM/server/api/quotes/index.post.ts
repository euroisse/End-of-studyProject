

import prisma from "~/server/database";

interface BodyRequestInterface {
  projectId: number,
  stagesWithPrices: Array<{
    projectStageId: number,
    prix: number
  }>
}

export default defineEventHandler(async (event) => {
  const body: BodyRequestInterface = await readBody(event);
  const {  projectId, stagesWithPrices } = body;
  if ( !projectId) {
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
        customer:true, 
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
    const customerId = project.customer.id
    
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
      const stage =  stagesWithPrices.find((item) => item.projectStageId == pStage.id);
      return {
        projectStage: { connect: { id: pStage.id } },
        prix: stage?.prix || 0, 
      }
    }
  );

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
        totalPrice:  totalPrice ,
      },
      include: {
        customer: { select: { id: true, name: true, company: true } },
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