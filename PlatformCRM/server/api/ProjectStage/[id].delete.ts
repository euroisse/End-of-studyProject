import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  const projectId = parseInt(event.context.params?.id as string);

  if (event.node.req.method === 'DELETE') {
    try {
      const existingProjectStage = await prisma.projectStage.findUnique({
        where: { id: projectId },
      });

      if (!existingProjectStage) {
        throw createError({
          statusCode: 404,
          statusMessage: `L'étape de projet avec l'ID ${projectId} n'existe pas.`,
        });
      }

      await prisma.projectStage.delete({
        where: { id: projectId },
      });

      return {
        statusCode: 200,
        body: { message: "Étape supprimée avec succès." },
      };
    } catch (error: any) {
      console.error("Erreur Prisma (delete) :", error);
      return createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || "Erreur lors de la suppression de l'étape.",
      });
    }
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }
});