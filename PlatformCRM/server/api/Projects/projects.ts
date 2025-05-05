import prisma from '~/server/database';
import type { Project } from '~/generated/prisma';


export default defineEventHandler(async (event) => {
    //verifie la methode
  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { customerId, title, description, startDate, endDate } = body;

      if (!customerId || !title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'L\'ID du client et le titre sont obligatoires.',
        });
      }

      const newProject: Project = await prisma.project.create({
        data: {
          customerId: parseInt(customerId as string),
          title: title as string,
          description: description as string | undefined,
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined,
        },
      });

      return newProject;
    } catch (error: any) {
      console.error('Error creating project:', error);
      return createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Failed to create project',
      });
    }
  } else {
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }
});