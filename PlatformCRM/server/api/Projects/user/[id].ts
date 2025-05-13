import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  // Récupérer l'ID de l'utilisateur connecté
  const userId = parseInt(event.context.params?.id as string || '');
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé. Utilisateur non connecté.',
    });
  }

  try {
    //  Récupérer l'utilisateur depuis la base de données et ses roles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        UserRole: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé.',
      });
    }

    //  Vérifier le rôle de l'utilisateur
    const isAdmin = user.UserRole.some((userRole) => userRole.role.name === 'admin');

    let projects;

    //  Récupérer les projets en fonction du rôle
    if (isAdmin) {
      // Si l'utilisateur est un admin, récupérer tous les projets
      projects = await prisma.project.findMany({
        include: {
          customer: true,
          users: {
            include: {
              employee: true,
            },
          },
          projectStages: true,
        },
      });
    } else {
      // Si l'utilisateur est un employé, récupérer uniquement ses projets
      projects = await prisma.project.findMany({
        where: {
          users: {
            some: {
              employeeId: userId,
            },
          },
        },
        include: {
          customer: true,
          users: {
            include: {
              employee: true,
            },
          },
          projectStages: true,
        },
      });
    }

    //  Retourner la liste des projets
    return projects;

  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des projets.',
    });
  }
});