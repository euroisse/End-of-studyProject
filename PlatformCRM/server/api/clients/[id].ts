import prisma from '~/server/database';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const clientId = parseInt(event.context.params?.id as string);

  if (isNaN(clientId)) {
    return createError({
      statusCode: 400,
      message: 'ID client invalide.',
    });
  }

  try {
    const client = await prisma.user.findUnique({
      where: {
        id: clientId,
      },
      include: {
        
        clientProjects: {
          select: {
            id: true,
            title: true,      
            description: true,
            startDate: true,
            endDate: true,
   
          }
        },
        UserRole: {
          include: {
            role: true
          }
        }
      },
    });

    if (!client) {
      return createError({
        statusCode: 404,
        message: 'Client introuvable.',
      });
    }

    // Exclure le mot de passe avant d'envoyer les données au client
    const { password, ...clientSafeData } = client;

    // Convertir les nombres en float pour éviter des problèmes de sérialisation si nécessaire
    // Prisma gère bien les floats pour JSON normalement, donc pas de conversion spécifique ici.

    return clientSafeData;

  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails du client:', error);
    return createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur interne du serveur lors de la récupération des détails du client.',
    });
  }
});