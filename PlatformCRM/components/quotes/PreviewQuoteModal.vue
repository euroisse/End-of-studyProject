<template>
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-4xl">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Aperçu du devis</h2>
            <button @click="showPreview = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line"></i>
            </button>
          </div>
  
          <div class="border rounded-lg p-6">
            <div class="flex justify-between mb-8">
              <div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">OPENINTECH</h3>
                <p class="text-gray-600">123 Avenue des Champs-Élysées</p>
                <p class="text-gray-600">75008 Paris, France</p>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold text-gray-800 mb-2">DEVIS #{{ selectedQuote?.number }}</p>
                <p class="text-gray-600">Date: {{ selectedQuote?.date }}</p>
              </div>
            </div>
  
            <div class="mb-8">
              <h4 class="font-bold text-gray-800 mb-2">Client</h4>
              <p class="text-gray-600">{{ selectedQuote?.client }}</p>
              <p class="text-gray-600">Projet: {{ selectedQuote?.project }}</p>
            </div>
  
            <div class="mb-8">
              <h4 class="font-bold text-gray-800 mb-2">Description</h4>
              <p class="text-gray-600">{{ selectedQuote?.description }}</p>
            </div>
  
            <div class="text-right">
              <p class="text-xl font-bold text-gray-800">Total: {{ selectedQuote?.amount }}€</p>
            </div>
          </div>
  
          <div class="flex justify-end mt-6 space-x-4">
            <button @click="downloadPDF" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all whitespace-nowrap cursor-pointer !rounded-button">
              <i class="ri-download-line mr-2"></i>
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const showPreview = ref(false);
  const selectedQuote = ref(null);
  const quotes = ref([
    {
      id: 1,
      number: "DEV-2025-001",
      project: "Projet E-commerce",
      client: "Entreprise A",
      amount: 5000,
      date: "15/04/2025",
      status: "draft",
      description: "Développement d'une plateforme e-commerce complète",
    },
    {
      id: 2,
      number: "DEV-2025-002",
      project: "Projet Marketing Digital",
      client: "Entreprise B",
      amount: 3500,
      date: "14/04/2025",
      status: "sent",
      description: "Campagne marketing digital sur 3 mois",
    },
    {
      id: 3,
      number: "DEV-2025-003",
      project: "Projet Refonte Site Web",
      client: "Entreprise C",
      amount: 7500,
      date: "13/04/2025",
      status: "accepted",
      description: "Refonte complète du site web corporate",
    },
  ]);
  const clients = ref([
    { id: 1, name: 'Entreprise A' },
    { id: 2, name: 'Entreprise B' },
    { id: 3, name: 'Entreprise C' }
  ]);
  const projects = ref([
    { id: 1, name: 'Projet E-commerce' },
    { id: 2, name: 'Projet Marketing Digital' },
    { id: 3, name: 'Projet Refonte Site Web' }
  ]);
  const downloadPDF = () => {
    // Implementation for downloading PDF
  };
  </script>
  
  <style scoped>
  
  </style>