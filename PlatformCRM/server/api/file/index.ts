
import { readFile } from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const invoiceNumber = query?.id;
  if (!invoiceNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Numéro de facture manquant.',
    });
  }

  const filename = `facture_${invoiceNumber}.pdf`;
  const filePath = path.join(process.cwd(), 'invoices', filename);

  try {
    const buffer = await readFile(filePath);

    
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`);
    setHeader(event, 'Content-Type', 'application/pdf');

    return buffer;
  } catch (error: any) {
    console.error(`Erreur lors de la lecture du fichier PDF ${filename}:`, error);
  }
});
