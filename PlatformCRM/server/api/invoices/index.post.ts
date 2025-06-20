import { defineEventHandler, readBody, createError } from 'h3';
import { createInvoice } from '../services/invoice'; // Votre service existant
import type { CreateInvoicePayload } from '~/types'; // Votre type de payload
import generateInvoicePdf from '../services/pdf'; // Votre service de génération PDF
import prisma from "~/server/database"; // Importez Prisma

// Fonction utilitaire pour récupérer les IDs des admins (peut être déplacée)
async function getAdminUserIds() {
  const admins = await prisma.user.findMany({
    where: {
      UserRole: {
        some: {
          role: {
            name: "admin",
          },
        },
      },
    },
    select: { id: true },
  });
  return admins.map(admin => admin.id);
}


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateInvoicePayload>(event);

    if (!body.quoteId || !body.amountPaid || !body.invoiceDate || !body.paymentMethod || !body.userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données de facture incomplètes.',
      });
    }

    const result = await createInvoice(body); // Ceci crée la facture via votre service

    // --- Notification après création de la facture ---
    if (result.invoice) {
      // Notifier le client de la nouvelle facture
      await prisma.notification.create({
        data: {
          message: `Une nouvelle facture (${result.invoice.invoiceNumber}) a été générée pour votre projet "${result.projectName}".`,
          type: "facture_generee",
          userId: result.invoice.userId, // ID du client
          invoiceId: result.invoice.id, // Lier à l'ID de la facture
        },
      });

      // Notifier l'admin qu'une facture a été générée
      const adminIds = await getAdminUserIds();
      for (const adminId of adminIds) {
        await prisma.notification.create({
          data: {
            message: `Une facture (${result.invoice.invoiceNumber}) a été générée pour le client ${result.clientName}.`,
            type: "facture_generee_admin",
            userId: adminId,
            invoiceId: result.invoice.id,
          },
        });
      }

      await generateInvoicePdf(result.invoice);
    } else {
      console.log('Erreur lors de la génération du pdf ou la facture n\'a pas été retournée.');
    }
    // --- Fin Notification ---

    return {
      statusCode: 201,
      message: result.message,
      invoice: result.invoice,
      clientName: result.clientName,
      projectName: result.projectName,
      newBalanceDue: result.newBalanceDue,
    };
  } catch (error: any) {
    console.error('API Error creating invoice:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Erreur interne du serveur lors de la création de la facture.',
    });
  }
});