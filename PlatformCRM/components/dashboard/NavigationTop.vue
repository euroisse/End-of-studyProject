<template>
  <div>
    <!-- Top Navigation -->
    <header class="bg-white shadow-sm fixed top-0 left-64 right-0 z-10">
      <div class="flex items-center justify-between px-8 py-4">
        <!-- Search -->
        <div class="flex items-center space-x-4">
          <!-- <div class="relative w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              class="pl-10 w-full pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div> -->
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4 relative">
          <!-- Notifications -->
          <div class="relative">
            <button @click="toggleNotifications">
              <i class="ri-notification-3-line text-gray-600 text-xl"></i>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
              >
                {{ notifications.length }}
              </span>
            </button>

            <!-- Dropdown -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50"
            >
              <div class="p-4 border-b">
                <h3 class="font-semibold">Notifications</h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="p-4 border-b hover:bg-gray-50"
                >
                  <div class="flex items-start space-x-3">
                    <i
                      :class="notification.icon + ' text-indigo-600 text-lg'"
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
                </div>
              </div>
            </div>
          </div>

          <!-- Profile -->
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <i class="ri-user-line text-indigo-600 text-xl"></i>
            </div>
            <span class="font-medium">{{ user.name }}</span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const user = ref({
  name: "Jean Dupont",
});

const notifications = [
  {
    id: 1,
    icon: "ri-information-line",
    message: "Nouvelle mise à jour du projet E-commerce disponible",
    time: "Il y a 5 minutes",
  },
  {
    id: 2,
    icon: "ri-error-warning-line",
    message: "Date limite du projet Marketing approche",
    time: "Il y a 30 minutes",
  },
  {
    id: 3,
    icon: "ri-checkbox-circle-line",
    message: "Devis #2025-043 validé par le client",
    time: "Il y a 1 heure",
  },
];

const showNotifications = ref(false);
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};
</script>

<style scoped></style>
