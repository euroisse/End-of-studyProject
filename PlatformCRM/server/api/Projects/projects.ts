import prisma from '~/server/database';
import type { Project } from '~/generated/prisma';

export default defineEventHandler(async (event) => {
    try {
        if (event.node.req.method === 'POST') {
            const { customerId, title, description, startDate, endDate } = await readBody(event);

            if (!customerId || !title) {
                return createError({
                    statusCode: 400,
                    statusMessage: 'L\'ID du client et le titre sont obligatoires.',
                });
            }

            const newProject: Project = await prisma.project.create({
                data: {
                    customerId: parseInt(customerId as string),
                    title: title as string,
                    description: description as string | undefined,
                    startDate: startDate ? new Date(startDate as string) : undefined,
                    endDate: endDate ? new Date(endDate as string) : undefined,
                },
            });

            console.log('Projet créé:', newProject);

            // Récupérer les informations du client pour la notification
            const customer = await prisma.user.findUnique({
                where: { id: parseInt(customerId as string) },
                select: { id: true, name: true, email: true }
            });

            if (!customer) {
                console.error('Client non trouvé pour l\'ID:', customerId);
                return newProject; // Retourner le projet même si la notification échoue
            }

            try {
                // 1. Notification pour le client - Nouveau projet créé
                await prisma.notification.create({
                    data: {
                        userId: customer.id,
                        type: 'projet_cree',
                        message: `Un nouveau projet "${title}" a été créé pour vous.`,
                        projectId: newProject.id,
                        read: false,
                    },
                });

                console.log(`Notification créée pour le client ${customer.name} (ID: ${customer.id}) pour le projet "${title}".`);

                // 2. Notifications pour tous les administrateurs
                const admins = await prisma.user.findMany({
                    where: {
                        UserRole: {
                            some: {
                                role:{
                                  name : 'admin'
                                } 
                            }
                        }
                    },
                    select: { id: true, name: true }
                });

                // Créer une notification pour chaque admin
                const adminNotifications = admins.map(admin => ({
                    userId: admin.id,
                    type: 'nouveau_projet_admin',
                    message: `Un nouveau projet "${title}" a été créé pour le client ${customer.name}.`,
                    projectId: newProject.id,
                    read: false,
                }));

                if (adminNotifications.length > 0) {
                    await prisma.notification.createMany({
                        data: adminNotifications,
                    });

                    console.log(`Notifications créées pour ${admins.length} administrateur(s) pour le projet "${title}".`);
                    admins.forEach(admin => {
                        console.log(`- Notification pour l'administrateur ${admin.name} (ID: ${admin.id})`);
                    });
                }

                // // 3. Optionnel: Notification pour les employés qui pourraient être assignés au projet
                // // Vous pouvez décommenter cette section si vous voulez notifier les employés
                // /*
                const employees = await prisma.user.findMany({
                    where: {
                        UserRole: {
                            some: {
                                role: {
                                  name: 'employee'
                                } 
                            }
                        }
                    },
                    select: { id: true, name: true }
                });

                if (employees.length > 0) {
                    const employeeNotifications = employees.map(employee => ({
                        userId: employee.id,
                        type: 'nouveau_projet_disponible',
                       
                        message: `Un nouveau projet "${title}" est disponible.`,
                        projectId: newProject.id,
                        read: false,
                    }));

                    await prisma.notification.createMany({
                        data: employeeNotifications,
                    });

                    console.log(`Notifications créées pour ${employees.length} employé(s) pour le projet "${title}".`);
                }
                

            } catch (notificationError) {
                console.error('Erreur lors de la création des notifications:', notificationError);
                // Ne pas faire échouer la création du projet si les notifications échouent
            }

            return newProject;

        } else if (event.node.req.method === 'GET') {
            const projects: Project[] = await prisma.project.findMany({
                include: {
                    customer: true,
                    users: {
                        include: {
                            employee: true,
                        },
                    },
                    projectStages: {
                        include: {
                            tasks: true
                        }
                    },
                    tasks: {
                        include: {
                            employee: true
                        }
                    }
                },
            });

            return projects;
        } else {
            return createError({
                statusCode: 405,
                statusMessage: 'Méthode non autorisée',
            });
        }
    } catch (error: any) {
        console.error('Erreur dans l\'API project:', error);
        return createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Erreur interne du serveur',
        });
    }
});