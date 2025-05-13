import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  const taskId = parseInt(event.context.params?.id as string);
if(event.node.req.method === 'DELETE'){
try {
    const existingTask = await prisma.tasks.findUnique({
where: { id: taskId },
    })
    if(!existingTask){
        throw createError({
            statusCode: 404,
            statusMessage:`La tache du projet avec l'ID ${taskId} n'existe pas`
        })
    }
    await prisma.tasks.delete({
      where: { id: taskId },
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche dans la base de données", error);
    throw createError({ statusCode: 500, statusMessage: 'Impossible de supprimer la tâche' });
  }
}
  
});