import PDFDocument, { moveDown } from "pdfkit";
import { Prisma } from "~/generated/prisma";
import fs from "fs";
import path from "path";

export type QuoteWithDetails = Prisma.QuoteGetPayload<{
  include: {
    customer: true,
    project: true,
    stages: { include: { projectStage: true } },
  };
}>;

export default async function generateQuotePdf(quote: QuoteWithDetails) {
  if (!quote) throw new Error("Aucun devis fourni");

  const doc = new PDFDocument({ margin: 40 });
  const outputDir = path.resolve("quotes");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `devis_${quote.number}.pdf`);
  doc.pipe(fs.createWriteStream(outputPath));

  // En-tête bleu sombre
  doc
    .rect(0, 0, doc.page.width, 70)
    .fill("#004080");
  doc
    .fillColor("white")
    .fontSize(28)
    .font("Helvetica-Bold")
    .text("DEVIS", 40, 25, { align: "left" });
  doc
    .fontSize(14)
    .font("Helvetica")
    .text(`N°${quote.number}`, 0, 30, { align: "right" });

  doc.moveDown(2);

  // Bandeau infos client/projet bleu ciel
  doc
    // .fillColor("#e3f0fc")
    .rect(40, 90, doc.page.width - 80, 70)
    .fill();
  doc
    .fillColor("#004080")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Client :", 55, 105, { continued: true })
    .font("Helvetica")
    .text(` ${quote.customer?.name || "N/A"}`, { continued: true })
    .font("Helvetica-Bold")
    .text("   Projet :", { continued: true })
    .font("Helvetica")
    .text(` ${quote.project?.title || "N/A"}`, { continued: true })
    .font("Helvetica-Bold")
    .text("   Date :", { continued: true })
    .font("Helvetica")
    .text(` ${new Date(quote.createdAt).toLocaleDateString("fr-FR")}`);

  doc.moveDown(3);

  // Titre étapes
  doc
    .fontSize(16)
    .fillColor("#004080")
    .font("Helvetica-Bold")
    .text("ÉTAPES DU DEVIS", { underline: true });
  doc.moveDown(1);

  // Tableau des étapes
  const tableTop = doc.y + 10;
  const colX = [55, 220, 420]; // Titre, Description, Montant
  const rowHeight = 28;

  // Header
  doc
    .fontSize(12)
    .fillColor("#e3f0fc")
    .rect(colX[0] - 5, tableTop, doc.page.width - 100, rowHeight)
    .fill();
  doc
    .fillColor("#004080")
    .font("Helvetica-Bold")
    .text("ÉTAPE", colX[0], tableTop + 8)
    
    .text("DESCRIPTION", colX[1], tableTop + 8)
    .font("Helvetica.Bold")
    .text("MONTANT", colX[2], tableTop + 8, { width: 100, align: "right" });
  doc.font("Helvetica-Bold")

  // Ligne sous header
  doc
    .moveTo(colX[0] - 5, tableTop + rowHeight)
    .lineTo(doc.page.width - 50, tableTop + rowHeight)
    .strokeColor("#b3cce6")
    .lineWidth(1)
    .stroke();

  let y = tableTop + rowHeight;

  if (quote.stages && quote.stages.length > 0) {
    quote.stages.forEach((stage, idx) => {
      // Alternance de fond
      if (idx % 2 === 0) {
        doc
          .fillColor("#e3f0fc")
          .rect(colX[0] - 5, y, doc.page.width - 100, rowHeight)
          .fill();
      }
      // Titre étape
      doc
        .fillColor("#004080")
        .font("Helvetica")
        .fontSize(11)
        .text(stage.projectStage?.title || "Étape", colX[0], y + 8, { width: colX[1] - colX[0] - 10 });
      // Description
      doc
        .fillColor("#888")
        .font("Helvetica-Oblique")
        .text(stage.projectStage?.description || "-", colX[1], y + 8, { width: colX[2] - colX[1] - 10 });
      // Montant aligné à droite
      doc
        .fillColor("#004080")
        .font("Helvetica-Bold")
        .text(`${stage.prix} CFA`, colX[2], y + 8, { width: 100, align: "right" });

      // Ligne sous chaque ligne
      doc
        .moveTo(colX[0] - 5, y + rowHeight)
        .lineTo(doc.page.width - 50, y + rowHeight)
        .strokeColor("#e3f0fc")
        .lineWidth(1)
        .stroke();

      y += rowHeight;
    });
  } else {
    doc
      .fontSize(12)
      .fillColor("#004080")
      .text("Aucune étape définie.", colX[0], y + 8);
    y += rowHeight;
  }

  // Total
  doc.moveDown(1.5);
  const total = quote.newTotalPrice ?? quote.totalPrice ?? 0;
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor("#004080")
    .text("Total", colX[1], y + 18, { width: colX[2] - colX[1] - 10 })
    .text(`${total} CFA`, colX[2], y + 18, { width: 100, align: "right" });

  doc.end();
  return outputPath;
}