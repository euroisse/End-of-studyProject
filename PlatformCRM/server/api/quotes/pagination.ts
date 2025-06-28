// server/api/quotes/pagination.ts
import prisma from "~/server/database";
import { createError, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt((query.page as string) || '1');
  const pageSize = parseInt((query.pageSize as string) || '10');
  const skip = (page - 1) * pageSize;
  const take = pageSize;

const userId = parseInt(query.id as string || '');



try {
    
    const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
        UserRole: {
        include: {
            role: true,
        },
        },
},
    });

    if (!user) {
    
    throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé ou non autorisé.',
    });
    }

    // Determine roles
    const isAdmin = user.UserRole.some((userRole) => userRole.role.name === 'admin');
    const isClient = user.UserRole.some((userRole) => userRole.role.name === 'customer');

    let where: any = {}; 
    let total;
    let quotes;

    if (isAdmin) {
    //recuperer tout les devis
    total = await prisma.quote.count(); 
    quotes = await prisma.quote.findMany({
        include: {
        project: { select: { id: true, title: true } },
        stages: true,
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take,
    });
    } else if (isClient) {
    //recuperer les devis du client
    where = {
        project: {
        customerId: userId,
        },
    };
    total = await prisma.quote.count({ where }); 
    quotes = await prisma.quote.findMany({
        where,
        include: {
        project: { select: { id: true, title: true } },
        stages: true,
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take,
    });
    } else {
    
    throw createError({
        statusCode: 403,
        statusMessage: 'Accès non autorisé pour ce rôle.',
    });
    }

    // Calculate total price 
    const quotesWithTotalPrice = quotes.map(quote => {
    const totalPrice = quote.stages.reduce((sum, stage) => sum + stage.prix, 0);
    return {
        id: quote.id,
        number: quote.number,
        projectName: quote.project?.title || 'null',
        totalPrice: totalPrice,
        status: quote.status,
        createdAt: quote.createdAt,
    };
    });

    // Return paginated data and pagination info
    return {
    data: quotesWithTotalPrice,
    pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    },
    };
} catch (error: any) {
    console.error('Erreur lors de la récupération des devis paginés :', error);

    throw createError({
    statusCode: 500,
    statusMessage: 'Impossible de récupérer les devis paginés en raison d\'une erreur interne.',
    });
}
});