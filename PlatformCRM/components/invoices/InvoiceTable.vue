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
    <div
      v-if="pagination.totalPages > 1"
      class="flex justify-center mt-6 space-x-2 items-center"
    >
      <!-- Flèche gauche -->
      <button
        :disabled="pagination.page === 1"
        @click="goToPage(pagination.page - 1)"
        class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        title="Page précédente"
      >
        <i class="ri-arrow-left-s-line"></i>
      </button>

      <button
        v-for="p in pagination.totalPages"
        :key="p"
        @click="goToPage(p)"
        :class="[
          'px-3 py-1 rounded',
          p === pagination.page
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700',
        ]"
      >
        {{ p }}
      </button>

      <!-- Flèche droite -->
      <button
        :disabled="pagination.page === pagination.totalPages"
        @click="goToPage(pagination.page + 1)"
        class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        title="Page suivante"
      >
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

interface SimplifiedInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string | Date;
}

const props = defineProps<{ quoteId: number }>();

const invoices = ref<SimplifiedInvoice[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const pdf = ref(null);
const pagination = ref({
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
});
const fetchInvoicesPaginated = async (page = 1, pageSize = 10) => {
  loading.value = true;
  error.value = null;
  try {
    const userString = localStorage.getItem("user");
    if (!userString) {
      error.value = "Utilisateur non connecté";
      loading.value = false;
      return;
    }
    const user = JSON.parse(userString);
    const userId = user.id;

    const res = await $fetch<any>("/api/invoices/pagination", {
      params: { page, pageSize, id: userId },
    });

    invoices.value = res.data || [];
    pagination.value = res.pagination || {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
  } catch (err: any) {
    error.value =
      err.data?.statusMessage ||
      err.message ||
      "Impossible de charger les factures.";
  } finally {
    loading.value = false;
  }
};
const goToPage = (p: number) => {
  pagination.value.page = p;
  fetchInvoicesPaginated(p, pagination.value.pageSize);
};
onMounted(() => {
  fetchInvoicesPaginated();
});

watch(
  () => props.quoteId,
  async (newId) => {
    if (newId) await fetchInvoicesPaginated();
  },
  { immediate: true }
);

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date Invalide";
  return date.toLocaleDateString("fr-FR");
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

// Expose la fonction de rafraîchissement pour usage externe
const refreshInvoices = () => {
  fetchInvoicesPaginated(pagination.value.page, pagination.value.pageSize);
};

// Exposer la fonction via defineExpose pour permettre l'accès depuis le parent
defineExpose({
  refreshInvoices
});
</script>

<style scoped></style>
