import { hash } from 'bcryptjs';
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { nom, email, password } = body;

  try {
    const availableRoles = ["admin", "employee", "customer"];
    // create roles
    const roles = await prisma.role.findMany();
    if (roles.length === 0) {
      await Promise.all(
        availableRoles.map(async (role) => {
          await prisma.role.create({
            data: { name: role }
          });
        })
      );
    } else {
      await Promise.all(
        availableRoles.map(async (role) => {
          if (roles.some(r => r.name === role)) return
          await prisma.role.create({
            data: {name: role}
          }) 
        })
      )
    }
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

    console.log("roles", await prisma.role.findMany());
  
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
    const user = await prisma.user.create({
      data: {
        name: nom,
        email,
        password: hashedPassword,
        UserRole: {
          create: { roleId: adminRole.id }
        }
      }
    });
  
    return { user, alreadyExists: false };
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la création de l'admin"
    })
  }
});