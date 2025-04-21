<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Quote {
  id: number;
  number: string;
  project: string;
  client: string;
  amount: number;
  date: string;
  status: string;
  description: string;
}

const props = defineProps<{
  quote: Quote | null;
}>();

const emit = defineEmits(['close']);

const downloadPDF = () => {
  if (props.quote) {
    console.log('Télécharger PDF pour le devis :', props.quote.number);
    // l'implémentation pour télécharger le PDF
  }
};
</script>

<template>
  <div v-if="quote" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Aperçu du devis</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <div class="border rounded-lg p-6">
          <div class="flex justify-between mb-8">
            <div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">OpenCRM</h3>
              <p class="text-gray-600">123 Avenue des Champs-Élysées</p>
              <p class="text-gray-600">75008 Paris, France</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-gray-800 mb-2">DEVIS #{{ quote?.number }}</p>
              <p class="text-gray-600">Date: {{ quote?.date }}</p>
            </div>
          </div>

          <div class="mb-8">
            <h4 class="font-bold text-gray-800 mb-2">Client</h4>
            <p class="text-gray-600">{{ quote?.client }}</p>
            <p class="text-gray-600">Projet: {{ quote?.project }}</p>
          </div>

          <div class="mb-8">
            <h4 class="font-bold text-gray-800 mb-2">Description</h4>
            <p class="text-gray-600">{{ quote?.description }}</p>
          </div>

          <div class="text-right">
            <p class="text-xl font-bold text-gray-800">Total: {{ quote?.amount }}€</p>
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

<style scoped>

</style>