import prisma from "~/server/database";
import { quoteStatus } from "~/generated/prisma";
import type { QuoteStageInput } from "~/types";


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
      const existingQuote = await prisma.quote.findUnique({ where: { id: devisId } });
      if (!existingQuote) {
        throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
      }

      await prisma.quote.delete({ where: { id: devisId } });

      return { message: `Devis avec l'ID ${devisId} supprimé avec succès.` };
    }

    if (event.node.req.method === "PUT") {
      const body = await readBody(event);
      const { status, stages } = body as {
        status?: 'ACCEPTE' | 'REFUSE' ;
        stages?: QuoteStageInput[];
      };

      const existingQuote = await prisma.quote.findUnique({ where: { id: devisId } });
      if (!existingQuote) {
        throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
      }

      let updateData: {
        status?: quoteStatus;
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
        updateData.stages = {
          deleteMany: {},
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

      return updatedQuote;
    }

    // Méthode non autorisée
    throw createError({ statusCode: 405, statusMessage: `Méthode  non autorisée.` });
  } catch (error) {
    console.error(`Erreur sur la route devis/${devisId} :`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Une erreur est survenue lors de l'opération sur le devis ${devisId}.`,
    });
  }
});
