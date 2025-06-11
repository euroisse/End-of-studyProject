import prisma from '~/server/database';

import type { ProjectStageWithTasks } from '~/types'; 


export default defineEventHandler(async (event) => {

  const projectStageId = parseInt(event.context.params?.id as string);

  // Gère uniquement les requêtes PUT
  if (event.node.req.method === 'PUT') {
    try {
      // Lit le corps de la requête
      const body = await readBody(event);
      // Déstructure les champs que nous voulons mettre à jour.
      // 'status' est supprimé ici car il est dérivé et ne devrait pas être mis à jour directement.
      const { title, description, endDate } = body; 

      // Vérifie si l'étape du projet existe
      const existingProjectStage = await prisma.projectStage.findUnique({
        where: { id: projectStageId },
      });

      if (!existingProjectStage) {
        throw createError({
          statusCode: 404,
          statusMessage: `L'étape de projet avec l'ID ${projectStageId} n'existe pas.`,
        });
      }

      // Construit l'objet de données pour la mise à jour
      const dataToUpdate: {
        title?: string;
        description?: string;
        endDate?: Date | null; // Spécifie le type pour endDate
      } = {};

      if (title !== undefined) {
        dataToUpdate.title = title as string;
      }
      if (description !== undefined) {
        dataToUpdate.description = description as string;
      }
      
      if (endDate !== undefined) {
        dataToUpdate.endDate = endDate ? new Date(endDate) : null;
      }

      // Met à jour l'étape dans la base de données
      // Important : Inclut les tâches dans la réponse pour que le frontend puisse calculer le statut
      const updatedProjectStage: ProjectStageWithTasks = await prisma.projectStage.update({ // <-- Change le type de retour pour inclure les tâches
        where: { id: projectStageId },
        data: dataToUpdate, // Utilise l'objet dataToUpdate construit dynamiquement
        include: { tasks: true }, // <-- Inclure les tâches pour que le frontend puisse dériver le statut
      });

     
      return updatedProjectStage;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour de l'étape de projet ${projectStageId}:`, error);
      return createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || `Échec de la mise à jour de l'étape de projet ${projectStageId}`,
      });
    }
  } else {
   
    throw createError({
      statusCode: 405,
      statusMessage: 'Méthode non autorisée',
    });
  }
});