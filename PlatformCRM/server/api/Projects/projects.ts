// server/api/projects/index.post.ts
import prisma from '~/server/database';
import type { Project } from '~/generated/prisma';

// Fonction utilitaire pour récupérer les IDs des admins (à placer dans un utilitaire commun ou dans ce fichier)
async function getAdminUserIds() {
  const admins = await prisma.user.findMany({
    where: {
      UserRole: {
        some: {
          role: {
            name: "admin",
          },
        },
      },
    },
    select: { id: true },
  });
  return admins.map(admin => admin.id);
}

export default defineEventHandler(async (event) => {
  try {
    const { customerId, title, description, startDate, endDate } = await readBody(event);

    if (!customerId || !title) {
      throw createError({
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
      include: {
        customer: { select: { id: true, name: true } }, // Inclure le client pour la notification
      }
    });

    // --- Notifications après création du projet ---
    // Notifier le client que son projet a été créé
    await prisma.notification.create({
      data: {
        message: `Votre projet "${newProject.title}" a été créé avec succès.`,
        type: "projet_cree",
        userId: newProject.customerId, 
        projectId: newProject.id,
      },
    });

    // Notifier l'admin qu'un nouveau projet a été créé
    const adminIds = await getAdminUserIds();
    for (const adminId of adminIds) {
      await prisma.notification.create({
        data: {
          message: `Un nouveau projet "${newProject.title}" a été créé pour le client.`,
          type: "nouveau_projet_admin",
          userId: adminId,
          projectId: newProject.id,
        },
      });
    }
    // --- Fin Notifications ---

    return newProject;
  } catch (error: any) {
    console.error('Erreur lors de la création du projet :', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erreur interne du serveur lors de la création du projet.',
    });
  }
});