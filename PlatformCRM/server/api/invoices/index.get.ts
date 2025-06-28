import prisma from "~/server/database";
import { defineEventHandler, getQuery } from "h3"; 

export default defineEventHandler(async (event) => {
  try {
    // 1. Lire le paramètre de requête
    const query = getQuery(event);
    const quoteId = query.quoteId ? parseInt(query.quoteId.toString(), 10) : undefined;

    // 2. Définir la clause where de Prisma de manière conditionnelle
    const whereClause: any = {};
    if (quoteId) {
      whereClause.quoteId = quoteId;
    }

    // 3. Récupérer les factures avec le filtre
    const invoices = await prisma.invoice.findMany({
      where: whereClause, 
      select: {
        id: true,
        invoiceNumber: true,
        invoiceDate: true,
        amountPaid: true, 
        quote: {
          select: {
            id: true,
            customerId: true,
            customer: {
              select: {
                name: true 
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc' // Tri par date de création,
      },
    });

    // Retourne la liste des factures
    return new Response(JSON.stringify(invoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("API Error fetching invoices:", error);
    // Retourne un message d'erreur plus détaillé
    return new Response(JSON.stringify({ message: error.message || "Erreur interne du serveur lors de la récupération des factures." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});