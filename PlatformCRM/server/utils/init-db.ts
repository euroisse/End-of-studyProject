import prisma from '../database'

export async function initializeDatabase() {
  try {
    // Vérifier si les rôles existent déjà
    const roleCount = await prisma.role.count()
    
    if (roleCount === 0) {
      // Créer les rôles par défaut
      await prisma.role.createMany({
        data: [
          { name: 'admin' },
          { name: 'client' },
          { name: 'employee' }
        ]
      })
      console.log('Rôles par défaut créés')
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error)
  }
}