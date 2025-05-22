

import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  try {
    const quotes = await prisma.quote.findMany({
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


    const quotesWithTotalPrice = quotes.map(quote => {
      const totalPrice = quote.stages.reduce((sum, stage) => sum + stage.prix, 0);
      return {
        id: quote.id,
        number: quote.number,
        projectName: quote.project.title || 'null', 
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