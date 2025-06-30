import prisma from "~/server/database";
import { quoteStatus } from "~/generated/prisma";
import type { QuoteStageInput } from "~/types"; // Assurez-vous que ce type est correct

// Fonction utilitaire pour récupérer les IDs des admins (peut être déplacée)
async function getAdminUserIds() {
  const admins = await prisma.user.findMany({
    where: {
      UserRole: {
        some: {
          role: {
            name: "admin",
          },
        },
      },
    },
    select: { id: true },
  });
  return admins.map(admin => admin.id);
}

export default defineEventHandler(async (event) => {
  const devisId = parseInt(event.context.params?.id as string);

  if (isNaN(devisId)) {
    throw createError({ statusCode: 400, statusMessage: "ID de devis invalide." });
  }

  try {
    if (event.node.req.method === "GET") {
      const quoteDetails = await prisma.quote.findUnique({
        where: { id: devisId },
        include: {
          customer: true,
          project: true,
          stages: {
            include: {
              projectStage: true,
            },
            orderBy: { projectStageId: 'asc' }
          },
        },
      });

      if (!quoteDetails) {
        throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
      }

      return quoteDetails;
    }

    if (event.node.req.method === "DELETE") {
      const existingQuote = await prisma.quote.findUnique({ 
        where: { id: devisId },
        include: {
          customer: true,
          project: true,
        }
      });
      if (!existingQuote) {
        throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
      }

      await prisma.cout_stage.deleteMany({
        where: { quoteId: devisId }
      });
      await prisma.quote.delete({
        where: { id: devisId }
      });

      // --- Notification après suppression du devis ---
      const adminIds = await getAdminUserIds();
      for (const adminId of adminIds) {
        await prisma.notification.create({
          data: {
            message: `Le devis n°${existingQuote.number} pour le projet "${existingQuote.project?.title || 'inconnu'}" du client ${existingQuote.customer.name} a été supprimé.`,
            type: "devis_supprime",
            userId: adminId,
            quoteId: existingQuote.id, // Lier à l'ID du devis même s'il est supprimé (historique)
          },
        });
      }
      // --- Fin Notification ---

      return { message: `Devis avec l'ID ${devisId} supprimé avec succès.` };
    }

    if (event.node.req.method === "PUT") {
      const body = await readBody(event);
      const { status, stages } = body as {
        status?: 'ACCEPTE' | 'REFUSE';
        stages?: QuoteStageInput[];
      };

      const existingQuote = await prisma.quote.findUnique({ 
        where: { id: devisId },
        include: {
          customer: true,
          project: true,
        }
      });
      if (!existingQuote) {
        throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
      }

      // Capture de l'ancien statut avant la mise à jour
      const oldStatus = existingQuote.status;

      let updateData: {
        status?: quoteStatus;
        newTotalPrice?: number;
        stages?: {
          deleteMany: {};
          create: { projectStage: { connect: { id: number } }; prix: number }[];
        };
      } = {};

      if (status && Object.values(quoteStatus).includes(status as quoteStatus)) {
        updateData.status = status as quoteStatus;
      } else if (status) {
        throw createError({
          statusCode: 400,
          statusMessage: `Le statut '${status}' est invalide. Valeurs possibles : ${Object.values(quoteStatus).join(', ')}`,
        });
      }

      if (stages) {
        const calculatedNewTotalPrice = stages.reduce((sum, stage) => sum + stage.prix, 0);
        updateData.newTotalPrice = calculatedNewTotalPrice;

        updateData.stages = {
          deleteMany: { quoteId: devisId }, // S'assurer de supprimer uniquement les stages de ce devis
          create: stages.map((stage) => ({
            projectStage: { connect: { id: stage.projectStageId } },
            prix: stage.prix,
          })),
        };
      }

      const updatedQuote = await prisma.quote.update({
        where: { id: devisId },
        data: updateData,
        include: {
          customer: true,
          project: true,
          stages: {
            include: {
              projectStage: true,
            },
          },
        },
      });

      // --- Notifications après mise à jour du statut du devis ---
      if (updatedQuote.status !== oldStatus) {
        const adminIds = await getAdminUserIds();

        if (updatedQuote.status === "ACCEPTE") {
          // Notifier l'admin que le devis a été accepté
          for (const adminId of adminIds) {
            await prisma.notification.create({
              data: {
                message: `Le devis n°${updatedQuote.number} pour le projet "${updatedQuote.project?.title || 'inconnu'}" a été ACCEPTÉ par le client ${updatedQuote.customer.name}.`,
                type: "devis_valide",
                userId: adminId,
                quoteId: updatedQuote.id,
              },
            });
          }
        } else if (updatedQuote.status === "REFUSE") {
          // Notifier l'admin que le devis a été refusé
          for (const adminId of adminIds) {
            await prisma.notification.create({
              data: {
                message: `Le devis n°${updatedQuote.number} pour le projet "${updatedQuote.project?.title || 'inconnu'}" a été REFUSÉ par le client ${updatedQuote.customer.name}.`,
                type: "devis_refuse",
                userId: adminId,
                quoteId: updatedQuote.id,
              },
            });
          }
        }
      }
      // --- Fin Notifications ---

      return updatedQuote;
    }

    // Méthode non autorisée
    throw createError({ statusCode: 405, statusMessage: `Méthode non autorisée.` });
  } catch (error: any) {
    console.error(`Erreur sur la route devis/${devisId} :`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || `Une erreur est survenue lors de l'opération sur le devis ${devisId}.`,
    });
  }
});