import PDFDocument from "pdfkit";
import fs from "fs";
import { Prisma } from "~/generated/prisma";

export type InvoiceWithQuote = Prisma.InvoiceGetPayload<{
  include: { 
    quote: {include: {
      customer: true,
      stages: {include: {projectStage: true}},       
    }},
    User: true
  };
}>;

export default async function generateInvoicePdf(invoice: InvoiceWithQuote) {
  try {
    if (!invoice) return;

    const doc = new PDFDocument({ margin: 40 });
    const outputPath = `invoices/facture_${invoice.invoiceNumber}.pdf`;
    doc.pipe(fs.createWriteStream(outputPath));

    // --- COULEURS ---
    const darkBlue = "#004080";
    const lightBlue = "#e3f0fc";
    const textColor = "#222";
    const accentColor = "#E44933";
    const fontBase = "Helvetica";
    const fontBold = "Helvetica-Bold";
    const leftMargin = 50;
    const rightMargin = doc.page.width - 50;

    // --- HEADER ---
    // Titre et numéro
    doc
      .rect(0, 0, doc.page.width, 60)
      .fill(darkBlue);
    doc
      .font(fontBold)
      .fontSize(24)
      .fillColor("white")
      .text("FACTURE", leftMargin, 22, { align: "left" })
      .fontSize(12)
      .text(`N°${invoice.invoiceNumber}`, rightMargin - 120, 28, { align: "left", width: 120 });

    // --- INFOS ENTREPRISE AVEC ICÔNES ---
    const infoY = 70;
    doc
      .fontSize(10)
      .fillColor(darkBlue)
      .font(fontBold)
      .text("OPENINTECH", rightMargin - 200, infoY)
      .font(fontBase)
      .fillColor(textColor)
      .text("YDE-SIMBOCK", rightMargin - 200, infoY + 16)
      .text("000-000-000", rightMargin - 200, infoY + 32)
      .text("contact@gmail.com", rightMargin - 200, infoY + 48);

    // --- INFOS CLIENT ---
    const clientName = invoice.quote?.customer?.name || invoice.User?.name || "Client Inconnu";
    const clientCompany = invoice.quote?.customer?.company || "";
    const invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString('fr-FR');
    doc
      .font(fontBold)
      .fontSize(12)
      .fillColor(darkBlue)
      .text("Facturé à :", leftMargin, infoY)
      .font(fontBase)
      .fillColor(textColor)
      .text(clientName, leftMargin, infoY + 16)
      .text(clientCompany, leftMargin, infoY + 32)
      .font(fontBold)
      .fillColor(darkBlue)
      .text("Date de facture :", leftMargin, infoY + 48)
      .font(fontBase)
      .fillColor(textColor)
      .text(invoiceDate, leftMargin + 110, infoY + 48);

    // --- TABLEAU DES ARTICLES ---
    let tableTop = infoY + 80;
    const colX = [leftMargin, leftMargin + 200, rightMargin - 130];
    const rowHeight = 24;

    // En-tête du tableau
    doc
      .fontSize(11)
      .font(fontBold)
      .fillColor("white")
      .rect(leftMargin, tableTop, rightMargin - leftMargin, rowHeight)
      .fillAndStroke(darkBlue, darkBlue)
      .fillColor("white")
      .text("DESCRIPTION", colX[0] + 8, tableTop + 7)
      .text("MONTANT", colX[2], tableTop + 7, { width: 100, align: "right" });

    // Lignes du tableau
    let y = tableTop + rowHeight;
    let calculatedSubtotal = 0;
    if (invoice.quote && invoice.quote.stages && invoice.quote.stages.length > 0) {
      for (const [idx, stage] of invoice.quote.stages.entries()) {
        // Alternance de fond
        if (idx % 2 === 0) {
          doc.rect(leftMargin, y, rightMargin - leftMargin, rowHeight).fill(lightBlue);
        }
        const description = stage.projectStage?.title || "Description non disponible";
        const amount = stage.prix || 0;
        doc
          .font(fontBase)
          .fontSize(10)
          .fillColor(darkBlue)
          .text(description, colX[0] + 8, y + 7)
          .font(fontBold)
          .text(amount + " CFA", colX[2], y + 7, { width: 100, align: "right" });
        calculatedSubtotal += amount;
        y += rowHeight;
      }
    } else {
      doc
        .font(fontBase)
        .fontSize(10)
        .fillColor(darkBlue)
        .text("Aucun article.", colX[0] + 8, y + 7);
      y += rowHeight;
    }

    // --- BLOC TOTAUX À GAUCHE ---
    const blockY = y + 20;
    doc
      .rect(leftMargin, blockY, 220, 100)
      .fill(lightBlue)
      .strokeColor(darkBlue)
      .lineWidth(1)
      .stroke();

    let lineY = blockY + 12;
    doc
      .font(fontBold)
      .fontSize(11)
      .fillColor(darkBlue)
      .text("Sous-total :", leftMargin + 10, lineY)
      .font(fontBase)
      .fillColor(textColor)
      .text(calculatedSubtotal + " CFA", leftMargin + 120, lineY, { width: 90, align: "right" });

    lineY += 18;
    const taxRate = 0.1;
    const taxAmount = Math.round(calculatedSubtotal * taxRate);
    doc
      .font(fontBold)
      .fillColor(darkBlue)
      .text("Taxe (10%) :", leftMargin + 10, lineY)
      .font(fontBase)
      .fillColor(textColor)
      .text(taxAmount + " CFA", leftMargin + 120, lineY, { width: 90, align: "right" });

    lineY += 18;
    doc
      .font(fontBold)
      .fillColor(darkBlue)
      .text("Montant payé :", leftMargin + 10, lineY)
      .font(fontBase)
      .fillColor(textColor)
      .text((invoice.amountPaid || 0) + " CFA", leftMargin + 120, lineY, { width: 90, align: "right" });

    lineY += 18;
    const total = calculatedSubtotal + taxAmount;
    const balanceDue = invoice.balanceDue ?? (total - (invoice.amountPaid || 0));
    doc
      .font(fontBold)
      .fillColor(accentColor)
      .text("Solde dû :", leftMargin + 10, lineY)
      .font(fontBold)
      .fillColor(accentColor)
      .text(balanceDue + " CFA", leftMargin + 120, lineY, { width: 90, align: "right" });

    // --- MÉTHODE DE PAIEMENT ET SIGNATURE ---
    let payY = blockY + 110;
    doc.moveDown(1.5);
    doc
      .font(fontBold)
      .fontSize(10)
      .fillColor(darkBlue)
      .text("Méthode de paiement :", leftMargin, payY);
    doc
      .font(fontBase)
      .fillColor(textColor)
      .text(invoice.paymentMethod || "N/A", leftMargin + 140, payY);

    doc
      .font(fontBold)
      .fontSize(10)
      .fillColor(darkBlue)
      .text("Signature :", leftMargin, payY + 20);
    doc
      .font(fontBase)
      .fillColor(textColor)
      .text("_______________________", leftMargin + 140, payY + 20);

    // --- FOOTER ---
    doc
      .fontSize(10)
      .fillColor(darkBlue)
      .text(
        "OpenIntech Vous remercie pour votre confiance. Au plaisir de vous revoir !",
        leftMargin,
        700,
        { align: "center" }
      );

    doc.end();
    console.log(`Facture ${invoice.invoiceNumber}.pdf générée avec succès à ${outputPath}`);
  } catch (error) {
    console.error("Erreur lors de la génération de la facture PDF :", error);
  }
}