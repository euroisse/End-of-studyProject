import prisma from '~/server/database'; 

export default defineEventHandler(async (event) => {
    try {
        // Rechercher le rôle "customer" dans la base de données
        const customerRole = await prisma.role.findUnique({
            where: { name: 'customer' },
            select: {
                id: true,
                name: true,
            },
        });

        // Si le rôle "customer" n'est pas trouvé
        if (!customerRole) {
            throw createError({
                statusCode: 404,
                message: 'Le rôle "customer" est introuvable dans la base de données.',
            });
        }

        // Renvoyer les informations du rôle
        return {
            id: customerRole.id,
            name: customerRole.name,
        };

    } catch (error:any) {
        console.error('Erreur lors de la récupération du rôle "customer":', error);
        throw createError({
           
        });
    }
});