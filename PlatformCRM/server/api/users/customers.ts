import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    try {
      const customers = await prisma.user.findMany({
        where: {
          UserRole: { 
            some: {
              role: {
                name: 'customer',
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const customerOptions = customers.map((customer) => ({
        value: customer.id,
        label: customer.name,
      }));

       return customerOptions;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || "Impossible de récupérer les clients",
      });
    }
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }
});
