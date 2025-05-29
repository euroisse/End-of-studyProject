import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const { userId } = body;

  try {
    if (!userId) {
      return createError({
        statusCode: 400,
        message: 'User ID is required.'
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId }, 
      include: {
        UserRole: {
          include: {
            role: true
          }
        }
      }
    });

    if (!currentUser) {
      return createError({
        statusCode: 401,
        message: 'Utilisateur non trouvé ou ID invalide.'
      });
    }

    const hasPermission = currentUser.UserRole.some(
      userRole => userRole.role?.name === 'admin'
    );

    if (!hasPermission) {
      return createError({
        statusCode: 403,
        message: 'Accès non autorisé. Vous n\'avez pas les permissions requises.'
      });
    }

    // 3. Récupérer TOUS les utilisateurs de la base de données
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        contacts: true,
        company: true,
        industry: true,
        adresse: true,
        poste: true,
        department: true,
        profilePicture: true,
        UserRole: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return users;

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return createError({
      statusCode: 500,
      message: 'Erreur interne du serveur lors de la récupération des utilisateurs.'
    });
  }
});