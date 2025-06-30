import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  // Optionnel : ajouter une vérification de rôle admin ici
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return messages;
});