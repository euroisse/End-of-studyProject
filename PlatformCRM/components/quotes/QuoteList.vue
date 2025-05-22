<template>
  <div class="bg-white rounded-lg shadow-md">
    <div class="p-6">
      <div class="flex items-center justify-between container mb-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher un devis..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
          <i
            class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>
      <div class="container mx-auto">
        <div v-if="quoteStore.loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-indigo-500 border-gray-200"
          ></div>
          <p class="mt-2 text-gray-600">Chargement des devis...</p>
        </div>

        <div
          v-else-if="quoteStore.quotesList.length === 0"
          class="text-center py-8"
        >
          <p class="text-gray-500">Aucun devis disponible</p>
        </div>

        <div v-else class="overflow-x-auto overflow-y-auto">
          <table class="w-full min-w-[700px]">
            <thead>
              <tr class="bg-gray-50">
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Numéro
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Projet
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="quoteItem in filteredQuotes"
                :key="quoteItem.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ quoteItem.number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ quoteItem.projectName || "N/A" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    :class="[
                      'inline-block px-2 py-1 text-xs rounded-full font-medium',
                      statusClass(quoteItem.status),
                    ]"
                  >
                    {{ quoteItem.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button
                      @click="previewQuote(quoteItem)"
                      class="text-green-600 hover:text-green-900 cursor-pointer"
                    >
                      <i class="ri-eye-line"></i>
                    </button>
                    <button
                      @click="editQuote(quoteItem)"
                      class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    >
                      <i class="ri-edit-line"></i>
                    </button>

                    <button
                      @click="openDeleteModal(quoteItem)"
                      class="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <DeleteConfirmModal
    v-if="showEditModal"
    :quoteItem="quoteToDelete"
    @close="cancelDelete"
    @success="handleQuoteFormSuccess"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuoteStore } from "~/stores/quoteStore";
import type { quote } from "~/types";
import DeleteConfirmModal from "./DeleteConfirmModal.vue";
const openDeleteModal = (quoteItem: quote) => {
  quoteToDelete.value = quoteItem;
  showEditModal.value = true;
};

const quoteToDelete = ref<quote | null>(null);
const showEditModal = ref(false);
const searchQuery = ref("");
const quoteStore = useQuoteStore();

const filteredQuotes = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  return quoteStore.quotesList.filter((quote: any) => {
    return (
      (quote.number && quote.number.toLowerCase().includes(searchLower)) ||
      (quote.projectName &&
        quote.projectName.toLowerCase().includes(searchLower))
    );
  });
});

const emit = defineEmits(["preview"]);

const cancelDelete = () => {
  showEditModal.value = false;
  quoteToDelete.value = null;
};

const handleQuoteFormSuccess = () => {
  quoteStore.fetchQuotesList();
};
const previewQuote = (quoteItem: quote) => {
  emit("preview", quoteItem);
};

const editQuote = (quoteItem: quote) => {
  console.log("Éditer le devis :", quoteItem);
};

const statusClass = (status: string) => {
  switch (status) {
    case "ACCEPTE":
      return "bg-green-100 text-green-700";
    case "REFUSE":
      return "bg-red-100 text-red-700";
    case "EN_ATTENTE":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const refreshQuotes = async () => {
  await quoteStore.fetchQuotesList();
};
defineExpose({
  refreshQuotes,
});

onMounted(() => {
  quoteStore.fetchQuotesList();
});
</script>
