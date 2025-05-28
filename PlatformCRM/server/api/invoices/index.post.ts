
import { defineEventHandler, readBody, createError } from 'h3';
import { createInvoice } from '../services/invoice';
import type { CreateInvoicePayload } from '~/types'; 
import generateInvoicePdf from '../services/pdf';
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateInvoicePayload>(event);

  
    if (!body.quoteId || !body.amountPaid || !body.invoiceDate || !body.paymentMethod || !body.userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données de facture incomplètes.',
      });
    }

    const result = await createInvoice(body);
    
 if (result.invoice) {
      await generateInvoicePdf(result.invoice);
    } else {
     console.log('Erreur lors de la genération du pdf')
    }
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