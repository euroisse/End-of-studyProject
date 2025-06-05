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
      <div v-else class="w-full">
        <div
          v-for="invoice in invoices"
          :key="invoice.id"
          class="flex items-center justify-between p-4 mb-2 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center">
            <i
              class="ri-bill-line text-indigo-600 mr-4 w-12 h-12 justify-center text-center rounded-full pt-3 bg-indigo-50"
            ></i>
            <div>
              <h4 class="font-medium">{{ invoice.invoiceNumber }}</h4>
              <p class="text-sm text-gray-500">
                Date : {{ formatDate(invoice.invoiceDate) }}
              </p>
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
