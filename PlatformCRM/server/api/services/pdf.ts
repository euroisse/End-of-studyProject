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
  console.log("--- donnees de facture genere par le pdf ---");
  console.log("Invoice Object:", JSON.stringify(invoice, null, 2));
  console.log("Invoice Quote:", JSON.stringify(invoice.quote, null, 2));
  console.log("Invoice Quote Stages:", JSON.stringify(invoice.quote?.stages, null, 2));

  try {
    if (!invoice) {
      console.log("Facture non trouvée pour l'ID donné.");
      return;
    }

    const doc = new PDFDocument();
    const outputPath = `invoices/facture_${invoice.invoiceNumber}.pdf`;
    doc.pipe(fs.createWriteStream(outputPath));

    const textColor = "black";
    const accentColor = "#E44933";
    const fontBase = "Helvetica";
    const fontBold = "Helvetica-Bold";

    // Define margins 
    const leftMargin = 50;
    const rightMargin = doc.page.width - 50; 

    // --- En-tête ---
    doc
      .fontSize(24)
      .font(fontBase)
      .fillColor(accentColor) 
      .text("FACTURE", { align: "left" });

    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font(fontBase)
      .fillColor(textColor) 
      .text(`N°${invoice.invoiceNumber}`, { align: "left" });
    doc.moveDown(1);

    // --- Infos de l'entreprise ---
    doc.fontSize(12).text("OPENINTECH", { align: "right" });
    doc.text("YDE-SIMBOCK", { align: "right" });
    doc.text(`Tel: 00000000`, { align: "right" });
    doc.text(`Email: contact@gmail.com`, { align: "right" });
    doc.moveDown(1);

    // --- Infos du client ---
    const clientName = invoice.quote?.customer?.name || invoice.User?.name || "Client Inconnu";
    const clientCompany = invoice.quote?.customer?.company || "N/A";

    doc.font(fontBold).text(`Facture à:`, { underline: true });
    doc.font(fontBase).text(clientName);
    doc.text(clientCompany);

    const invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString('fr-FR');
   
    const currentYForClientInfo = doc.y;
    doc.text(`Date de facture: ${invoiceDate}`, leftMargin, currentYForClientInfo - doc.currentLineHeight(), { align: "right", width: rightMargin - leftMargin }); // Adjust Y to align with the last line of client info
    doc.moveDown(2);

    // --- Tableau d'articles ---
    const tableTop = doc.y;
    const itemColumnX = leftMargin;
    const amountColumnX = doc.page.width - 130; 
    const columnWidth = 180;
    const amountWidth = 80;
    const rowHeight = 20;

    doc.font(fontBold).fontSize(10);
    doc.text("DESCRIPTION", itemColumnX, tableTop, { width: columnWidth });
    doc.text("MONTANT", amountColumnX, tableTop, {
      width: amountWidth,
      align: "right",
    });

    doc
      .lineWidth(0.5)
      .moveTo(itemColumnX, tableTop + rowHeight)
      .lineTo(rightMargin, tableTop + rowHeight) 
      .stroke();

    let y = tableTop + rowHeight + 10;
    let calculatedSubtotal = 0;

    doc.font(fontBase).fontSize(10);
    if (invoice.quote && invoice.quote.stages && invoice.quote.stages.length > 0) {
      for (const stage of invoice.quote.stages) {
        const description = stage.projectStage?.title || "Description non disponible";
        const amount = stage.prix || 0;

        doc.text(description, itemColumnX, y, { width: columnWidth });
        doc.text(amount.toFixed(2), amountColumnX, y, {
          width: amountWidth,
          align: "right",
        });
        calculatedSubtotal += amount;
        y += rowHeight;

        doc
          .lineWidth(0.5)
          .moveTo(itemColumnX, y)
          .lineTo(rightMargin, y) 
          .stroke();
        y += 15;
      }
    } else {
      doc.text("Aucun article.", itemColumnX, y, { width: columnWidth });
      y += rowHeight + 15;
    }

    // --- Totaux (Taxe, TOTAL, Montant Payé, Solde Dû)
    doc.moveDown(1);
    doc.fontSize(10).font(fontBase);

    const taxRate = 0.01;
    const taxAmount = calculatedSubtotal * taxRate;
    doc.moveDown(1)
    // Taxe
    let currentY = doc.y;
    doc.text(`Taxe:`, leftMargin, currentY);
    doc.text(`${taxAmount.toFixed(2)} CFA`, leftMargin, currentY, { align: "right", width: rightMargin - leftMargin });
    doc.moveDown(0.5);

    // TOTAL
    currentY = doc.y;
    doc.fontSize(12).font(fontBold); 
    doc.text(`TOTAL:`, leftMargin, currentY);
    doc.text(`${invoice.totalAmount.toFixed(2)} CFA`, leftMargin, currentY, { align: "right", width: rightMargin - leftMargin });
    doc.moveDown(0.5);

    // Montant Payé
    currentY = doc.y;
    doc.fontSize(10).font(fontBase);
    doc.text(`Montant Payé:`, leftMargin, currentY);
    doc.text(`${invoice.amountPaid.toFixed(2)} CFA`, leftMargin, currentY, { align: "right", width: rightMargin - leftMargin });
    doc.moveDown(0.5);

    // Solde Dû
    currentY = doc.y;
    const balanceDue = invoice.totalAmount - invoice.amountPaid;
    doc.fontSize(10)
       .fillColor(accentColor); 
    doc.text(`Solde Dû:`, leftMargin, currentY);
    doc.text(`${balanceDue.toFixed(2)} CFA`, leftMargin, currentY, { align: "right", width: rightMargin - leftMargin });
    doc.fillColor(textColor); 
    doc.moveDown(2);

    // --- Méthode de Paiement et Signature ---
    currentY = doc.y;
    doc.fontSize(8).font(fontBase);

    // MÉTHODE DE PAIEMENT 
    doc.text("MÉTHODE DE PAIEMENT", leftMargin, currentY, { underline: true });

    // SIGNATURE (right)
    doc.font(fontBold).fontSize(10); 
    doc.text("SIGNATURE", leftMargin, currentY, { align: "right", width: rightMargin - leftMargin });
    
    doc.moveDown(0.5); 

    currentY = doc.y;
    doc.font(fontBase).fontSize(8); 
    doc.text(`${invoice.paymentMethod}`, leftMargin, currentY); 

    doc.text("_______________________", leftMargin, currentY, { align: "right", width: rightMargin - leftMargin }); 

    doc.end();
    console.log(`Facture ${invoice.invoiceNumber}.pdf générée avec succès à ${outputPath}`);
  } catch (error) {
    console.error("Erreur lors de la génération de la facture PDF :", error);
  } 
}
