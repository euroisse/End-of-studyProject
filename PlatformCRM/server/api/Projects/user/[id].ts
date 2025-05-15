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
    const projects: Project[] = await prisma.project.findMany({
      where: {
        tasks: {
          some: {
            employeeId: userId,// seulement les projets ou l'employe a au moins une  tache
          },
        },
      },
      include: {
        customer: true,
        projectStages: true,
        tasks: {
          where: { employeeId: userId },// on ne renvoie que ses taches a lui
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });
    return projects;
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des projets.',
    });
  }
});