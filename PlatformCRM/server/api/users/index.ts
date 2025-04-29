import prisma from '~/server/database'

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
        //recupere les champs d'un modeles liees
      include: {
        UserRole: {
            //recupere les champ d'un modele lies
          include: {
            role: true
          }
        }
      }
    })
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return { error: 'Failed to fetch users' }
  }
})