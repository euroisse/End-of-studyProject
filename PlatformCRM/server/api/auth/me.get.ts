import prisma from '~/server/database'

export default defineEventHandler(async (event) => {
  
  const sessionCookie = getCookie(event, 'auth_session')
  
  if (!sessionCookie) {
    return createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }
  
  try {

    const session = JSON.parse(sessionCookie)
    const userId = session.userId
    

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        UserRole: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!user) {
      deleteCookie(event, 'auth_session')
      return createError({
        statusCode: 401,
        message: 'Utilisateur non trouvé'
      })
    }
    
    // Retourner les informations de l'utilisateur
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.UserRole.map(ur => ur.role.name),

        ...(user.poste && { poste: user.poste }),
        ...(user.department && { department: user.department }),
        ...(user.adresse && { adresse: user.adresse }),
        ...(user.company && { company: user.company }),
        ...(user.industry && { industry: user.industry }),
         ...(user.contacts && { contacts: user.contacts })
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return createError({
      statusCode: 500,
      message: 'Erreur interne du serveur'
    })
  }
})

