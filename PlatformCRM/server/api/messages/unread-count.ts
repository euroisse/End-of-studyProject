import prisma from '~/server/database';

export default defineEventHandler(async () => {
  const count = await prisma.contactMessage.count({ where: { read: false } });
  return { count };
});