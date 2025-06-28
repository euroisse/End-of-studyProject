import prisma from '~/server/database'; 

export default defineEventHandler(async (event) => {
    try {
        // Rechercher le rôle "customer" dans la base de données
        const adminRole = await prisma.role.findUnique({
            where: { name: 'admin' },
            select: {
                id: true,
                name: true,
            },
        });

        // Si le rôle "customer" n'est pas trouvé
        if (!adminRole) {
            throw createError({
                statusCode: 404,
                message: 'Le rôle "admin" est introuvable dans la base de données.',
            });
        }

        // Renvoyer les informations du rôle
        return {
            id: adminRole.id,
            name: adminRole.name,
        };

    } catch (error:any) {
        console.error('Erreur lors de la récupération du rôle "admin":', error);
        throw createError({
           
        });
    }
});