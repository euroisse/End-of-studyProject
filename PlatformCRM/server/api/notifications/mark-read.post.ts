
import prisma from "~/server/database";
import { defineEventHandler, readBody, createError } from "h3"; // Assurez-vous d'importer ces fonctions

interface MarkReadBody {
  notificationIds: number[];
  userId: number;
}

export default defineEventHandler(async (event) => {
  try {
    const body: MarkReadBody = await readBody(event);
    const { notificationIds, userId } = body;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Liste d'IDs de notifications invalide ou vide.",
      });
    }
    if (isNaN(userId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "L'ID utilisateur est requis pour marquer les notifications.",
      });
    }

    // Marque les notifications comme lues UNIQUEMENT si elles appartiennent à l'utilisateur donné
    // C'est une mesure de sécurité importante.
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
        userId: userId, // S'assure que l'utilisateur ne peut marquer que ses propres notifications
        read: false, // Optionnel: marquer seulement celles qui ne sont pas déjà lues
      },
      data: {
        read: true,
      },
    });

    return { message: "Notifications marquées comme lues avec succès." };
  } catch (error: any) {
    console.error("Erreur lors du marquage des notifications comme lues:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Une erreur inattendue est survenue lors du marquage des notifications.",
      data: error.message,
    });
  }
});