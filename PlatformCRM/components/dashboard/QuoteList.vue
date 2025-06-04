<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full w-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">Devis</h2>
      <NuxtLink
        to="/devis"
        class="text-gray-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
      >
        Voir tout
      </NuxtLink>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 flex-grow w-full"
    >
      <div
        v-if="quotes.length === 0"
        class="col-span-full text-gray-500 text-center py-4"
      >
        Aucun devis disponible pour le moment.
      </div>
      <div
        v-for="quote in quotes"
        :key="quote.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg w-full"
      >
        <div class="flex items-center">
          <i class="ri-file-text-line text-green-600 mr-4"></i>
          <div>
            <h4 class="font-medium">{{ quote.number }}</h4>
            <p class="text-sm text-gray-500">
              {{ formatDate(quote.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SimplifiedQuote {
  id: number;
  number: string;
  status: string;
  totalPrice: number;
  createdAt: string | Date;
  newTotalPrice?: number;
}

defineProps<{
  quotes: SimplifiedQuote[];
}>();

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
  } catch (e) {
    console.error("Erreur de formatage de date:", e);
    return "Date invalide";
  }
};
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>
