<template>
    <div class="min-h-screen flex flex-col">
      <Header  v-if="activeTab === null"
        @open-login="setActiveTab('login')"
        @open-register="setActiveTab('register')"
      />
      <AuthPage v-if="activeTab !== null" :activeTab="activeTab" />
      <div v-if="activeTab === null">
      <slot />
    </div>
   
</div>
  </template>
  
  <script setup lang="ts">
  import Header from "~/components/iu/Header.vue";
  import { ref } from "vue";
  import AuthPage from "~/components/AuthPage.vue";
  

  const activeTab = ref<string | null>(null);
  
  const setActiveTab = (tab: string) => {
    activeTab.value = tab;
  };
  </script>
  
  <style scoped></style>