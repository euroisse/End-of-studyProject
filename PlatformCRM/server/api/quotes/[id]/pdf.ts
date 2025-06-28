import prisma from "~/server/database";
import generateQuotePdf from "~/server/api/services/quotePdf";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id as string);
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: "ID de devis invalide." });

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      customer: true,
      project: true,
      stages: { include: { projectStage: true } },
    },
  });
  if (!quote) throw createError({ statusCode: 404, statusMessage: "Devis non trouvé." });

  const pdfPath = await generateQuotePdf(quote);

  // Retourne le PDF en téléchargement
  event.res.setHeader("Content-Type", "application/pdf");
  event.res.setHeader("Content-Disposition", `attachment; filename=devis_${quote.number}.pdf`);
  return fs.createReadStream(pdfPath);
});