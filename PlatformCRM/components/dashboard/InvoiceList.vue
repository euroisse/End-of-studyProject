<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full w-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">Factures</h2>
      <Button
        to="/factures"
        content="Voir tout"
        customClass="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
      />
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 flex-grow overflow-y-auto"
    >
      <div
        v-if="loading"
        class="col-span-full flex justify-center items-center h-full min-h-[100px]"
      >
        Chargement des factures...
      </div>
      <div
        v-else-if="error"
        class="col-span-full text-red-600 text-center py-4"
      >
        Erreur lors du chargement des factures: {{ error.message || error }}
      </div>
      <div
        v-else-if="invoices.length === 0"
        class="col-span-full text-gray-500 text-center py-4"
      >
        Aucune facture disponible pour le moment.
      </div>
      <div
        v-for="invoice in invoices"
        :key="invoice.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg w-full"
      >
        <div class="flex items-center">
          <i class="ri-bill-line text-indigo-600 mr-4"></i>
          <div>
            <h4 class="font-medium">{{ invoice.invoiceNumber }}</h4>
            <p class="text-sm text-gray-500">
              {{ formatDate(invoice.invoiceDate) }}
            </p>
          </div>
        </div>
        <div class="text-right font-semibold">
          {{
            invoice.totalAmount ? `${invoice.totalAmount.toFixed(2)} €` : "N/A"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "../iu/Button.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ref, onMounted } from "vue";

interface SimplifiedInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string | Date;
  totalAmount: number;
}

const invoices = ref<SimplifiedInvoice[]>([]);
const loading = ref(false);
const error = ref<any>(null);

const fetchInvoices = async () => {
  loading.value = true;
  error.value = null;
  const userString = localStorage.getItem("user");
  if (!userString) {
    error.value = {
      message: "Utilisateur non connecté",
    };
    loading.value = false;
    return;
  }
  try {
    const user = JSON.parse(userString);
    const userId = user.id;
    const userRole = user.roles ? user.roles[0] : null;

    let apiUrl = "";
    if (userRole === "ADMIN") {
      apiUrl = "/api/invoices";
    } else if (userRole === "customer") {
      apiUrl = `/api/invoices/user/${userId}`;
    } else {
      error.value = {
        message: "Rôle utilisateur non reconnu. Accès refusé.",
      };
      loading.value = false;
      return;
    }

    const data = await $fetch<any>(apiUrl);
    invoices.value = data.data || [];
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchInvoices();
});

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
/* Aucune modification nécessaire ici pour cette fonctionnalité */
</style>
