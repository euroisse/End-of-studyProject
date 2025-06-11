import prisma from '~/server/database';
import type { ProjectStage } from '~/generated/prisma';


export default defineEventHandler(async (event) => {

  if (event.node.req.method === 'POST') {

    try {
      const body = await readBody(event);
      const { projectId, title, description, tasks } = body;

      if (!projectId || !title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'L\'ID du projet et le titre sont obligatoires.',
        });
      }

      const projectExists = await prisma.project.findUnique({
        where: { id: Number(projectId) }, 
      });

      if (!projectExists) {
        throw createError({
          statusCode: 404,
          statusMessage: `Le projet avec l'ID ${projectId} n'existe pas.`,
        });
      }

      // Création de l'étape avec éventuellement des tâches associées
      const newProjectStage: ProjectStage = await prisma.projectStage.create({
        data: {
          projectId: Number(projectId),
            title: title as string,
            description: description as string | undefined,
            tasks: tasks && Array.isArray(tasks)
            ? {
                create: tasks.map((task: any) => ({
                  title: task.title,
                  description: task.description,
                  employeeId: task.employeeId,
                  projectId: Number(projectId),
                  priority: task.priority ?? 'BASSE',
                  status: task.status ?? 'A_FAIRE',
                  effort: task.effort,
                })),
              }
            : undefined,
        },
        include: { tasks: true },
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