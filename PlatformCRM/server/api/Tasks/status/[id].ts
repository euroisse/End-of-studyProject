// server/api/tasks/[id].ts
import prisma from '~/server/database';

// Fonction utilitaire pour récupérer les IDs des admins (peut être déplacée)
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
  const taskId = parseInt(event.context.params?.id as string);
  const body = await readBody(event);
  const { status } = body;

  if (event.node.req.method === 'PATCH') {
    try {
      const existingTask = await prisma.tasks.findUnique({
        where: { id: taskId },
        include: {
          employee: { select: { id: true, name: true } },
          project: { select: { id: true, title: true } },
        },
      });

      if (!existingTask) {
        throw createError({ statusCode: 404, statusMessage: "Tâche non trouvée." });
      }

      const oldStatus = existingTask.status; // Capturer l'ancien statut

      const updatedTask = await prisma.tasks.update({
        where: { id: taskId },
        data: { status: status },
        include: {
          employee: { select: { id: true, name: true } },
          project: { select: { id: true, title: true } },
        },
      });

      // --- Notifications après mise à jour du statut de la tâche ---
      if (updatedTask.status !== oldStatus) {
        // Notifier l'employé si le statut de SA tâche change (peut être utile)
        await prisma.notification.create({
          data: {
            message: `Le statut de votre tâche "${updatedTask.title}" est passé à "${updatedTask.status}".`,
            type: "statut_tache_mis_a_jour_employe",
            userId: updatedTask.employee.id,
            taskId: updatedTask.id,
          },
        });

        // Si la tâche passe à "TERMINE", notifier les administrateurs
        if (updatedTask.status === "TERMINE") {
          const adminIds = await getAdminUserIds();
          for (const adminId of adminIds) {
            await prisma.notification.create({
              data: {
                message: `La tâche "${updatedTask.title}" du projet "${updatedTask.project.title}" a été TERMINÉE par ${updatedTask.employee.name}.`,
                type: "changement_statut_tache_termine", // Type spécifique pour l'admin
                userId: adminId,
                taskId: updatedTask.id,
              },
            });
          }
        }
      }
      // --- Fin Notifications ---

      return updatedTask;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.message || 'Impossible de mettre à jour le statut de la tâche' });
    }
  } else {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }
});