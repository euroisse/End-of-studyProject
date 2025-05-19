import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  const devisId = parseInt(event.context.params?.id as string);

  try {
   
    const existingQuote = await prisma.quote.findUnique({ where: { id: devisId } });
    if (!existingQuote) {
      throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
    }

    await prisma.quote.delete({
      where: { id: devisId },
    });

    return { message: `Devis avec l'ID ${devisId} supprimé avec succès.` };
  } catch (error) {
    console.error(`Erreur lors de la suppression du devis ${devisId} :`, error);
    throw createError({ statusCode: 500, statusMessage: `Une erreur inattendue est survenue lors de la suppression du devis ${devisId}.` });
  } finally {
    await prisma.$disconnect();
  }
});