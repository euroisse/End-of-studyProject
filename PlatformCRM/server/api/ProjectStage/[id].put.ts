import prisma from '~/server/database';
import type { ProjectStage,ProjectStageStatus } from '~/generated/prisma';

export default defineEventHandler(async (event) => {
  const projectStageId = parseInt(event.context.params?.id as string);

  if (event.node.req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const { title, description, status } = body;

      const existingProjectStage = await prisma.projectStage.findUnique({
        where: { id: projectStageId },
      });
//verifier si l'etape du projet existe
      if (!existingProjectStage) {
        throw createError({
          statusCode: 404,
          statusMessage: `L'étape de projet avec l'ID ${projectStageId} n'existe pas.`,
        });
      }
//mise a jour dans la bd apres modification
      const updatedProjectStage: ProjectStage = await prisma.projectStage.update({
        where: { id: projectStageId },
        data: {
          title: title as string | undefined,
          description: description as string | undefined,
          status: status as ProjectStageStatus | undefined,
        },
      });
//retourner l'etape mis a jour
      return updatedProjectStage;
    } catch (error: any) {
      console.error(`Error updating project stage ${projectStageId}:`, error);
      return createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || `Failed to update project stage ${projectStageId}`,
      });
    }
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }
});