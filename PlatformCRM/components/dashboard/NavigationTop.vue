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
                class="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition rounded-md relative"
              >
                <button
                  class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  @click.stop="closeNotification(notification.id)"
                  title="Fermer"
                >
                  <i class="ri-close-line"></i>
                </button>
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
                      v-else-if="notification.type === 'tache_assignee'"
                      class="ri-task-line text-blue-500 text-xl"
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
                  <!-- Indicateur de notification non lue -->
                  <div
                    v-if="!notification.read"
                    class="w-2 h-2 bg-red-500 rounded-full mt-2"
                  ></div>
                </div>
              </a>
              <div
                v-if="filteredNotifications.length > 0"
                class="border-t border-gray-200 flex justify-between items-center px-4 py-2"
              >
                <button
                  class="text-sm text-indigo-600 hover:bg-gray-100 px-2 py-1 rounded transition"
                  @click="markAllAsRead"
                >
                  Tout marquer comme lu
                </button>
                <button
                  class="text-sm text-gray-500 hover:bg-gray-100 px-2 py-1 rounded transition"
                  @click="showNotifications = false"
                >
                  Quitter
                </button>
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useIsRole } from "~/composables/useIsRole";
import { useRouter } from "vue-router";
import type { Notification } from "~/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const router = useRouter();
const { userName, isEmploye, isClient, isAdmin } = useIsRole();

// Type pour l'objet utilisateur stocké dans localStorage
interface UserData {
  id?: number;
  name?: string;
  roles?: string[];
}

const user = ref<UserData | null>(null);
const notifications = ref<Notification[]>([]);
const showNotifications = ref(false);
const isLoading = ref(false);

// Computed property pour déterminer le rôle de l'utilisateur
const userRole = computed(() => {
  if (isAdmin.value) return "admin";
  if (isEmploye.value) return "employee";
  if (isClient.value) return "customer";
  return null;
});

const notificationCount = computed(
  () => filteredNotifications.value.filter((n) => !n.read).length
);

// Cette computed property filtre les notifications selon le rôle
const filteredNotifications = computed(() => {
  if (!userRole.value || notifications.value.length === 0) return [];

  const role = userRole.value;
  switch (role) {
    case "admin":
      return notifications.value;
    case "customer":
      return notifications.value.filter((n) =>
        [
          "projet_cree",
          "devis_envoye",
          "facture_generee",
          "facture_cree",
          "devis_valide",
          "devis_a_valider",
        ].includes(n.type)
      );
    case "employee":
      return notifications.value.filter((n) =>
        [
          "tache_assignee",
          "statut_tache_mis_a_jour_employe",
          "nouveau_projet_disponible",
        ].includes(n.type)
      );
    default:
      return [];
  }
});

onMounted(() => {
  // Initialiser l'utilisateur depuis localStorage
  initializeUser();
});

const initializeUser = () => {
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
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    user.value = null;
  }
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;

  if (showNotifications.value) {
    // Rafraîchir les notifications à l'ouverture
    await fetchNotifications();
    // NE MARQUE PLUS TOUT COMME LU ICI
  }
};

const fetchNotifications = async () => {
  if (!user.value?.id || !userRole.value || isLoading.value) {
    notifications.value = [];
    return;
  }

  isLoading.value = true;
  try {
    const data: Notification[] = await $fetch(
      `/api/notifications?role=${userRole.value}&userId=${user.value.id}`
    );

    // Trier les notifications par date de création (plus récentes en premier)
    notifications.value = data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(
      `${data.length} notifications récupérées pour le rôle ${userRole.value}`
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    notifications.value = [];
  } finally {
    isLoading.value = false;
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

    // Mettre à jour l'état local
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

const markAllAsRead = async () => {
  const unreadIds = filteredNotifications.value
    .filter((n) => !n.read)
    .map((n) => n.id);
  await markNotificationsAsRead(unreadIds);
  filteredNotifications.value.forEach((n) => (n.read = true));
};

// Méthode pour rafraîchir manuellement les notifications
const refreshNotifications = async () => {
  await fetchNotifications();
};

// Exposer la méthode pour pouvoir l'appeler depuis l'extérieur
defineExpose({
  refreshNotifications,
});

// Utiliser une dépendance réactive pour déclencher fetchNotifications
watch(
  [() => user.value?.id, userRole],
  ([newUserId, newRole], [oldUserId, oldRole]) => {
    if (newUserId && newRole) {
      if (
        newUserId !== oldUserId ||
        newRole !== oldRole ||
        (oldUserId === undefined && oldRole === undefined)
      ) {
        fetchNotifications();
      }
    } else if (!newUserId || !newRole) {
      notifications.value = [];
    }
  },
  { immediate: true }
);

function notificationTitle(type: string) {
  switch (type) {
    case "devis_a_valider":
      return "Devis à valider";
    case "facture_generee":
    case "facture_generee_admin":
      return "Nouvelle facture";
    case "projet_cree":
    case "nouveau_projet_admin":
      return "Nouveau projet";
    case "devis_valide":
      return "Devis validé";
    case "devis_refuse":
      return "Devis refusé";
    case "devis_cree_admin":
      return "Nouveau devis créé";
    case "projet_affecte":
      return "Projet affecté";
    case "tache_assignee":
      return "Tâche assignée";
    case "statut_tache_mis_a_jour_employe":
      return "Statut de tâche mis à jour";
    case "changement_statut_tache_termine":
      return "Tâche terminée";
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

const closeNotification = async (id: number) => {
  await markNotificationsAsRead([id]);
  // On ne retire plus la notification du tableau, elle reste affichée mais marquée comme lue
  notifications.value.forEach((n) => {
    if (n.id === id) n.read = true;
  });
};
</script>

<style scoped>
/* Vos styles existants */
</style>
