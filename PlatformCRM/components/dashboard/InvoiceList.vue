<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full w-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-gray-800">Factures</h2>
      <NuxtLink
        v-if="isClient"
        to="/factures"
        class="text-gray-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
      >
        Voir tout
      </NuxtLink>
    </div>

    <div>
      <div
        v-if="invoices.length === 0"
        class="col-span-full text-gray-500 text-center py-4"
      >
        Aucune facture disponible pour le moment.
      </div>
      <div v-else class="w-full grid grid-cols-1 sm:grid-cols-1 gap-4">
        <div
          v-for="invoice in invoices"
          :key="invoice.id"
          class="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-transparent hover:border-indigo-400 cursor-pointer"
        >
          <div
            class="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-gray-100"
          >
            <i class="ri-bill-line text-gray-600 text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-gray-800 truncate">
                {{ invoice.invoiceNumber }}
              </h4>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              Date : {{ formatDate(invoice.invoiceDate) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "../iu/Button.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
const { isClient } = useIsRole();
interface SimplifiedInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string | Date;
  totalAmount: number;
}

const props = defineProps<{
  invoices: SimplifiedInvoice[];
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

<style scoped></style>
