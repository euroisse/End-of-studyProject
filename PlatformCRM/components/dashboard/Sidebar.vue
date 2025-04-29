<template>
  <aside class="w-64 bg-white shadow-lg fixed h-screen">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-indigo-600">OpenCRM</h1>
    </div>
    <nav class="mt-6 space-y-1">
      <template v-for="item in currentMenuItems" :key="item.label">
        <div v-if="item.children" class="relative">
          <div
            class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer"
            @click="toggleSubMenu(item.label)"
            :class="{
              'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': isSubMenuOpen(item.label) || isChildActive(item),
              'font-semibold': isSubMenuOpen(item.label) || isChildActive(item),
            }"
          >
            <i :class="`${item.icon} w-5`"></i>
            <span class="mx-4">{{ item.label }}</span>
            <i class="ri-arrow-right-s-line ml-auto" :class="{ 'rotate-90': isSubMenuOpen(item.label) }"></i>
          </div>
       
          <div
            v-if="isSubMenuOpen(item.label)"
            class="bg-white absolute left-full top-0 shadow-md rounded-md w-48 p-3 z-20"
          >
            <NuxtLink
              v-for="child in item.children"
              :key="child.label"
              :to="child.to"
              class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              :class="isActive(child.to) ? 'font-semibold text-indigo-600' : ''"
              @click="closeSubMenus"
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
          <span v-if="item.badge && getNotificationCount(item.to) > 0" class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {{ getNotificationCount(item.to) }}
          </span>
        </NuxtLink>
      </template>
    </nav>
    

    <div class="absolute bottom-4 left-0 right-0 flex justify-center">
      <button 
        @click="toggleUserRole" 
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
      >
        Changer de rôle (Démo)
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();


const userRole = ref('admin'); 

const toggleUserRole = () => {
  userRole.value = userRole.value === 'admin' ? 'client' : 'admin';
};


provide('userRole', userRole);


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
  { label: 'Messages', to: '/messages', icon: 'ri-chat-3-line', badge: true },
  { label: 'Paramètres', to: '/parametres', icon: 'ri-settings-3-line' },
];

const clientMenu = [
  { label: 'Tableau de bord', to: '/dashboard', icon: 'ri-dashboard-line' },
  { label: 'Projets', to: '/projects', icon: 'ri-projector-2-line' },
  {
    label: 'Factures & Devis',
    icon: 'ri-file-line',
    children: [
      { label: 'Factures', to: '/factures' },
      { label: 'Devis', to: '/devis' },
    ],
  },
  { label: 'Messages', to: '/messages', icon: 'ri-chat-3-line', badge: true },
  { label: 'Profil', to: '/profil', icon: 'ri-user-line' },
];

const currentMenuItems = computed(() => {
  return userRole.value === 'admin' ? adminMenu : clientMenu;
});

const activeSubMenu = ref<string | null>(null);


const closeSubMenus = () => {
  activeSubMenu.value = null;
};

const toggleSubMenu = (label: string) => {
  
  activeSubMenu.value = activeSubMenu.value === label ? null : label;
};

const isSubMenuOpen = (label: string) => {
  return activeSubMenu.value === label;
};


const isActive = (path: string) => route.path === path;

const isChildActive = (item: any) => {
  return item.children?.some((child: any) => isActive(child.to));
};

const getNotificationCount = (path: string) => {
  if (path === '/messages') return 3;
  return 0;
};


watch(() => route.path, () => {
  closeSubMenus();
});


onMounted(() => {
  document.addEventListener('click', (event) => {
    const sidebar = document.querySelector('aside');
    if (sidebar && !sidebar.contains(event.target as Node)) {
      closeSubMenus();
    }
  });
});


onMounted(() => {
  const currentPath = route.path;
  for (const item of [...adminMenu, ...clientMenu]) {
    if (item.children) {
      for (const child of item.children) {
        if (child.to === currentPath) {
          activeSubMenu.value = item.label;
          break;
        }
      }
    }
  }
});
</script>

<style scoped>
/* Animation de rotation pour la flèche du sous-menu */
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.2s;
}
</style>