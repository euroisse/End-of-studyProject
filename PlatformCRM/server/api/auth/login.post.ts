import prisma from '~/server/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, roleId } = body

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        UserRole: {
          include: {
            role: true
          }
        }
      }
    })

    
    if (!user || !password) {
      return createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    
    const userHasRole = user.UserRole.some(ur => ur.roleId === parseInt(roleId))

    if (!userHasRole) {
      
      return createError({
        statusCode: 403, 
        message: 'Type d\'utilisateur incorrect'
      })
    }

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
        ...(user.industry && { industry: user.industry })
      }
    }
  } catch (error) {
    console.error('Erreur de login:', error)
    return createError({
      statusCode: 500,
      message: 'Erreur interne du serveur'
    })
  }
})


