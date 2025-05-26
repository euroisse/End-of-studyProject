import prisma from "~/server/database";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Récupère toutes les factures, en sélectionnant UNIQUEMENT les champs nécessaires pour le tableau
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true, 
        invoiceNumber: true,
        invoiceDate: true,
      
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    // Retourne la liste des factures
    return new Response(JSON.stringify(invoices), {
      status: 200, 
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("API Error fetching invoices:", error);
    return new Response(JSON.stringify({ message: error.message || "Erreur interne du serveur lors de la récupération." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});