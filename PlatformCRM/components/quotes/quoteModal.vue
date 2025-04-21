<template>
    <div v-if="showCreateQuote" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-2xl">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Créer un nouveau devis</h2>
            <button @click="showCreateQuote = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line"></i>
            </button>
          </div>
  
          <form @submit.prevent="createQuote" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Projet</label>
                <select v-model="newQuote.project" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option v-for="project in projects" :key="project.id" :value="project.name">{{ project.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select v-model="newQuote.client" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option v-for="client in clients" :key="client.id" :value="client.name">{{ client.name }}</option>
                </select>
              </div>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
              <input type="number" v-model="newQuote.amount" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="newQuote.description" rows="4" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
  
            <div class="flex justify-end space-x-4">
              <button type="button" @click="saveAsDraft" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all whitespace-nowrap cursor-pointer !rounded-button">
                Enregistrer comme brouillon
              </button>
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all whitespace-nowrap cursor-pointer !rounded-button">
                Créer et envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const newQuote = ref({
    project: '',
    client: '',
    amount: 0,
    description: ''
  });
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
  const showCreateQuote = ref(false);
  const createQuote = () => {
    // Implementation for creating a new quote
    showCreateQuote.value = false;
  };
  const saveAsDraft = () => {
    // Implementation for saving as draft
    showCreateQuote.value = false;
  };
  </script>
  
  <style scoped>
  
  </style>