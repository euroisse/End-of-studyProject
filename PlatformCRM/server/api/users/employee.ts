import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    try {
      const employee = await prisma.user.findMany({
        where: {
          UserRole: { 
            some: {
              role: {
                name: 'employee',
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true
        },
      });

      const employeOptions = employee.map((employee) => ({
        value: employee.id,
        label: employee.name,
      }));

       return employeOptions;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des employees:", error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || "Impossible de récupérer les employees",
      });
    }
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }
});
