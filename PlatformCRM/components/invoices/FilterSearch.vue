<template>
    <div class="mb-6 flex flex-wrap justify-between items-center gap-4">
      <!-- Barre de recherche -->
      <div class="relative flex-grow max-w-md">
        <input 
          type="text" 
          :placeholder="searchPlaceholder" 
          v-model="searchQuery"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          @input="emitSearch"
        />
        <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
      
      <!-- Filtres -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <button 
            class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            @click="toggleStatusFilter"
          >
            <span>Filtrer par statut</span>
            <i class="ri-arrow-down-s-line text-xs"></i>
          </button>
      
          <div v-if="showStatusFilter" class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            <div 
              v-for="(status, index) in statusOptions" 
              :key="index"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="selectStatus(status)"
            >
              {{ status }}
            </div>
          </div>
        </div>
        
        <div class="relative">
          <button 
            class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            @click="toggleSortOptions"
          >
            <span>Trier par</span>
            <i class="ri-arrow-down-s-line text-xs"></i>
          </button>
          
          <div v-if="showSortOptions" class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            <div 
              v-for="(option, index) in sortOptions" 
              :key="index"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="selectSortOption(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  
  defineProps({
    searchPlaceholder: {
      type: String,
      default: 'Rechercher une facture...'
    }
  });
  
  // État local
  const searchQuery = ref('');
  const showStatusFilter = ref(false);
  const showSortOptions = ref(false);
  
 
  const statusOptions = ['Toutes', 'Payée', 'En attente', 'En retard'];
  const sortOptions = [
    { label: 'Date (récent → ancien)', value: 'date-desc' },
    { label: 'Date (ancien → récent)', value: 'date-asc' },
    { label: 'Montant (décroissant)', value: 'amount-desc' },
    { label: 'Montant (croissant)', value: 'amount-asc' }
  ];
  
 
  const emit = defineEmits(['search', 'filterStatus', 'sort']);
  
  
  const emitSearch = () => {
    emit('search', searchQuery.value);
  };
  
  const toggleStatusFilter = () => {
    showStatusFilter.value = !showStatusFilter.value;
    showSortOptions.value = false; 
  };
  
  const toggleSortOptions = () => {
    showSortOptions.value = !showSortOptions.value;
    showStatusFilter.value = false; 
  };
  
  const selectStatus = (status: string) => {
    emit('filterStatus', status);
    showStatusFilter.value = false;
  };
  
  const selectSortOption = (option: { label: string, value: string }) => {
    emit('sort', option.value);
    showSortOptions.value = false;
  };
  </script>