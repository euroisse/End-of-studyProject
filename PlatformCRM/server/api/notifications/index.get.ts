
import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = parseInt(query.userId as string);
    const userRoleNameRaw = query.role as string;

    let userRoleNameNormalized: string | null = null;
    if (userRoleNameRaw) {
      const lowerCaseRole = userRoleNameRaw.toLowerCase();
      if (lowerCaseRole === "customer") {
        userRoleNameNormalized = "Client";
      } else if (lowerCaseRole === "employee") {
        userRoleNameNormalized = "Employee";
      } else if (lowerCaseRole === "admin") {
        userRoleNameNormalized = "Admin";
      }
    }

    if (isNaN(userId) || !userRoleNameNormalized) {
      throw createError({
        statusCode: 400,
        statusMessage: "L'ID utilisateur et le rôle sont requis ou invalides.",
      });
    }

    let notifications = [];
    // Condition de base: non lues.
    // userId est appliqué dans le where de chaque case si pertinent.
    const baseWhereConditions: any = {
        read: false, 
    };

    switch (userRoleNameNormalized) {
      case "Client":
        notifications = await prisma.notification.findMany({
          where: {
            ...baseWhereConditions,
            userId: userId, // Les notifications client sont toujours spécifiques à l'utilisateur
            type: {
              in: [
                "devis_a_valider",
                "projet_cree",
                "facture_generee",
                "devis_valide", // Ex: notification quand un devis envoyé au client est validé par l'admin
                "devis_refuse", // Ex: notification quand un devis envoyé au client est refusé par l'admin
              ],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            quote: { select: { id: true, number: true, status: true } },
            project: { select: { id: true, title: true } },
            invoice: { select: { id: true, invoiceNumber: true } },
          },
        });
        break;

      case "Employee":
        notifications = await prisma.notification.findMany({
          where: {
            ...baseWhereConditions,
            userId: userId, // Les notifications employé sont toujours spécifiques à l'utilisateur
            type: {
              in: [
                "projet_affecte", // Quand un employé est affecté à un projet
                "tache_assignee", // Quand une tâche lui est assignée
                "statut_tache_mis_a_jour_employe", // Ex: notification quand le statut d'une tâche de cet employé est mise à jour (par lui-même ou par admin)
              ],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            project: { select: { id: true, title: true } },
            task: { select: { id: true, title: true, status: true } },
          },
        });
        break;

      case "Admin":
        
        notifications = await prisma.notification.findMany({
          where: {
            read: false, // L'admin aussi ne veut voir que les non lues
            OR: [
              // Notifications spécifiques à cet admin (ex: si des messages directs lui sont envoyés)
              { userId: userId }, 
              
            ],
            type: {
              in: [
                "devis_cree_admin", // Nouveau devis créé (pour l'admin à vérifier)
                "devis_valide", // Un client a validé un devis
                "devis_refuse", // Un client a refusé un devis
                "nouveau_projet_admin", // Un nouveau projet a été créé (pour l'admin à assigner)
                "facture_generee_admin", // Une facture a été générée
                "changement_statut_tache_termine", // Une tâche a été marquée comme terminée
                // Ajoutez ici tous les autres types de notifications que l'admin doit voir
              ],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            quote: { select: { id: true, number: true, status: true } },
            project: { select: { id: true, title: true } },
            invoice: { select: { id: true, invoiceNumber: true } },
            task: { select: { id: true, title: true, status: true } },
            user: { select: { id: true, name: true, email: true } }, // Pour identifier l'utilisateur lié à la notification (client/employé)
          },
        });
        break;

      default:
        throw createError({
          statusCode: 403,
          statusMessage: "Rôle utilisateur non reconnu ou non autorisé.",
        });
    }

    return notifications;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des notifications:", error);
    

  }
});