<template>
  <header class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold text-indigo-700">OpenCRM</h1>
      </div>
      <div
        :class="[
          isMenuOpen ? 'left-0' : 'left-[-100%]',
          'absolute top-0 min-h-[80vh] w-full bg-white backdrop-blur-sm flex flex-col items-center justify-center gap-8 duration-300 overflow-hidden',
          'lg:static lg:min-h-fit lg:bg-transparent lg:w-auto lg:flex lg:flex-row lg:opacity-100 lg:left-auto',
        ]"
      >
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-gray-700 hover:text-indigo-700 font-medium cursor-pointer"
            active-class="text-indigo-800 font-semibold border-b-2 border-indigo-700"
            >Accueil</NuxtLink
          >
          <NuxtLink
            to="/contacts"
            class="text-gray-700 hover:text-indigo-700 font-medium cursor-pointer"
            active-class="text-indigo-800 font-semibold border-b-2 border-indigo-700"
            >Contacts</NuxtLink
          >
        </nav>
        <div class="flex justify-between">
          <div class="flex items-center space-x-4">
            <Button
              v-if="!isLoggedIn"
              content="Se connecter"
              customClass="text-indigo-500 hover:text-indigo-800 font-medium whitespace-nowrap cursor-pointer !rounded-button"
              @click="$emit('open-login')"
            />

            <Button
              v-if="!isLoggedIn"
              content=" Créer un compte"
              customClass="bg-indigo-500 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap cursor-pointer !rounded-button"
              @click="$emit('open-register')"
            />
            <NuxtLink v-if="isLoggedIn" to="/dashboard">
              <Button
                content="Dashboard"
                customClass="text-gray-700 hover:text-indigo-700 font-medium cursor-pointer"
              />
            </NuxtLink>

            <Button
              v-if="isLoggedIn"
              content="Déconnexion"
              customClass="bg-white hover:bg-red-600 hover:text-white text-red-500 px-4 py-2 rounded-lg  transition-all whitespace-nowrap cursor-pointer !rounded-button"
              @click="handleLogout"
            />
          </div>
        </div>
      </div>
      <div
        class="text-xl sm:text-3xl cursor-pointer z-50 lg:hidden"
        @click="toggleMenu"
      >
        <i
          :class="
            isMenuOpen
              ? 'ri-close-line text-[#6B7280]'
              : 'ri-menu-line text-[#6B7280]'
          "
        >
        </i>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from "./Button.vue";
const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const { isLoggedIn, updateLoginStatus } = useIsLogin();

defineEmits(["open-login", "open-register"]);

const handleLogout = () => {
  localStorage.removeItem("user");
  updateLoginStatus();
  navigateTo("/");
};
</script>

<style scoped></style>
