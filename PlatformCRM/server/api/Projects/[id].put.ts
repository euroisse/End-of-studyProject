import prisma from '~/server/database';
import type { Project } from '~/generated/prisma';



export default defineEventHandler(async (event) => {
    
    // Récupérer l'ID du projet à partir des paramètres de la requête
    const projectId = parseInt(event.context.params?.id as string||'' );

  //Vérification de la méthode HTTP
    if (event.node.req.method === 'PUT') {
    try {
        const body = await readBody(event);
        const { title, description, startDate, endDate } = body;

        const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
        });
//verifier si le projet existe
        if (!existingProject) {
        throw createError({
            statusCode: 404,
            statusMessage: `Le projet avec l'ID ${projectId} n'existe pas.`,
        });
        }
//mise a jour du projet
        const updatedProject: Project = await prisma.project.update({
        where: { id: projectId },
        data: {
            title: title as string | undefined,
            description: description as string | undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
        },
        });

//retourner le projet mis a jour
        return updatedProject;
    } catch (error: any) {
        console.error(`Error updating project ${projectId}:`, error);
        return createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || `Failed to update project ${projectId}`,
        });
    }
    //si on n'a aucune methode
    } else {
    throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
    });
    }
});