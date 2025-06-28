<template>
  <div class="min-h-screen bg-gray-50">
    <InvoicesHeaderComponent
      @create-invoice="openCreateInvoiceModal"
      v-if="isAdmin"
    />
    <header class="bg-white shadow-sm">
      <div
        class="max-w-7xl mx-auto px-4 py-6 flex flex-wrap justify-between items-center"
      >
        <h1 class="text-2xl font-bold text-gray-800">Mes Factures</h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 py-6">
      <InvoicesFilterSearch
        searchPlaceholder="Rechercher une facture..."
        @search="handleSearch"
      />

      <div v-if="loading" class="text-center text-gray-600 py-8">
        Chargement des factures...
      </div>
      <div v-if="error" class="text-center text-red-500 py-8">
        Erreur: {{ error }}
      </div>
      <div
        v-if="!loading && !error && filteredAndSortedInvoices.length === 0"
        class="text-center text-gray-600 py-8"
      >
        Aucune facture trouvée.
      </div>

      <div
        v-if="filteredAndSortedInvoices.length > 0"
        class="bg-white shadow rounded-lg overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div
                    class="flex items-center"
                    @click="sortBy('invoiceNumber')"
                  >
                    Numéro de Facture
                    <i class="ri-sort-line ml-1"></i>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div class="flex items-center" @click="sortBy('invoiceDate')">
                    Date de Création
                    <i class="ri-sort-line ml-1"></i>
                  </div>
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
                v-for="facture in filteredAndSortedInvoices"
                :key="facture.id"
                class="hover:bg-gray-50 cursor-pointer"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600"
                >
                  {{ facture.invoiceNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(facture.invoiceDate) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      class="text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Télécharger"
                      @click="downloadInvoice(facture.invoiceNumber)"
                    >
                      <i class="ri-download-fill"></i>
                    </button>
                  </div>
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
          @click="goToPreviousPage"
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
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700',
          ]"
        >
          {{ p }}
        </button>

        <!-- Flèche droite -->
        <button
          :disabled="pagination.page === pagination.totalPages"
          @click="goToNextPage"
          class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          title="Page suivante"
        >
          <i class="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
const { isAdmin } = useIsRole();
definePageMeta({ layout: "admin" });
const error = ref<any>(null);
interface SimplifiedInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string | Date;
  totalAmount: number;
}
const invoices = ref<SimplifiedInvoice[]>([]);
const loading = ref(false);
const pagination = ref({
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
});
const showCreateInvoiceModal = ref(false);
const selectedQuoteIdForInvoice = ref<number | null>(null);

const searchTerm = ref("");
const sortField = ref("invoiceDate");
const sortDirection = ref("desc");

const fetchInvoices = async (page = 1, pageSize = 10) => {
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
    // Utilise l'API de pagination
    const res = await $fetch<any>("/api/invoices/pagination", {
      params: { page, pageSize, id: userId },
    });
    invoices.value = res.data || [];
    pagination.value = res.pagination;
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchInvoices();
  downloadInvoice;
});

const filteredAndSortedInvoices = computed(() => {
  let filtered = invoices.value.filter((invoice) => {
    const matchesSearch =
      searchTerm.value === "" ||
      invoice.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
    return matchesSearch;
  });

  return filtered.sort((a, b) => {
    let comparison = 0;
    const aValue = (a as any)[sortField.value];
    const bValue = (b as any)[sortField.value];

    if (sortField.value === "invoiceDate") {
      const dateA = new Date(aValue).getTime();
      const dateB = new Date(bValue).getTime();
      comparison = dateA - dateB;
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });
});

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "desc";
  }
};

const handleSearch = (query: string) => {
  searchTerm.value = query;
};

const openCreateInvoiceModal = (quoteId: number | null) => {
  selectedQuoteIdForInvoice.value = quoteId;
  showCreateInvoiceModal.value = true;
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
const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
  } catch (e) {
    console.error("Erreur de formatage de date:", e);
    return "Date invalide";
  }
};
const goToPage = (p: number) => {
  pagination.value.page = p;
  fetchInvoices(p, pagination.value.pageSize);
};
const goToPreviousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchInvoices(pagination.value.page, pagination.value.pageSize);
  }
};

const goToNextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++;
    fetchInvoices(pagination.value.page, pagination.value.pageSize);
  }
};
</script>

<style lang="css" scoped></style>
