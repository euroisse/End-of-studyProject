<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar @logout="openDeleteModal" />
    <!-- Main Content -->
    <main class="ml-64 flex-1">
      <NavigationTop @logout="openDeleteModal" />
      <div class="p-6 pt-20">
        <slot />
      </div>
      <div
        v-if="showLogoutConfirmation"
        class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-30 backdrop-blur-sm"
      >
        <div class="bg-white rounded-md shadow-lg p-6">
          <p class="mb-4 text-lg font-semibold text-gray-800">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>
          <div class="flex justify-end space-x-2">
            <button
              @click="showLogoutConfirmation = false"
              class="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              @click="logoutUser"
              class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/dashboard/Sidebar.vue";
import NavigationTop from "~/components/dashboard/NavigationTop.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showLogoutConfirmation = ref(false);
const openDeleteModal = () => {
  showLogoutConfirmation.value = true;
};
const logoutUser = () => {
  localStorage.removeItem("user");
  console.log("Déconnexion de l'utilisateur...");
  router.push("/");
};
</script>

<style scoped></style>
