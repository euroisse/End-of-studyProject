import { Prisma } from '~/generated/prisma';
import prisma from '~/server/database';

type ProjectWithProjectStages = Prisma.ProjectGetPayload<{include: {projectStages: true}}>

export default defineEventHandler(async (event): Promise<ProjectWithProjectStages>=>{
    const projectId = parseInt(event.context.params?.id as string||'' );
if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Requête invalide : ID du projet manquant.',
    });
  }
try{
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include:{
          customer:true,
            projectStages:{}
        }
    }) as ProjectWithProjectStages
    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: `Projet avec l'ID ${projectId} non trouvé.`,
      });
    }
  
    return project;
}
catch (error: any) {
    console.error('Erreur lors de la récupération du projet :', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur : Impossible de récupérer le projet.',
      data: error,
    });
  }
})