<template>
  <div>
    <header class="bg-white shadow-sm fixed top-0 left-64 right-0 z-10">
      <div class="flex items-center justify-between px-8 py-4">
        <div class="flex items-center space-x-4"></div>

        <div class="flex items-center space-x-4 relative">
          <div class="relative">
            <button @click="toggleNotifications">
              <i class="ri-notification-3-line text-gray-600 text-xl"></i>
              <span
                v-if="notifications.length > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
              >
                {{ notifications.length }}
              </span>
            </button>

            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50"
            >
              <div class="p-4 border-b flex justify-between items-center">
                <h3 class="font-semibold">Notifications</h3>
                <button
                  @click="clearAllNotifications"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Quitter tout
                </button>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="p-4 border-b hover:bg-gray-50 flex items-center justify-between"
                >
                  <div class="flex items-start space-x-3">
                    <i
                      :class="notification.icon + ' text-lg'"
                      :style="{
                        color: getNotificationColor(notification.priority),
                      }"
                    ></i>
                    <div>
                      <p class="text-sm text-gray-800">
                        {{ notification.message }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ notification.time }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="removeNotification(notification.id)"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div
                  v-if="notifications.length === 0"
                  class="p-4 text-center text-gray-600"
                >
                  Aucune nouvelle notification.
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div
              v-if="user?.photoURL"
              class="w-10 h-10 rounded-full overflow-hidden"
            >
              <img
                :src="user.photoURL"
                alt="Photo de profil"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
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
import { ref, computed } from "vue";
const { userName } = useIsRole();

const user = computed(() => {
  const userString = localStorage.getItem("user");
  try {
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    return null;
  }
});

const notifications = ref([
  {
    id: 1,
    icon: "ri-information-line",
    message: "Nouvelle mise à jour du projet E-commerce disponible",
    time: "Il y a 5 minutes",
    priority: "low",
  },
  {
    id: 2,
    icon: "ri-error-warning-line",
    message: "Date limite du projet Marketing approche",
    time: "Il y a 30 minutes",
    priority: "high",
  },
  {
    id: 3,
    icon: "ri-checkbox-circle-line",
    message: "Devis #2025-043 validé par le client",
    time: "Il y a 1 heure",
    priority: "medium",
  },
]);

const showNotifications = ref(false);
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id
  );
};

const clearAllNotifications = () => {
  notifications.value = [];
  showNotifications.value = false;
};

const getNotificationColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "orange";
    case "low":
      return "green";
    default:
      return "gray";
  }
};
</script>

<style scoped></style>
