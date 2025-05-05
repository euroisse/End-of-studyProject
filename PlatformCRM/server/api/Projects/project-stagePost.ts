import prisma from '~/server/database';
import type { ProjectStage, ProjectStageStatus } from '~/generated/prisma';


export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { projectId, title, description, status } = body;

      if (!projectId || !title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'L\'ID du projet et le titre sont obligatoires.',
        });
      }

      const projectExists = await prisma.project.findUnique({
        where: { id: parseInt(projectId as string) },
      });

      if (!projectExists) {
        throw createError({
          statusCode: 404,
          statusMessage: `Le projet avec l'ID ${projectId} n'existe pas.`,
        });
      }

      const newProjectStage: ProjectStage = await prisma.projectStage.create({
        data: {
            projectId: parseInt(projectId as string),
            title: title as string,
            description: description as string | undefined,
            status: status as ProjectStageStatus | undefined,
        },
    });

    return newProjectStage;
    } catch (error: any) {
        console.error('Error creating project stage:', error);
        return createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Failed to create project stage',
    });
    }
} else {
    
    throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
    });
    }
});