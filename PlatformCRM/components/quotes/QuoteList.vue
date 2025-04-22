<template>
    <div class="bg-white rounded-lg  shadow-md">
      <div class="p-6 ">
        <div class="flex items-center justify-between container mb-4">
          <div class="relative ">
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
          <div class="flex space-x-2">
            <button
              @click="filterStatus = 'all'"
              :class="{
                'bg-indigo-500 text-white': filterStatus === 'all',
                'bg-gray-100 text-gray-600': filterStatus !== 'all',
              }"
              class="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer !rounded-button"
            >
              Tous
            </button>
            <button
              @click="filterStatus = 'draft'"
              :class="{
                'bg-indigo-600 text-white': filterStatus === 'draft',
                'bg-gray-100 text-gray-600': filterStatus !== 'draft',
              }"
              class="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer !rounded-button"
            >
              Brouillons
            </button>
            <button
              @click="filterStatus = 'sent'"
              :class="{
                'bg-indigo-600 text-white': filterStatus === 'sent',
                'bg-gray-100 text-gray-600': filterStatus !== 'sent',
              }"
              class="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer !rounded-button"
            >
              Envoyés
            </button>
            <button
              @click="filterStatus = 'accepted'"
              :class="{
                'bg-indigo-600 text-white': filterStatus === 'accepted',
                'bg-gray-100 text-gray-600': filterStatus !== 'accepted',
              }"
              class="px-4 py-2  rounded-lg transition-all whitespace-nowrap cursor-pointer !rounded-button"
            >
              Acceptés
            </button>
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
                  Client
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Montant
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  {{ quote.client }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ quote.amount }}€
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ quote.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(quote.status)"
                    class="px-3 py-2 text-xs rounded-full"
                  >
                    {{ getStatusText(quote.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button @click="previewQuote(quote)"
                      class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    >
                      <i class="ri-eye-line"  ></i>
                    </button>
                    <button
                      @click="convertToInvoice(quote)"
                      class="text-green-600 hover:text-green-900 cursor-pointer"
                      v-if="quote.status === 'accepted'"
                    >
                      <i class="ri-file-invoice-line"></i>
                    </button>
                    <button
                      @click="sendQuote(quote)"
                      class="text-blue-600 hover:text-blue-900 cursor-pointer"
                      v-if="quote.status === 'draft'"
                    >
                      <i class="ri-send-plane-line"></i>
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
      client: "Entreprise A",
      amount: 5000,
      date: "15/04/2025",
      status: "draft",
      description: "Développement d'une plateforme e-commerce complète",
    },
    {
      id: 2,
      number: "DEV-2025-002",
      project: "Projet Marketing Digital",
      client: "Entreprise B",
      amount: 3500,
      date: "14/04/2025",
      status: "sent",
      description: "Campagne marketing digital sur 3 mois",
    },
    {
      id: 3,
      number: "DEV-2025-003",
      project: "Projet Refonte Site Web",
      client: "Entreprise C",
      amount: 7500,
      date: "13/04/2025",
      status: "accepted",
      description: "Refonte complète du site web corporate",
    },
  ]);
  
  const filteredQuotes = computed(() => {
    return quotes.value
      .filter((quote) => {
        if (filterStatus.value !== "all") {
          return quote.status === filterStatus.value;
        }
        return true;
      })
      .filter((quote) => {
        const searchLower = searchQuery.value.toLowerCase();
        return (
          quote.number.toLowerCase().includes(searchLower) ||
          quote.project.toLowerCase().includes(searchLower) ||
          quote.client.toLowerCase().includes(searchLower)
        );
      });
  });
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Brouillon";
      case "sent":
        return "Envoyé";
      case "accepted":
        return "Accepté";
      default:
        return status;
    }
  };
  const emit = defineEmits(['preview']);
  const previewQuote = (quote: any) => {
    emit('preview', quote);
  };
  const convertToInvoice = (quote: any) => {
    // Implementation for converting to invoice
  };
  
  const sendQuote = (quote: any) => {
    // Implementation for sending quote
  };
  
  const deleteQuote = (quote: any) => {
    // Implementation for deleting quote
  };
  </script>
  
  <style scoped></style>