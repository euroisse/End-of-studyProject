import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  const devisId = parseInt(event.context.params?.id as string);

  try {
    const quoteDetails = await prisma.quote.findUnique({
      where: { id: devisId },
      include: {
        customer: true,
        project: true,
        stages: {
          include: {
            projectStage: true,
          },
        },
      },
    });

    if (!quoteDetails) {
      throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
    }

    return quoteDetails;
  } catch (error) {
    console.error(`Erreur lors de la récupération du devis ${devisId} :`, error);
    throw createError({ statusCode: 500, statusMessage: `Une erreur inattendue est survenue lors de la récupération du devis ${devisId}.` });
  } finally {
    await prisma.$disconnect();
  }
});