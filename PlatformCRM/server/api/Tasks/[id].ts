
import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  const taskId = parseInt(event.context.params?.id as string);
  const body = await readBody(event);
  if(event.node.req.method === 'PATCH'){
   try{
     const updated = await prisma.tasks.update({
    where: { id: taskId },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      effort: body.effort ?? null,
    },
  });

  return updated;
   }catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw createError({ statusCode: 500, statusMessage: 'Impossible de mettre à jour la tâche' });
    }
  }
 
});