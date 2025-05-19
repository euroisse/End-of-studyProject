import prisma from "~/server/database";
import type { QuoteStageInput } from "~/types";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { number, customerId, projectId, stages } = body as {
    number: string;
    customerId: number;
    projectId: number;
    stages: QuoteStageInput[];
  };

  try {
    const customerExists = await prisma.user.findUnique({ where: { id: customerId } });
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!customerExists || !projectExists) {
      throw createError({ statusCode: 400, statusMessage: 'Client ou projet non trouvé.' });
    }

    // Créer le devis
    const newQuote = await prisma.quote.create({
      data: {
        number,
        customer: { connect: { id: customerId } },
        project: { connect: { id: projectId } },
        stages: {
          create: stages.map((stage: QuoteStageInput) => ({ // Ici, 'stage' est maintenant typé
            projectStage: { connect: { id: stage.projectStageId } },
            prix: stage.prix,
          })),
        },
      },
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

    return newQuote;
  } catch (error) {
    console.error('Erreur lors de la création du devis :', error);
    throw createError({ statusCode: 500, statusMessage: 'Une erreur inattendue est survenue lors de la création du devis.' });
  } finally {
    await prisma.$disconnect();
  }
});