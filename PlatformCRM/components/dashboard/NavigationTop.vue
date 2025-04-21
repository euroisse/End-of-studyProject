<template>
    <div>
 <!-- Top Navigation -->
 <header class="bg-white shadow-sm fixed top-0 left-64 right-0 z-10">
    <div class="flex items-center justify-between gap-7 px-8 py-4">
      <div class="flex items-center space-x-4">
        <div class="relative w-64">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            class="pl-10 w-full pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
          <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>         
        </div>
      </div>
      
      <div class="flex items-center space-x-4 gap-3">
        <button class="relative cursor-pointer">
          <i class="ri-notification-3-fill text-gray-600 text-xl"></i>
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
        </button>
        
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <i class="ri-user-line text-indigo-600"></i>
          </div>
          <span class="font-medium">Jean Dupont</span>
        </div>
      </div>
    </div>
  </header>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>