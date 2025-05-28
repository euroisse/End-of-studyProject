<template>
  <div class="mt-8">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Liste des Factures</h2>
    <div v-if="loading" class="text-center text-gray-600 py-4">
      Chargement des factures...
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-4">
      Erreur: {{ error }}
    </div>
    <div
      v-else-if="invoices.length === 0"
      class="text-center text-gray-600 py-4"
    >
      Aucune facture trouvée dans la base de données.
    </div>
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Numéro de Facture
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date de Création
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600"
              >
                {{ invoice.invoiceNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(invoice.invoiceDate) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="downloadInvoice(invoice.invoiceNumber)"
                  class="text-blue-500 hover:text-blue-700"
                  title="Télécharger"
                >
                  <i class="ri-download-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { fr, id } from "date-fns/locale";

interface SimplifiedInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string | Date;
}

const invoices = ref<SimplifiedInvoice[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const pdf = ref(null);
const fetchAllInvoices = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response: SimplifiedInvoice[] = await $fetch<SimplifiedInvoice[]>(
      `/api/invoices`
    );

    invoices.value = response || [];
  } catch (err: any) {
    console.error("Erreur lors du chargement des factures:", err);
    error.value =
      err.data?.statusMessage ||
      err.message ||
      "Impossible de charger les factures.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllInvoices();
});

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd MMMM", { locale: fr });
  } catch (e) {
    console.error("Erreur de formatage de date:", e);
    return "Date invalide";
  }
};

const downloadInvoice = async (invoiceNumber: string) => {
  const response = await $fetch<Blob>(`/api/file?id=${invoiceNumber}`);
  console.log(response);
  const blob = new Blob([response], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoices.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
</script>

<style scoped></style>
