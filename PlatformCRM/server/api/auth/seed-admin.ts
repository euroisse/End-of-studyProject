import { hash } from 'bcryptjs';
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { nom, email, password } = body;

  // Vérifie si un admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email,
      UserRole: {
        some: {
          role: { name: 'admin' }
        }
      }
    },
    include: { UserRole: true }
  });

  if (existingAdmin) {
    console.log('Un utilisateur admin existe déjà avec cet email.');
    return { alreadyExists: true };
  }

  // Récupère le rôle admin
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });
  if (!adminRole) {
    throw createError({ statusCode: 500, message: 'Le rôle admin est introuvable.' });
  }

  // Crée l'utilisateur admin
  const hashedPassword = await hash(password, 10);
  await prisma.user.create({
    data: {
      name: nom,
      email,
      password: hashedPassword,
      UserRole: {
        create: { roleId: adminRole.id }
      }
    }
  });

  return { alreadyExists: false };
});