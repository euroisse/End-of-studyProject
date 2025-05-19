import prisma from '~/server/database';
import type { Project } from '~/generated/prisma';


export default defineEventHandler(async (event) => {
    const userId = parseInt(event.context.params?.id as string || '');

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID utilisateur manquant.',
        });
    }

    try {
       
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                UserRole: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if (!user) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Utilisateur non trouvé.',
          });
        }
      
        // Vérifier le rôle de l'utilisateur
        const isAdmin = user.UserRole.some((userRole) => userRole.role.name === 'admin');


        let projects: Project[];

        if (isAdmin) {
            // Si l'utilisateur est un admin, récupérer tous les projets
            projects = await prisma.project.findMany({
                include: {
                    customer: true,
                    
                    users: {
                        include: {
                            employee: true,
                        },
                    },
                    projectStages: true,
                    tasks: { 
                      include: {
                        employee: true
                      }
                    }
                },
            });
        } else {
            // Si l'utilisateur est un employé, récupérer uniquement les projets liés à ses tâches
            projects = await prisma.project.findMany({
                where: {
                    tasks: {
                        some: {
                            employeeId: userId, // seulement les projets où l'employé a au moins une tâche
                        },
                    },
                },
                include: {
                    customer: true,
                    projectStages: true,
                    tasks: {
                        where: { employeeId: userId }, // on ne renvoie que ses tâches à lui
                        include: {         
                            employee: true,
                        },
                    },
                },
            });
        }
        return projects;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur serveur lors de la récupération des projets.',
        });
    }
});
