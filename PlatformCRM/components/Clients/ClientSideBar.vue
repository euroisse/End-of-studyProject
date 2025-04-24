<!-- components/ClientSidebar.vue -->
<template>
    <aside class="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-gray-900">Gestion des clients</h1>
      </div>
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200">
        <div class="space-y-4">
          <div class="relative">
            <input
              type="text"
              :value="searchQuery"
              placeholder="Rechercher une tâche..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="status in clientStatuses"
                :key="status.value"
                @click="toggleClientStatus(status.value)"
                :class="[
                  'px-3 py-1 text-sm cursor-pointer whitespace-nowrap rounded-md',
                  selectedClientStatuses.includes(status.value) ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Projets</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="range in projectRanges"
                :key="range.value"
                @click="toggleProjectRange(range.value)"
                :class="[
                  'px-3 py-1 text-sm cursor-pointer whitespace-nowrap rounded-md',
                  selectedProjectRanges.includes(range.value) ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ range.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </template>
  
  <script lang="ts" setup>
  defineProps<{
    searchQuery: string
    selectedClientStatuses: string[]
    selectedProjectRanges: string[]
    clientStatuses: Array<{ value: string, label: string }>
    projectRanges: Array<{ value: string, label: string }>
  }>();
  
  const emit = defineEmits(
    [ 'update:searchQuery', 
     'toggleClientStatus', 
     'toggleProjectRange'
  ]);
  
  const toggleClientStatus = (status: string) => {
    emit('toggleClientStatus', status);
  };
  
  const toggleProjectRange = (range: string) => {
    emit('toggleProjectRange', range);
  };
  </script>