import prisma from '~/server/database'; 

export default defineEventHandler(async (event) => {
    try {
        // Rechercher le rôle "employee" dans la base de données
        const employeeRole = await prisma.role.findUnique({
            where: { name: 'employee' },
            select: {
                id: true,
                name: true,
            },
        });

        // Si le rôle "employee" n'est pas trouvé
        if (!employeeRole) {
            throw createError({
                statusCode: 404,
                message: 'Le rôle "employee" est introuvable dans la base de données.',
            });
        }

        // Renvoyer les informations du rôle
        return {
            id: employeeRole.id,
            name: employeeRole.name,
        };

    } catch (error:any) {
        console.error('Erreur lors de la récupération du rôle "employee":', error);
        throw createError({
           
        });
    }
});