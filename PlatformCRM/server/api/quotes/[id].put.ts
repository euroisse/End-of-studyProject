import prisma from "~/server/database";
import type { QuoteStageInput } from "~/types";
import { quoteStatus } from "~/generated/prisma";
export default defineEventHandler(async (event) => {
  const devisId = parseInt(event.context.params?.id as string);
  const body = await readBody(event);
  const { status, stages } = body as {
    status?: string; 
    stages?: QuoteStageInput[];
  };

  try {
    // Vérifier si le devis existe
    const existingQuote = await prisma.quote.findUnique({ where: { id: devisId } });
    if (!existingQuote) {
      throw createError({ statusCode: 404, statusMessage: `Devis avec l'ID ${devisId} non trouvé.` });
    }

    let updateData: {
      status?: quoteStatus;
      stages?: { deleteMany: {}; create: { projectStage: { connect: { id: number } }; prix: number }[] };
    } = {};

   
    if (status && Object.values(quoteStatus).includes(status as quoteStatus)) {
      updateData.status = status as quoteStatus;
    } else if (status) {
      throw createError({
        statusCode: 400,
        statusMessage: `Le statut '${status}' n'est pas une valeur valide. Les valeurs valides sont : ${Object.values(quoteStatus).join(', ')}.`,
      });
    }

    // Mettre à jour les étapes si elles sont fournies
    if (stages) {
      updateData.stages = {
        deleteMany: {},
        create: stages.map((stage: QuoteStageInput) => ({
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
  } catch (error) {
    console.error(`Erreur lors de la modification du devis ${devisId} :`, error);
    throw createError({ statusCode: 500, statusMessage: `Une erreur inattendue est survenue lors de la modification du devis ${devisId}.` });
  } finally {
    await prisma.$disconnect();
  }
});