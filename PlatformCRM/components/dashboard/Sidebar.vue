<template>
   
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg fixed h-screen">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-indigo-600">OpenCRM</h1>
        </div>
  
        <nav class="mt-6 space-y-1">
          <template v-for="item in menuItems" :key="item.label">
            <NuxtLink
              v-if="!item.children"
              :to="item.to"
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
              :class="isActive(item.to) ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''"
            >
              <i :class="`${item.icon} w-5`"></i>
              <span class="mx-4">{{ item.label }}</span>
              <span v-if="item.badge" class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {{ item.badge }}
              </span>
            </NuxtLink>
  
            <!-- Sous-menu Factures & Devis -->
            <div v-else class="px-6 py-2">
              <div class="flex items-center text-gray-600 mb-2">
                <i :class="`${item.icon} w-5`"></i>
                <span class="mx-4">{{ item.label }}</span>
              </div>
              <div class="ml-8 space-y-1">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.label"
                  :to="child.to"
                  class="text-sm text-gray-600 hover:text-indigo-600"
                  :class="isActive(child.to) ? 'font-semibold text-indigo-600' : ''"
                >
                  - {{ child.label }}
                </NuxtLink>
              </div>
            </div>
          </template>
        </nav>
      </aside>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  
  // Simule le rôle (à remplacer avec vraie logique d'auth plus tard)
  const userRole = 'admin' // ou 'client'
  
  // Données de menu selon rôle
  const adminMenu = [
    { label: 'Tableau de bord', to: '/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Clients', to: '/clients', icon: 'fas fa-users' },
    {
      label: 'Factures & Devis',
      icon: 'fas fa-file-invoice-dollar',
      children: [
        { label: 'Factures', to: '/factures' },
        { label: 'Devis', to: '/devis' }
      ]
    },
    { label: 'Tâches', to: '/taches', icon: 'fas fa-tasks' },
    { label: 'Messages', to: '/messages', icon: 'fas fa-comments', badge: 3 },
    { label: 'Paramètres', to: '/parametres', icon: 'fas fa-cogs' }
  ]
  
  const clientMenu = [
    { label: 'Tableau de bord', to: '/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Projets', to: '/projects', icon: 'fas fa-project-diagram' },
    {
      label: 'Factures & Devis',
      icon: 'fas fa-file-invoice-dollar',
      children: [
        { label: 'Factures', to: '/factures' },
        { label: 'Devis', to: '/devis' }
      ]
    },
    { label: 'Messages', to: '/messages', icon: 'fas fa-comments', badge: 3 },
    { label: 'Profil', to: '/profil', icon: 'fas fa-user' }
  ]
  
  // Affiche les bons liens selon le rôle
  const menuItems = userRole === 'admin' ? adminMenu : clientMenu
  
  const isActive = (path: string) => {
    return route.path.startsWith(path)
  }
  </script>
  
  <style scoped>
  </style>
  