// server/api/tasks/[id].js
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
    const taskId = parseInt(event.context.params?.id as string);
  const body = await readBody(event);
  const { status } = body;

  if (event.node.req.method === 'PATCH') {
    try {
      const updatedStatus = await prisma.tasks.update({
        where: { id: taskId },
        data: { status: status },
      });
      return updatedStatus;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
      throw createError({ statusCode: 500, statusMessage: 'Impossible de mettre à jour le statut la tâche' });
    }
  } else {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }
});