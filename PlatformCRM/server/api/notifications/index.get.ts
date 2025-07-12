import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = parseInt(query.userId as string);
    const userRoleNameRaw = query.role as string;

    console.log("--- Début Requête Notifications ---");
    console.log(`[GET /api/notifications] Reçu -> userId: ${userId}, roleRaw: "${userRoleNameRaw}"`);
    
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
    
    console.log(`[GET /api/notifications] Rôle normalisé: "${userRoleNameNormalized}"`);
    
    if (isNaN(userId) || !userRoleNameNormalized) {
      throw createError({
        statusCode: 400,
        statusMessage: "L'ID utilisateur et le rôle sont requis ou invalides.",
      });
    }

    let notifications = [];

    switch (userRoleNameNormalized) {
      case "Client":
        notifications = await prisma.notification.findMany({
          where: {
            read: false,
            userId: userId, // Les notifications client sont toujours spécifiques à l'utilisateur
            type: {
              in: [
                "devis_a_valider",
                "projet_cree",
                "facture_generee",
                "devis_valide",
                "devis_refuse",
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
        console.log(`[GET /api/notifications] Client - ${notifications.length} notifications trouvées.`);
        break;

      case "Employee":
        notifications = await prisma.notification.findMany({
          where: {
            read: false,
            userId: userId, // Les notifications employé sont toujours spécifiques à l'utilisateur
            type: {
              in: [
                "projet_affecte",
                "tache_assignee",
                "statut_tache_mis_a_jour_employe",
                 "nouveau_projet_disponible",
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
        console.log(`[GET /api/notifications] Employee - ${notifications.length} notifications trouvées.`);
        break;

      case "Admin":
        // CORRECTION PRINCIPALE : L'admin doit voir TOUTES les notifications admin, pas seulement celles avec son userId
        notifications = await prisma.notification.findMany({
          where: {
            read: false,
            userId: userId,
            type: {
              in: [
                "devis_cree_admin",
                "devis_valide",
                "devis_refuse", 
                "nouveau_projet_admin",
                "facture_generee_admin",
                 "nouvelle_tache_admin", 
                "changement_statut_tache_termine",
                "devis_supprime", // Ajouté si vous l'utilisez
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
            user: { select: { id: true, name: true, email: true } },
          },
        });
        console.log(`[GET /api/notifications] Admin - ${notifications.length} notifications trouvées.`);
        break;

      default:
        throw createError({
          statusCode: 403,
          statusMessage: "Rôle utilisateur non reconnu ou non autorisé.",
        });
    }
    
    console.log("--- Fin Requête Notifications ---");
    return notifications;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des notifications:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la récupération des notifications",
    });
  }
});