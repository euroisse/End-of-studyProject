<template>
  <div class="min-h-screen bg-gray-50">
    <InvoicesHeaderComponent @create-invoice="openCreateInvoiceModal" />

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
                      @click="downloadInvoice(facture)"
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
    </main>

    <CreateInvoiceModal
      v-if="showCreateInvoiceModal"
      :quoteId="selectedQuoteIdForInvoice"
      @close="showCreateInvoiceModal = false"
      @success="handleInvoiceCreated"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import CreateInvoiceModal from "~/components/invoices/CreateInvoiceModal.vue";
import type { Invoice } from "~/generated/prisma";

definePageMeta({ layout: "admin" });
const error = ref<any>(null);
const invoices = ref<Invoice[]>([]);
const loading = ref(false);

const showCreateInvoiceModal = ref(false);
const selectedQuoteIdForInvoice = ref<number | null>(null);

const searchTerm = ref("");
const sortField = ref("invoiceDate");
const sortDirection = ref("desc");

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

    const userRole = user.role;

    const data = await $fetch<any>(
      userRole === "ADMIN" ? "/api/invoices" : `/api/invoices/user/${userId}`
    );
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

const handleInvoiceCreated = (newInvoice: Invoice) => {
  fetchInvoices();
  showCreateInvoiceModal.value = false;
};

const downloadInvoice = (facture: Invoice) => {
  alert(`Téléchargement de la facture ${facture.invoiceNumber}`);
};

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date Invalide";
  return date.toLocaleDateString("fr-FR");
};
</script>

<style lang="css" scoped></style>
