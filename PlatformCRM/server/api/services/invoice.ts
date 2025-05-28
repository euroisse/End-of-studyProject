import prisma from "~/server/database";
import type { CreateInvoicePayload } from "~/types"; // Assurez-vous que ce chemin est correct

enum PaymentMethodEnum {
  OrangeMoney = 'OrangeMoney',
  MTNMoney = 'MTNMoney',
  BankTransfer = 'BankTransfer',
  Cash = 'Cash',
}

export async function createInvoice(payload: CreateInvoicePayload) {
  // Déstructurez newTotalPrice du payload
  const { quoteId, amountPaid, invoiceDate, paymentMethod, userId, newTotalPrice } = payload; 

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        stages: true,
        project: true,
        customer: true,
      },
    });

    if (!quote) {
      throw new Error(`Devis avec l'ID ${quoteId} non trouvé.`);
    }

    
    const totalQuoteAmount = quote.totalPrice ?? newTotalPrice; 

    // Vérification pour s'assurer que totalQuoteAmount est un nombre valide
    if (typeof totalQuoteAmount !== 'number' || isNaN(totalQuoteAmount)) {
      throw new Error("Le montant total du devis n'a pas pu être déterminé. Veuillez vérifier quote.totalPrice ou newTotalPrice.");
    }

    // 2. Récupérer les factures existantes pour ce devis
    const existingInvoices = await prisma.invoice.findMany({
      where: { quoteId: quoteId },
    });

    const totalAmountAlreadyPaid = existingInvoices.reduce(
      (sum, inv) => sum + inv.amountPaid,
      0
    );
    const newTotalAmountPaid = totalAmountAlreadyPaid + amountPaid;
    const balanceDue = totalQuoteAmount - newTotalAmountPaid;

    // 3. Générer un numéro de facture unique
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: 'FACT-' 
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    let newInvoiceNumber: string;
    if (lastInvoice) {
      // S'assurer que le préfixe est bien 'FACT-' avant de parser
      const lastNumberPart = lastInvoice.invoiceNumber.split('-')[1];
      const lastNumber = parseInt(lastNumberPart);
      // Vérifier si lastNumber est un nombre valide
      if (!isNaN(lastNumber)) {
        newInvoiceNumber = `FACT-${String(lastNumber + 1).padStart(4, '0')}`;
      } else {
        // Fallback si le numéro est invalide (ex: 'FACT-ABC')
        console.warn(`Numéro de facture invalide trouvé: ${lastInvoice.invoiceNumber}. Réinitialisation à FACT-0001.`);
        newInvoiceNumber = `FACT-${String(1).padStart(4, '0')}`;
      }
    } else {
      newInvoiceNumber = `FACT-${String(1).padStart(4, '0')}`;
    }

    let validatedPaymentMethod: PaymentMethodEnum;
    switch (paymentMethod) {
      case PaymentMethodEnum.OrangeMoney:
        validatedPaymentMethod = PaymentMethodEnum.OrangeMoney;
        break;
      case PaymentMethodEnum.MTNMoney:
        validatedPaymentMethod = PaymentMethodEnum.MTNMoney;
        break;
      case PaymentMethodEnum.BankTransfer:
        validatedPaymentMethod = PaymentMethodEnum.BankTransfer;
        break;
      case PaymentMethodEnum.Cash:
        validatedPaymentMethod = PaymentMethodEnum.Cash;
        break;
      default:
        throw new Error(`Méthode de paiement invalide fournie: "${paymentMethod}". Les options valides sont: ${Object.values(PaymentMethodEnum).join(', ')}.`);
    }

    // 4. Créer la nouvelle facture
    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
        quote: { connect: { id: quoteId } },
        totalAmount: totalQuoteAmount,
        amountPaid: amountPaid,
        balanceDue: balanceDue,
        invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
        paymentMethod: validatedPaymentMethod,
        User: { connect: { id: userId } },
      },
      include: {
        quote:  {include: {
          customer: true,
          stages: {include: {projectStage: true}},       
        }},
        User: true
      }
    });

    const clientName = quote.customer?.name;
    const projectName = quote.project?.title;

    return {
      success: true,
      message: "Facture créée avec succès.",
      invoice: newInvoice,
      clientName: clientName,
      projectName: projectName,
      newBalanceDue: balanceDue,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la facture:", error);
    throw error; 
  }
}


