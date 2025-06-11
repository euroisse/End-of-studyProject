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
        console.error('Erreur :', error);
        return createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Erreur interne du serveur',
        });
    }
});
