// server/api/employee/[id].ts
import { defineEventHandler, createError } from 'h3';
import prisma from '~/server/database'; 

export default defineEventHandler(async (event) => {
 
  const employeeId = parseInt(event.context.params?.id as string || '');

 
  if (isNaN(employeeId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Requête invalide : L\'ID de l\'employé est manquant ou invalide.',
    });
  }

  try {
   
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
     
      select: {
        id: true,
        name: true,
        email: true,
        poste: true,
        department: true, 
        profilePicture: true,

        // Inclut les tâches assignées à cet employé
       
        tasks: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      
        UserRole: {
          include: {
            role: true,
          },
        },
      },
    });

    // Si aucun employé n'est trouvé avec cet ID
    if (!employee) {
      throw createError({
        statusCode: 404,
        statusMessage: `Employé avec l'ID ${employeeId} non trouvé.`,
      });
    }

    
   

    // Retourne les données de l'employé 
    return {
      ...employee,
     
    };

  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails de l\'employé :', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur : Impossible de récupérer les détails de l\'employé.',
      data: error.message,
    });
  }
});