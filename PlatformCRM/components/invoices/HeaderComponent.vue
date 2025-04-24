<template>
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6 flex flex-wrap justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
        <button 
          class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm flex items-center whitespace-nowrap cursor-pointer"
          @click="$emit('generateInvoice')"
        >
          <i class="ri-add-circle-line mr-2"></i>
          {{ buttonText }}
        </button>
      </div>
    </header>
  </template>
  
  <script lang="ts" setup>
  
  defineProps({
    title: {
      type: String,
      default: 'Gestion des factures'
    },
    buttonText: {
      type: String,
      default: 'Générer la facture à partir d\'un devis validé'
    }
  });
  
 
  defineEmits(['generateInvoice']);
  </script>