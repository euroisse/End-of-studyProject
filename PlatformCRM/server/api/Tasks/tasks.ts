// server/api/tasks/index.post.ts
import prisma from "~/server/database";

// Function to get Admin User IDs (consider moving this to a shared utility file like server/utils/admin.ts)
async function getAdminUserIds() {
  const admins = await prisma.user.findMany({
    where: {
      UserRole: {
        some: {
          role: {
            name: "admin", // Ensure the role name is 'Admin' in your DB
          },
        },
      },
    },
    select: { id: true },
  });
  return admins.map(admin => admin.id);
}

export default defineEventHandler(async (event) => {
  console.log('Requête reçue pour la gestion des tâches:', event.node.req.method);

  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      console.log('Données reçues pour la création de la tâche:', body);

      const projectStage = await prisma.projectStage.findUnique({
        where: { id: Number(body.projectStageId) },
        select: { endDate: true }, // Select only the end date
      });

      if (!projectStage) {
        throw createError({
          statusCode: 404,
          statusMessage: `L'étape de projet avec l'ID ${body.projectStageId} n'existe pas.`,
        });
      }

      // 2. Validate task end date against stage end date
      if (body.endDate) {
        const taskEndDate = new Date(body.endDate);
        if (projectStage.endDate && taskEndDate > projectStage.endDate) {
          throw createError({
            statusCode: 400,
            statusMessage: "La date de fin de la tâche ne peut pas être postérieure à la date de fin de l'étape du projet.",
          });
        }
      }

      const newTask = await prisma.tasks.create({
        data: {
          title: body.title,
          description: body.description,
          projectId: Number(body.projectId),
          employeeId: Number(body.employeeId),
          projectStageId: Number(body.projectStageId),
          priority: body.priority,
          status: body.status,
          effort: Number(body.effort),
          endDate: body.endDate ? new Date(body.endDate) : null,
        },
        include: {
          employee: true,
          project: true,
          projectStage: true,
        },
      });

      // Add or update the relationship in EmployeeOnProjects
      await prisma.employeeOnProjects.upsert({
        where: {
          projectId_employeeId: {
            projectId: Number(body.projectId),
            employeeId: Number(body.employeeId)
          }
        },
        update: {},
        create: {
          projectId: Number(body.projectId),
          employeeId: Number(body.employeeId)
        }
      });

      // --- Notifications after task creation ---

      // 1. Notify the assigned employee
      await prisma.notification.create({
        data: {
          message: `Une nouvelle tâche "${newTask.title}" vous a été assignée pour le projet "${newTask.project.title}".`,
          type: "tache_assignee", // New notification type for employees
          userId: newTask.employeeId, // The ID of the assigned employee
          taskId: newTask.id, // Link to the task ID
        },
      });
      console.log(`Notification créée pour l'employé ${newTask.employee.name} (ID: ${newTask.employeeId}) pour la tâche "${newTask.title}".`);


      // 2. Notify all administrators
      const adminIds = await getAdminUserIds();
      for (const adminId of adminIds) {
        await prisma.notification.create({
          data: {
            message: `Une nouvelle tâche "${newTask.title}" a été créée et assignée à ${newTask.employee.name} pour le projet "${newTask.project.title}".`,
            type: "nouvelle_tache_admin", // New notification type for admins
            userId: adminId, // The ID of the admin
            taskId: newTask.id, // Link to the task ID
          },
        });
        console.log(`Notification créée pour l'administrateur (ID: ${adminId}) pour la nouvelle tâche "${newTask.title}".`);
      }
      // --- End Notifications ---

      return newTask;

    } catch (error: any) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Impossible de créer la tâche'
      });
    }
  } else if (event.node.req.method === 'GET') {
    try {
      const tasks = await prisma.tasks.findMany({
        include: {
          employee: true,
          project: true,
          projectStage: true,
        },
      });
      return tasks;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Impossible de récupérer les tâches'
      });
    }
  } else {
    throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' });
  }
});