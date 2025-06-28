import { readFile } from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const number = query?.id;
  if (!number) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Numéro de devis manquant.',
    });
  }

  const filename = `devis_${number}.pdf`;
  const filePath = path.join(process.cwd(), 'quotes', filename);

  try {
    const buffer = await readFile(filePath);

    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`);
    setHeader(event, 'Content-Type', 'application/pdf');

    return buffer;
  } catch (error: any) {
    console.error(`Erreur lors de la lecture du fichier PDF ${filename}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la lecture du fichier PDF.',
    });
  }
});