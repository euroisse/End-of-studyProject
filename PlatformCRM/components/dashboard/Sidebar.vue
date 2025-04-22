<template>
    <aside class="w-64 bg-white shadow-lg fixed h-screen">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-indigo-600">OpenCRM</h1>
      </div>
      <nav class="mt-6 space-y-1">
        <template v-for="item in menuItems" :key="item.label">
          <div v-if="item.children" class="relative">
            <div
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer"
              @click="toggleSubMenu(item.label)"
              :class="{
                'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': isSubMenuOpen(item.label) && !isChildActive(item),
                'font-semibold': isSubMenuOpen(item.label) && !isChildActive(item),
              }"
            >
              <i :class="`${item.icon} w-5`"></i>
              <span class="mx-4">{{ item.label }}</span>
              <i class="ri-arrow-right-s-line ml-auto" :class="{ 'rotate-90': isSubMenuOpen(item.label) }"></i>
            </div>
            <div
              v-if="isSubMenuOpen(item.label)"
              class="absolute left-full top-0 mt-1 bg-white shadow-md rounded-md w-48 z-30"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.label"
                :to="child.to"
                class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                :class="isActive(child.to) ? 'font-semibold text-indigo-600' : ''"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>
          <NuxtLink
            v-else
            :to="item.to"
            class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
            :class="isActive(item.to) ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-semibold' : ''"
          >
            <i :class="`${item.icon} w-5`"></i>
            <span class="mx-4">{{ item.label }}</span>
            <span v-if="item.badge" class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {{ item.badge }}
            </span>
          </NuxtLink>
        </template>
      </nav>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const userRole = 'admin';
  const adminMenu = [
    { label: 'Tableau de bord', to: '/dashboard', icon: 'ri-dashboard-line' },
    { label: 'Clients', to: '/clients', icon: 'ri-user-3-line' },
    { label: 'Projets', to: '/projects', icon: 'ri-projector-2-line' },
    {
      label: 'Factures & Devis',
      icon: 'ri-file-line',
      children: [
        { label: 'Factures', to: '/factures' },
        { label: 'Devis', to: '/devis' },
      ],
    },
    { label: 'Tâches', to: '/taches', icon: 'ri-task-line' },
    { label: 'Messages', to: '/messages', icon: 'ri-chat-3-line', badge: 0 },
    { label: 'Paramètres', to: '/parametres', icon: 'ri-settings-3-line' },
    
  ];
  const clientMenu = [
    { label: 'Tableau de bord', to: '/dashboard', icon: 'ri-dashboard-line' },
    { label: 'Projets', to: '/projects', icon: 'ri-projector-2-line' },
    {
      label: 'Factures & Devis',
      icon: 'ri-file-invoice-dollar-line',
      children: [
        { label: 'Factures', to: '/factures' },
        { label: 'Devis', to: '/devis' },
      ],
    },
    { label: 'Messages', to: '/messages', icon: 'ri-chat-3-line', badge: 0 },
    { label: 'Profil', to: '/profil', icon: 'ri-user-line' },
  ];
  const menuItems = computed(() => (userRole === 'admin' ? adminMenu : clientMenu));
  const activeSubMenu = ref<string | null>(null);
  const toggleSubMenu = (label: string) => {
    activeSubMenu.value = activeSubMenu.value === label ? null : label;
  };
  const isSubMenuOpen = (label: string) => {
    return activeSubMenu.value === label;
  };
  const isActive = (path: string) => route.path === path;
  const isChildActive = (item: any) => item.children?.some((child: any) => isActive(child.to));
  </script>
  
  <style scoped>
  /* Styles supplémentaires */
  </style>