import { defineEventHandler, readBody } from 'h3';
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return { error: true, message: "Tous les champs sont obligatoires." };
  }

  // Stocke le message dans la base (table ContactMessage à créer dans Prisma)
  await prisma.contactMessage.create({
    data: { name, email, subject, message }
  });

  return { success: true };
});