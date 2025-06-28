<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
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
      <div v-else class="w-full grid grid-cols-1 gap-4">
        <div
          v-for="quote in quotes"
          :key="quote.id"
          class="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-transparent hover:border-[#22C55E] cursor-pointer"
        >
          <div
            class="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-gray-100"
          >
            <i class="ri-file-text-line text-gray-600 text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-gray-800 truncate">
                {{ quote.number }}
              </h4>
              <span
                :class="[
                  'text-xs font-bold px-2 py-1 rounded-full',
                  quote.status === 'ACCEPTE'
                    ? 'bg-green-100 text-green-700'
                    : quote.status === 'EN_ATTENTE'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-200 text-gray-600',
                ]"
              >
                {{ quote.status }}
              </span>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              Date : {{ formatDate(quote.createdAt) }}
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
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr !important;
  }
}
</style>
