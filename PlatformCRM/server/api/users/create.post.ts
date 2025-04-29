import prisma from '~/server/database'
import { hash } from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, password, roleId, adresse, poste, department, company, industry } = body
    
    const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return createError({
          statusCode: 409, 
          message: 'Cet email est déjà utilisé.',
        });
      }
    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10)
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        adresse,
        poste,
        department,
        company,
        industry,
        email,
        password: hashedPassword,
        UserRole: {
          create: {
            roleId: parseInt(roleId)
          }
        }
      }
    })
    
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return { error: 'Failed to create user' }
  }
})