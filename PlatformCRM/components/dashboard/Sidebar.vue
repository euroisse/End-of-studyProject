<template>
  <aside class="w-64 bg-white shadow-lg fixed h-screen">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-indigo-600">OpenCRM</h1>
    </div>
    <nav class="mt-6 space-y-1">
      <template v-for="item in currentMenuItems" :key="item.label">
        <template v-if="item.children">
          <div
            class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer"
            @click="toggleSubMenu(item.label)"
            :class="{
              'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-semibold':
                isSubMenuOpen(item.label) || isChildActive(item),
            }"
          >
            <i :class="`${item.icon} w-5`"></i>
            <span class="mx-4">{{ item.label }}</span>
            <i
              class="ri-arrow-right-s-line ml-auto"
              :class="{ 'rotate-90': isSubMenuOpen(item.label) }"
            ></i>
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
              :class="{ 'font-semibold text-indigo-600': isActive(child.to) }"
              @click="closeSubMenus"
            >
              {{ child.label }}
            </NuxtLink>
          </div>
        </template>
        <template v-else-if="item.label === 'Déconnexion'">
          <button
            @click="showLogoutConfirmation = true"
            class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 w-full text-left"
          >
            <i :class="`${item.icon} w-5`"></i>
            <span class="mx-4">{{ item.label }}</span>
          </button>
        </template>
        <template v-else-if="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
            :class="{
              'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-semibold':
                isActive(item.to),
            }"
          >
            <i :class="`${item.icon} w-5`"></i>
            <span class="mx-4">{{ item.label }}</span>
            <span
              v-if="item.badge && getNotificationCount(item.to) > 0"
              class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ getNotificationCount(item.to) }}
            </span>
          </NuxtLink>
        </template>
        <template v-else>
          <div
            class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
          >
            <i :class="`${item.icon} w-5`"></i>
            <span class="mx-4">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ getNotificationCount("") }}
            </span>
          </div>
        </template>
      </template>
    </nav>

    <div
      v-if="showLogoutConfirmation"
      class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-30"
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
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const showLogoutConfirmation = ref(false);

const activeSubMenu = ref<string | null>(null);

const { isEmploye, isClient, isAdmin } = useIsRole();

interface ChildMenuItem {
  label: string;
  to: string;
}

interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  children?: ChildMenuItem[];
  badge?: boolean;
}

const employeMenu: MenuItem[] = [
  {
    label: "Tableau de bord",
    to: "/dashboard",
    icon: "ri-dashboard-line",
  },
  { label: "Clients", to: "/clients", icon: "ri-user-3-line" },
  { label: "Projets", to: "/projects", icon: "ri-projector-2-line" },
  {
    label: "Factures & Devis",
    icon: "ri-file-line",
    children: [
      { label: "Factures", to: "/factures" },
      { label: "Devis", to: "/devis" },
    ],
  },
  {
    label: "Messages",
    to: "/messages",
    icon: "ri-chat-3-line",
    badge: true,
  },
  { label: "Paramètres", to: "/parametres", icon: "ri-settings-3-line" },
  { label: "Déconnexion", icon: "ri-logout-box-line" },
];

const clientMenu: MenuItem[] = [
  {
    label: "Tableau de bord",
    to: "/dashboard",
    icon: "ri-dashboard-line",
  },
  { label: "Projets", to: "/projects", icon: "ri-projector-2-line" },
  {
    label: "Factures & Devis",
    icon: "ri-file-line",
    children: [
      { label: "Factures", to: "/factures" },
      { label: "Devis", to: "/devis" },
    ],
  },
  {
    label: "Messages",
    to: "/messages",
    icon: "ri-chat-3-line",
    badge: true,
  },
  { label: "Profil", to: "/profil", icon: "ri-user-line" },
  { label: "Déconnexion", icon: "ri-logout-box-line" },
];

const adminMenu: MenuItem[] = [
  { label: "Projets", to: "/projects", icon: "ri-projector-2-line" },
  {
    label: "Factures & Devis",
    icon: "ri-file-line",
    children: [
      { label: "Factures", to: "/factures" },
      { label: "Devis", to: "/devis" },
    ],
  },
  { label: "Clients", to: "/clients", icon: "ri-user-3-line" },
  { label: "Déconnexion", icon: "ri-logout-box-line" },
];

const currentMenuItems = computed<MenuItem[]>(() => {
  console.log(isEmploye.value, isClient.value, isAdmin.value);
  if (isEmploye.value) {
    return employeMenu;
  } else if (isClient.value) {
    return clientMenu;
  } else if (isAdmin.value) {
    return adminMenu;
  } else {
    return [];
  }
});

const closeSubMenus = () => {
  activeSubMenu.value = null;
};

const toggleSubMenu = (label: string) => {
  activeSubMenu.value = activeSubMenu.value === label ? null : label;
};

const isSubMenuOpen = (label: string) => activeSubMenu.value === label;
const isActive = (path: string) => route.path === path;
const isChildActive = (item: MenuItem) =>
  item.children?.some((child: ChildMenuItem) => isActive(child.to));
const getNotificationCount = (path: string) => (path === "/messages" ? 3 : 0);
const logoutUser = () => {
  localStorage.removeItem("user");
  console.log("Déconnexion de l'utilisateur...");
  router.push("/");
};

watch(() => route.path, closeSubMenus);

onMounted(() => {
  document.addEventListener("click", (event) => {
    if (
      document.querySelector("aside")?.contains(event.target as Node) === false
    ) {
      closeSubMenus();
    }
  });

  const currentPath = route.path;
  for (const item of [...employeMenu, ...clientMenu]) {
    if (item.children?.some((child) => child.to === currentPath)) {
      activeSubMenu.value = item.label;
      break;
    }
  }
});
</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.2s;
}
</style>
