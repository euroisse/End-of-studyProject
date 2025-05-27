import pdfkit from "pdfkit";
import fs from "fs";

const doc = new pdfkit();
doc.pipe(fs.createWriteStream("invoice.pdf"));
const textColor = "black";
const accentColor = "#E44933";
const fontBase = "Helvetica";
const fontBold = "Helvetica-Bold";

// En-tête
doc
  .fontSize(24)
  .font(fontBase)
  .text("FACTURE", { align: "left" })
  .fillColor(accentColor);

doc.moveDown(0.5);
doc
  .fontSize(12)
  .font(fontBase)
  .text(`N°00001`, { align: "left" })
  .fillColor(textColor);
doc.moveDown(1);

// Infos de l'entreprise

doc.fontSize(12).text("OPENINTECH", { align: "right" });
doc.text("YDE-SIMBOCK", { align: "right" });
doc.text(`Tel: 00000000`, { align: "right" });
doc.text(`Email:contact@gmail,com`, { align: "right" });
doc.moveDown(1);
//logo entreprise
// doc.image();
// Infos du client
doc.font(fontBold).text(`Facture à:`, { underline: true });
doc.font(fontBase).text(`test`);
doc.text(`DLA`);

const currentYForDate = doc.y;
doc.text(`Date de facture: 25/05/2025`, 0, currentYForDate, { align: "right" });
doc.moveDown(2);

// Tableau d'articles
const tableTop = doc.y;
const itemColumnX = 50;
const amountColumnX = doc.page.width - 130;
const columnWidth = 180;
const amountWidth = 80;
const rowHeight = 20;

// En-tête du tableau
doc.font(fontBold).fontSize(10);
doc.text("DESCRIPTION", itemColumnX, tableTop, { width: columnWidth });
doc.text("MONTANT", amountColumnX, tableTop, {
  width: amountWidth,
  align: "right",
});

// Ligne de séparation sous les en-têtes
doc
  .lineWidth(0.5)
  .moveTo(itemColumnX, tableTop + rowHeight)
  .lineTo(doc.page.width - 50, tableTop + rowHeight)
  .stroke();

let y = tableTop + rowHeight + 10;

// Ligne d'article
doc.font(fontBase).fontSize(10);
doc.text("ETAPE1", itemColumnX, y, { width: columnWidth });
doc.text("100000", amountColumnX, y, {
  width: amountWidth,
  align: "right",
});
y += rowHeight;

doc
  .lineWidth(0.5)
  .moveTo(itemColumnX, y)
  .lineTo(doc.page.width - 50, y)
  .stroke();
y += 15;

// --- Totaux ---
doc.moveDown(1);
doc.fontSize(10).font(fontBase);
doc.moveDown(0.5);
doc.text(`Sous-total: 5000 CFA`, { align: "right", fillColor: "red" });
doc.moveDown(0.2);
doc.text(`Taxe: 0,05 CFA`, { align: "right" });
doc.moveDown(0.5);
doc.fontSize(12).text(`TOTAL: 5000 CFA`, { align: "right" });
doc.moveDown(2);

// Méthode de paiement
doc
  .fontSize(8)
  .font(fontBase)
  .text("MÉTHODE DE PAIEMENT", { underline: true, align: "left" });
doc.text("OrangeMoney", { align: "left" });
doc.text(`BNK 0101010101010`, { align: "left" });
doc.moveDown(1);

// Signature
doc.font(fontBold).fontSize(10).text("SIGNATURE", { align: "right" });

doc.end();
