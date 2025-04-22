<template>
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6 md:mb-8">
      <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="flex-1 relative">
          <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Rechercher un projet..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            :value="searchQuery"
            @input="emitSearchQuery(($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="flex items-center space-x-2 sm:space-x-4">
          <button
            class="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 flex items-center space-x-2 whitespace-nowrap cursor-pointer !rounded-button text-sm"
            @click="toggleStatusFilter"
          >
            <i class="ri-filter-3-line"></i>
            <span>Statut</span>
          </button>
          <button
            class="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 flex items-center space-x-2 whitespace-nowrap cursor-pointer !rounded-button text-sm"
            @click="toggleDateFilter"
          >
            <i class="ri-calendar-line"></i>
            <span>Date</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineEmits, defineProps } from 'vue';
  
  defineProps<{
    searchQuery: string;
  }>();
  
  const emit = defineEmits(['update:searchQuery', 'toggleStatusFilter', 'toggleDateFilter']);
  
  const emitSearchQuery = (value: string) => {
    emit('update:searchQuery', value);
  };
  
  const toggleStatusFilter = () => {
    emit('toggleStatusFilter');
  };
  
  const toggleDateFilter = () => {
    emit('toggleDateFilter');
  };
  </script>