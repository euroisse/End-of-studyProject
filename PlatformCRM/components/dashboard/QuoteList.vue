<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full w-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-gray-800">Devis</h2>
      <NuxtLink
        v-if="isClient"
        to="/devis"
        class="text-gray-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
      >
        Voir tout
      </NuxtLink>
    </div>

    <div>
      <div
        v-if="quotes.length === 0"
        class="col-span-full text-gray-500 text-center py-4"
      >
        Aucun devis disponible pour le moment.
      </div>
      <div v-else class="w-full">
        <div
          v-for="quote in quotes"
          :key="quote.id"
          class="flex items-center justify-between p-4 mb-2 bg-[#F9FAFB] rounded-lg"
        >
          <div class="flex items-center">
            <i
              class="ri-file-text-line text-[#22C55E] mr-4 w-12 h-12 justify-center text-center rounded-full pt-3 bg-[#DCFCE7]"
            ></i>
            <div>
              <h4 class="font-medium">{{ quote.number }}</h4>
              <p class="text-sm text-gray-500">
                Date : {{ formatDate(quote.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { fr } from "date-fns/locale";
const { isClient } = useIsRole();
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
