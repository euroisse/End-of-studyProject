<template>
  <div class="bg-white rounded-lg shadow-md">
    <div class="p-10">
      <div class="flex items-center justify-between mb-4">
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
      <div class="mx-auto">
        <div v-if="quoteStore.loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-indigo-500 border-gray-200"
          ></div>
          <p class="mt-2 text-gray-600">Chargement des devis...</p>
        </div>

        <div
          v-else-if="quoteStore.quotesList.length === 0 && !quoteStore.loading"
          class="text-center py-8"
        >
          <p class="text-gray-500">Aucun devis disponible</p>
        </div>

        <div v-else>
          <div class="hidden sm:block overflow-x-auto overflow-y-auto">
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
                    Prix
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
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500"
                  >
                    {{ getDisplayPrice(quoteItem) }} FCFA
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
                    <div class="flex space-x-6">
                      <router-link
                        :to="`/quotes/${quoteItem.id}`"
                        class="text-green-600 hover:text-green-900 cursor-pointer relative"
                      >
                        <i
                          class="ri-eye-line"
                          :class="{
                            'text-yellow-500':
                              quoteItem.status === 'EN_ATTENTE',
                          }"
                        ></i>
                        <span
                          v-if="quoteItem.status === 'EN_ATTENTE'"
                          class="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-2 h-2"
                          title="Action requise"
                        ></span>
                      </router-link>
                      <button
                        v-if="isAdmin && quoteItem.status !== 'ACCEPTE'"
                        @click="openEditPricesModal(quoteItem)"
                        class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      >
                        <i class="ri-edit-line"></i>
                      </button>

                      <button
                        v-if="isAdmin && quoteItem.status !== 'ACCEPTE'"
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

          <div class="sm:hidden grid grid-cols-1 gap-4">
            <div
              v-for="quoteItem in filteredQuotes"
              :key="quoteItem.id"
              class="bg-white p-4 rounded-lg shadow-md"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-lg">Devis #{{ quoteItem.number }}</h3>
                <span
                  :class="[
                    'inline-block px-2 py-1 text-xs rounded-full font-medium',
                    statusClass(quoteItem.status),
                  ]"
                >
                  {{ quoteItem.status }}
                </span>
              </div>
              <div class="text-sm text-gray-700 mb-1">
                <span class="font-semibold">Projet:</span>
                {{ quoteItem.projectName || "N/A" }}
              </div>
              <div class="text-sm text-gray-700 mb-3">
                <span class="font-semibold">Prix:</span>
                {{ getDisplayPrice(quoteItem) }} FCFA
              </div>
              <div class="flex justify-end space-x-4">
                <router-link
                  :to="`/quotes/${quoteItem.id}`"
                  class="text-green-600 hover:text-green-900 cursor-pointer relative"
                >
                  <i
                    class="ri-eye-line text-lg"
                    :class="{
                      'text-yellow-500': quoteItem.status === 'EN_ATTENTE',
                    }"
                  ></i>
                  <span
                    v-if="quoteItem.status === 'EN_ATTENTE'"
                    class="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-2 h-2"
                    title="Action requise"
                  ></span>
                </router-link>
                <button
                  v-if="isAdmin && quoteItem.status !== 'ACCEPTE'"
                  @click="openEditPricesModal(quoteItem)"
                  class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                >
                  <i class="ri-edit-line text-lg"></i>
                </button>

                <button
                  v-if="isAdmin && quoteItem.status !== 'ACCEPTE'"
                  @click="openDeleteModal(quoteItem)"
                  class="text-red-600 hover:text-red-900 cursor-pointer"
                >
                  <i class="ri-delete-bin-line text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-4 space-x-2">
          <button
            @click="goToPreviousPage"
            :disabled="quoteStore.pagination.page <= 1"
            :class="[
              'px-3 py-1 rounded',
              quoteStore.pagination.page <= 1,
              'bg-gray-200 text-gray-700 disabled:opacity-50',
            ]"
          >
            <i class="ri-arrow-left-s-line"></i>
          </button>

          <button
            v-for="p in quoteStore.pagination.totalPages"
            :key="p"
            @click="goToPage(p)"
            :class="[
              'px-3 py-1 rounded',
              p === quoteStore.pagination.page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 hover:bg-gray-300',
            ]"
          >
            {{ p }}
          </button>

          <button
            @click="goToNextPage"
            :disabled="
              quoteStore.pagination.page >= quoteStore.pagination.totalPages
            "
            :class="[
              'px-3 py-1 rounded',
              quoteStore.pagination.page >= quoteStore.pagination.totalPages,
              'bg-gray-200  text-gray-700 disabled:opacity-50',
            ]"
          >
            <i class="ri-arrow-right-s-line"></i>
          </button>
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
  <EditQuotePriceModal
    v-if="showEditPricesModal && quoteToEditPrices"
    :quoteId="quoteToEditPrices.id"
    @close="
      showEditPricesModal = false;
      quoteToEditPrices = null;
    "
    @success="handleQuoteFormSuccess"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuoteStore } from "~/stores/quoteStore";
import type { quote } from "~/types";
import DeleteConfirmModal from "./DeleteConfirmModal.vue";
import EditQuotePriceModal from "./EditQuotePriceModal.vue";

const openDeleteModal = (quoteItem: quote) => {
  quoteToDelete.value = quoteItem;
  showEditModal.value = true;
};

const quoteStore = useQuoteStore();

const fetchQuotes = async () => {
  await quoteStore.fetchQuotesPaginated(
    quoteStore.pagination.page,
    quoteStore.pagination.pageSize
  );
};

const goToPage = (p: number) => {
  // Only navigate if the page number is valid
  if (p > 0 && p <= quoteStore.pagination.totalPages) {
    quoteStore.pagination.page = p;
    fetchQuotes();
  }
};

const goToPreviousPage = () => {
  if (quoteStore.pagination.page > 1) {
    quoteStore.pagination.page--;
    fetchQuotes();
  }
};

const goToNextPage = () => {
  if (quoteStore.pagination.page < quoteStore.pagination.totalPages) {
    quoteStore.pagination.page++;
    fetchQuotes();
  }
};

onMounted(fetchQuotes);
const { isAdmin } = useIsRole();

const showEditPricesModal = ref(false);
const quoteToEditPrices = ref<quote | null>(null);
const quoteToDelete = ref<quote | null>(null);
const showEditModal = ref(false);
const searchQuery = ref("");

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

const cancelDelete = () => {
  showEditModal.value = false;
  quoteToDelete.value = null;
};

const handleQuoteFormSuccess = async () => {
  await fetchQuotes();
  showEditPricesModal.value = false;
  quoteToEditPrices.value = null;
};

const openEditPricesModal = (quoteItem: quote) => {
  quoteToEditPrices.value = quoteItem;
  showEditPricesModal.value = true;
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

const getDisplayPrice = (quoteItem: quote): number => {
  if (
    quoteItem.newTotalPrice !== undefined &&
    quoteItem.newTotalPrice !== null
  ) {
    return quoteItem.newTotalPrice;
  } else if (
    quoteItem.totalPrice !== undefined &&
    quoteItem.totalPrice !== null
  ) {
    return quoteItem.totalPrice;
  }
  return 0;
};

const refreshQuotes = async () => {
  await fetchQuotes();
};

defineExpose({
  refreshQuotes,
});
defineEmits(["preview"]);
</script>
