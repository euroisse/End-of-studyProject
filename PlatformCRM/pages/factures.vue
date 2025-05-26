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
        v-if="!loading && !error && displayedInvoices.length === 0"
        class="text-center text-gray-600 py-8"
      >
        Aucune facture trouvée.
      </div>

      <div
        v-if="displayedInvoices.length > 0"
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
                v-for="facture in displayedInvoices"
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

      <div
        v-if="filteredInvoices.length > itemsPerPage"
        class="mt-6 flex justify-center"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          Précédent
        </button>
        <span class="bg-white px-4 py-2 border-t border-b border-gray-200"
          >{{ currentPage }} / {{ totalPages }}</span
        >
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          Suivant
        </button>
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

// --- Pagination ---
const currentPage = ref(1);
const itemsPerPage = ref(10);

const fetchInvoices = async () => {
  loading.value = true;
  error.value = null;
  const userString = localStorage.getItem("user");
  if (!userString) {
    error.value = {
      message: "Utilisateur non connecté",
    };
    return;
  }
  try {
    const user = JSON.parse(userString);
    const userId = user.id;
    const userRole = user.role;
    const data = await $fetch<Invoice[]>(
      userRole === "ADMIN" ? "/api/invoices" : `/api/invoices/user/${userId}`
    );
    invoices.value = data;
    loading.value = false;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchInvoices();
});

const filteredInvoices = computed(() => {
  let filtered = invoices.value.filter((invoice) => {
    // Pour ce tableau simplifié, on ne recherche que dans le numéro de facture
    const matchesSearch =
      searchTerm.value === "" ||
      invoice.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
    return matchesSearch;
  });

  // Trie les factures
  return filtered.sort((a, b) => {
    let comparison = 0;
    const aValue = (a as any)[sortField.value];
    const bValue = (b as any)[sortField.value];

    if (sortField.value === "invoiceDate") {
      const dateA = new Date(aValue).getTime();
      const dateB = new Date(bValue).getTime();
      comparison = dateA - dateB;
    }
    // Logique de tri pour les chaînes de caractères (numéro de facture)
    else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    }
    // Cas générique pour d'autres types si nécessaire (pas le cas ici)
    else {
      comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }

    // Applique la direction de tri
    return sortDirection.value === "asc" ? comparison : -comparison;
  });
});

// Calcule les factures à afficher sur la page actuelle (pour la pagination)
const displayedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredInvoices.value.slice(start, end);
});

// Calcule le nombre total de pages pour la pagination
const totalPages = computed(() =>
  Math.ceil(filteredInvoices.value.length / itemsPerPage.value)
);

// --- Méthodes ---
// Gère le tri du tableau
const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "desc";
  }
};

// Gère la recherche
const handleSearch = (query: string) => {
  searchTerm.value = query;
  currentPage.value = 1;
};

// Ouvre la modale de création de facture
const openCreateInvoiceModal = (quoteId: number | null) => {
  selectedQuoteIdForInvoice.value = quoteId;
  showCreateInvoiceModal.value = true;
};

const handleInvoiceCreated = (newInvoice: Invoice) => {
  fetchInvoices();
  showCreateInvoiceModal.value = false;
};

// Gère le téléchargement d'une facture (logique à implémenter)
const downloadInvoice = (facture: Invoice) => {
  alert(`Téléchargement de la facture ${facture.invoiceNumber}`);
};

// Formate une date au format DD/MM/YYYY
const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date Invalide";
  return date.toLocaleDateString("fr-FR");
};

// Méthodes de pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<style lang="css" scoped></style>
