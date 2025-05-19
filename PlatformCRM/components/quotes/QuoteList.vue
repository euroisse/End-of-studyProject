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
        <div class="overflow-x-auto overflow-y-auto">
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="quote in filteredQuotes"
                :key="quote.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ quote.number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ quote.project }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button
                      @click="previewQuote(quote)"
                      class="text-green-600 hover:text-green-900 cursor-pointer"
                    >
                      <i class="ri-eye-line"></i>
                    </button>
                    <button
                      @click="editQuote(quote)"
                      class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    >
                      <i class="ri-edit-line"></i>
                    </button>

                    <button
                      @click="deleteQuote(quote)"
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const searchQuery = ref("");
const filterStatus = ref("all");

const quotes = ref([
  {
    id: 1,
    number: "DEV-2025-001",
    project: "Projet E-commerce",
    description: "Développement d'une plateforme e-commerce complète",
  },
  {
    id: 2,
    number: "DEV-2025-002",
    project: "Projet Marketing Digital",

    description: "Campagne marketing digital sur 3 mois",
  },
  {
    id: 3,
    number: "DEV-2025-003",
    project: "Projet Refonte Site Web",

    description: "Refonte complète du site web corporate",
  },
]);

const filteredQuotes = computed(() => {
  return quotes.value.filter((quote) => {
    const searchLower = searchQuery.value.toLowerCase();
    return (
      quote.number.toLowerCase().includes(searchLower) ||
      quote.project.toLowerCase().includes(searchLower)
    );
  });
});

const emit = defineEmits(["preview"]);
const previewQuote = (quote: any) => {
  emit("preview", quote);
};

const deleteQuote = (quote: any) => {
  // Implementation for deleting quote
};
const editQuote = (quote: any) => {};
</script>

<style scoped></style>
