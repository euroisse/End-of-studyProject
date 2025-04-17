<template>
  <!-- Header -->
  <header class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold text-indigo-700">OpenCRM</h1>
      </div>
      <nav class="hidden md:flex items-center space-x-8">
        <NuxtLink
          class="text-gray-700 hover:text-indigo-600 font-medium cursor-pointer"
          >Accueil</NuxtLink
        >
        <NuxtLink
        to="contacts"
          class="text-gray-700 hover:text-indigo-600 font-medium cursor-pointer"
          >Contacts</NuxtLink
        >
      </nav>
      <div class="flex items-center space-x-4">
        <Button
          content="Se connecter"
          customClass="text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap cursor-pointer !rounded-button"
        />

        <Button
          content=" Créer un compte"
          customClass="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap cursor-pointer !rounded-button"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from "./Button.vue";
</script>

<style scoped></style>
