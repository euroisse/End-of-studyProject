import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const newTask = await prisma.tasks.create({
        data: {
          title: body.title,
          description: body.description,
          projectId: Number(body.projectId),
          employeeId: Number(body.employeeId),
          priority: body.priority,
          status: body.status,
          effort:  Number(body.effort)
        },
      });
      return newTask;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw createError({ statusCode: 500, statusMessage: 'Impossible de créer la tâche' });
    }
  } else if (event.node.req.method === 'GET') {
    try {
      const tasks = await prisma.tasks.findMany({
        include: {
          employee: true,
          project: true,
        },
      });
      return tasks;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw createError({ statusCode: 500, statusMessage: 'Impossible de récupérer les tâches' });
    }
  } else {
    throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' });
  }
});