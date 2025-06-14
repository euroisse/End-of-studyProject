import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
   const employeeId = parseInt(event.context.params?.id as string || '');
  const body = await readBody(event);

  if (!body.name || !body.post) {
    return sendError(event, createError({ statusCode: 400, statusMessage: "Nom et poste requis." }));
  }

  try {
    const user = await prisma.user.update({
      where: { id: employeeId },
      data: {
        name: body.name,
        poste: body.post,
      },
      select: {
        id: true,
        name: true,
        poste: true,
        email: true,
      }
    });
    return user;
  } catch (error) {
    return sendError(event, createError({ statusCode: 500, statusMessage: "Erreur lors de la mise à jour de l'employé." }));
  }
});