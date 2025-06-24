import prisma from '~/server/database';

export default defineEventHandler(async () => {
  await prisma.contactMessage.updateMany({ where: { read: false }, data: { read: true } });
  return { success: true };
});