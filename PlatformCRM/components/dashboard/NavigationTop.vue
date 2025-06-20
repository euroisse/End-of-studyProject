<template>
  <div>
    <header class="bg-white shadow-sm fixed top-0 left-64 right-0 z-10">
      <div class="flex items-center justify-between px-8 py-4">
        <div class="flex items-center space-x-4"></div>

        <div class="flex items-center space-x-4">
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :disabled="!user?.id"
            >
              <i class="ri-notification-line text-2xl text-gray-600"></i>
              <span
                v-if="notificationCount > 0"
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
              >
                {{ notificationCount }}
              </span>
            </button>
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20"
            >
              <div
                v-if="filteredNotifications.length === 0"
                class="px-4 py-2 text-sm text-gray-500"
              >
                Aucune nouvelle notification.
              </div>
              <a
                v-for="notification in filteredNotifications"
                :key="notification.id"
                href="#"
                class="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition rounded-md"
                @click="markAndRedirect(notification)"
              >
                <div class="flex items-start space-x-3">
                  <!-- Icône selon le type -->
                  <div>
                    <i
                      v-if="notification.type === 'devis_a_valider'"
                      class="ri-file-list-3-line text-indigo-500 text-xl"
                    ></i>
                    <i
                      v-else-if="notification.type === 'facture_generee'"
                      class="ri-file-text-line text-green-500 text-xl"
                    ></i>
                    <i
                      v-else-if="notification.type === 'projet_cree'"
                      class="ri-folder-add-line text-yellow-500 text-xl"
                    ></i>
                    <i
                      v-else
                      class="ri-notification-2-line text-gray-400 text-xl"
                    ></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-900 mb-1">
                      {{ notificationTitle(notification.type) }}
                    </div>
                    <div class="text-gray-700 text-sm">
                      {{ notification.message }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatDate(notification.createdAt) }}
                    </div>
                  </div>
                </div>
              </a>
              <div
                v-if="filteredNotifications.length > 0"
                class="border-t border-gray-200"
              >
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 text-center"
                  @click="viewAllNotifications"
                  >Voir toutes les notifications</a
                >
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <i class="ri-user-line text-indigo-600 text-xl"></i>
            </div>
            <span class="font-medium">{{ userName }}</span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useIsRole } from "~/composables/useIsRole";
import { useRouter } from "vue-router";
import type { Notification } from "~/types"; // Assurez-vous du chemin correct
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const router = useRouter();

const { userName, isEmploye, isClient, isAdmin } = useIsRole();

// Type pour l'objet utilisateur stocké dans localStorage
interface UserData {
  id?: number;
  name?: string;
  roles?: string[];
  // Ajoutez d'autres propriétés si votre objet user en contient
}

// `user` doit être un ref pour être réactif et mis à jour après la lecture de localStorage
const user = ref<UserData | null>(null);

// Computed property pour déterminer le rôle de l'utilisateur
const userRole = computed(() => {
  if (isAdmin.value) {
    return "admin";
  }
  if (isEmploye.value) {
    return "employee";
  }
  if (isClient.value) {
    return "customer";
  }
  return null;
});

const notifications = ref<Notification[]>([]); // Contient toutes les notifications brutes
const showNotifications = ref(false);

const notificationCount = computed(
  () => filteredNotifications.value.filter((n) => !n.read).length // Compte les notifications non lues APRES filtrage
);

// Cette computed property filtre les notifications selon le rôle
const filteredNotifications = computed(() => {
  if (!userRole.value || notifications.value.length === 0) return [];

  const role = userRole.value;
  switch (role) {
    case "admin":
      return notifications.value;
    case "customer":
      return notifications.value.filter(
        (n) =>
          [
            "projet_cree",
            "devis_envoye",
            "facture_generee",
            "devis_a_valider",
          ].includes(n.type) // Assurez-vous des types corrects
      );
    case "employee":
      return notifications.value.filter(
        (n) =>
          ["tache_assignee", "statut_tache_mis_a_jour_employe"].includes(n.type) // Assurez-vous des types corrects
      );
    default:
      return [];
  }
});

onMounted(() => {
  // Lisez localStorage pour initialiser `user.value`
  const userString = localStorage.getItem("user");
  try {
    const parsedUser: UserData | null = userString
      ? JSON.parse(userString)
      : null;
    if (parsedUser && typeof parsedUser.id === "number") {
      user.value = parsedUser;
    } else {
      console.warn(
        "Les informations utilisateur dans localStorage sont invalides ou incomplètes."
      );
      user.value = null;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération ou de la conversion des informations utilisateur depuis localStorage:",
      error
    );
    user.value = null;
  }
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value && notificationCount.value > 0) {
    // Marquer comme lues les notifications actuellement affichées dans le dropdown
    const unreadNotificationIds = filteredNotifications.value
      .filter((n) => !n.read)
      .map((n) => n.id);
    markNotificationsAsRead(unreadNotificationIds);
  }
};

const fetchNotifications = async () => {
  // Assurez-vous que user.value.id et userRole.value ne sont pas null avant de l'utiliser
  if (!user.value?.id || !userRole.value) {
    notifications.value = []; // Réinitialise si les conditions ne sont pas remplies
    return;
  }

  try {
    // Utilisation de $fetch de Nuxt
    const data: Notification[] = await $fetch(
      `/api/notifications?role=${userRole.value}&userId=${user.value.id}`
    );
    notifications.value = data; // Assurez-vous que les données sont assignées ici
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    notifications.value = []; // En cas d'erreur, vide le tableau
  }
};

const markNotificationsAsRead = async (ids: number[]) => {
  if (ids.length === 0) return;
  if (!user.value?.id) {
    console.error(
      "Impossible de marquer les notifications: ID utilisateur manquant."
    );
    return;
  }

  try {
    await $fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationIds: ids, userId: user.value.id }),
    });
    // Mettre à jour l'état local pour refléter que les notifications sont lues
    notifications.value.forEach((n) => {
      if (ids.includes(n.id)) {
        n.read = true;
      }
    });
  } catch (error) {
    console.error(
      "Erreur lors du marquage des notifications comme lues:",
      error
    );
  }
};

const markAndRedirect = async (notification: Notification) => {
  if (!notification.read) {
    await markNotificationsAsRead([notification.id]);
  }
  showNotifications.value = false; // Fermer le menu après le clic

  // Redirige toujours vers la liste des devis
  if (
    [
      "devis_a_valider",
      "devis_valide",
      "devis_refuse",
      "devis_cree_admin",
    ].includes(notification.type)
  ) {
    router.push("/devis");
    return;
  }

  // Logique de redirection basée sur le type de notification
  switch (notification.type) {
    case "projet_cree":
    case "nouveau_projet_admin":
      if (notification.projectId) {
        router.push(`/projects/${notification.projectId}`);
      }
      break;
    case "facture_generee":
    case "facture_generee_admin":
      if (notification.invoiceId) {
        router.push(`/invoices/${notification.invoiceId}`);
      }
      break;
    case "tache_assignee":
    case "statut_tache_mis_a_jour_employe":
    case "changement_statut_tache_termine":
      if (notification.taskId) {
        router.push(`/tasks/${notification.taskId}`); // Ou une page détaillée de tâche
      }
      break;
    default:
      console.warn(
        "Type de notification inconnu ou aucune redirection définie:",
        notification.type
      );
      break;
  }
};

const viewAllNotifications = () => {
  router.push("/notifications"); // Créez cette page si elle n'existe pas
  showNotifications.value = false;
};

// Utiliser une dépendance réactive pour déclencher fetchNotifications
watch(
  [() => user.value?.id, userRole], // Watch user.value.id (car user est un ref) and userRole (computed)
  ([newUserId, newRole], [oldUserId, oldRole]) => {
    // Ne pas appeler si userId ou role sont null ou n'ont pas changé significativement
    // Ou si c'est la première exécution et que les valeurs sont valides
    if (newUserId && newRole) {
      // Si les deux sont définis
      if (
        newUserId !== oldUserId ||
        newRole !== oldRole ||
        (oldUserId === undefined && oldRole === undefined)
      ) {
        // Déclenche si les valeurs ont changé OU si c'est la première exécution (oldUserId/oldRole sont undefined)
        fetchNotifications();
      }
    } else if (!newUserId || !newRole) {
      notifications.value = []; // Vider les notifications si l'utilisateur ou le rôle n'est plus valide
    }
  },
  { immediate: true } // Exécute immédiatement au montage si les valeurs sont déjà présentes
);

function notificationTitle(type: string) {
  switch (type) {
    case "devis_a_valider":
      return "Devis à valider";
    case "facture_generee":
      return "Nouvelle facture";
    case "projet_cree":
      return "Nouveau projet";
    case "devis_valide":
      return "Devis validé";
    case "devis_refuse":
      return "Devis refusé";
    case "devis_cree_admin":
      return "Nouveau devis créé"; // Nouveau
    case "nouveau_projet_admin":
      return "Nouveau projet créé"; // Nouveau
    case "facture_generee_admin":
      return "Nouvelle facture générée"; // Nouveau
    case "projet_affecte":
      return "Projet affecté"; // Nouveau
    case "tache_assignee":
      return "Tâche assignée"; // Nouveau
    case "statut_tache_mis_a_jour_employe":
      return "Statut de tâche mis à jour"; // Nouveau
    case "changement_statut_tache_termine":
      return "Tâche terminée"; // Nouveau
    default:
      return "Notification";
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    return format(new Date(dateStr), "dd MMM yyyy à HH:mm", { locale: fr });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
/* Vos styles existants */
</style>
