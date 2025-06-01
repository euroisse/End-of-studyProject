<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row"
    >
      <div class="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
        <img
          :src="heroImage"
          alt="Illustration connexion"
          class="w-full h-full object-cover object-top"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex flex-col justify-center text-center p-8"
        >
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
            OpenCRM
          </h1>
          <h4 class="text-white text-lg mb-6">
            Gérez vos projets et clients en toute simplicité
          </h4>
        </div>
      </div>

      <div class="md:w-1/2 p-6 md:p-8">
        <div class="flex mb-8 border-b border-gray-200">
          <button
            @click="activeTabLocal = 'login'"
            :class="[
              'px-4 py-3 font-medium whitespace-nowrap cursor-pointer',
              activeTabLocal === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-500',
            ]"
          >
            Connexion
          </button>
        </div>

        <Login v-if="activeTabLocal === 'login'" @login="handleLogin" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import image1 from "~/assets/Images/image1.jpg";
import Login from "./authentification/Login.vue";

const heroImage = image1;

const props = defineProps({
  activeTab: {
    type: String,
    default: "login",
  },
});

const activeTabLocal = ref(props.activeTab);

watch(
  () => props.activeTab,
  (newTab) => {
    activeTabLocal.value = newTab;
  }
);

const handleLogin = (loginData: any) => {
  console.log("Login data received in AuthPage:", loginData);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
