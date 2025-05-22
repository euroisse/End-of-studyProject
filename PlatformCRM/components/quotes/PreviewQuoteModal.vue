<template>
  <div
    v-if="quoteDetails"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-full max-w-2xl">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Aperçu du devis</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>
        <div>
          <div class="flex justify-between">
            <h1 class="text-2xl font-bold text-gray-800">
              Devis #{{ quoteDetails.number }}
            </h1>
            <span
              :class="[
                'inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium',
                statusClass(quoteDetails.status),
              ]"
            >
              {{ quoteDetails.status }}
            </span>
          </div>

          <p class="text-gray-600 font-bold">
            Client: {{ quoteDetails.customer?.name || "N/A" }}
          </p>
          <p class="text-gray-600 font-bold">
            Projet: {{ quoteDetails.project?.title || "N/A" }}
          </p>
          <p class="text-gray-600 font-bold">
            Date de livraison estimée:
            {{
              quoteDetails.dateLivraison
                ? formatDate(quoteDetails.dateLivraison)
                : "N/A"
            }}
          </p>
          <p
            class="text-lg font-bold mt-4"
            :class="
              quoteDetails.newTotalPrice ? 'text-red-600' : 'text-gray-800'
            "
          >
            Prix Total:
            {{
              formatPrice(
                quoteDetails.newTotalPrice !== null &&
                  quoteDetails.newTotalPrice !== undefined
                  ? quoteDetails.newTotalPrice
                  : quoteDetails.totalPrice
              )
            }}
            CFA
          </p>
        </div>

        <div class="space-y-6 mt-6">
          <h2 class="text-xl font-semibold text-gray-700">Étapes du devis</h2>
          <div class="relative border-l-2 border-gray-200 pl-6 space-y-10">
            <div
              v-for="(stage, index) in quoteDetails.stages"
              :key="stage.projectStageId"
              class="relative"
            >
              <span
                class="absolute -left-[9px] top-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"
              ></span>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="text-lg font-medium text-gray-800">
                    {{ stage.projectStage.title }}
                  </h3>
                  <span class="text-blue-600 font-semibold">
                    {{ stage.prix }} CFA
                  </span>
                </div>
                <p class="text-gray-600 text-sm">
                  {{ stage.projectStage.description || "Pas de description." }}
                </p>
              </div>
            </div>
            <p v-if="quoteDetails.stages.length === 0" class="text-gray-500">
              Aucune étape définie pour ce devis.
            </p>
          </div>
        </div>

        <div class="flex justify-end mt-6 space-x-4">
          <button
            @click="downloadPDF"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all whitespace-nowrap cursor-pointer !rounded-button"
          >
            <i class="ri-download-line mr-2"></i>
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuoteStore } from "#imports";
import type { quote } from "~/types";

const props = defineProps<{
  quoteId: number | null;
}>();

const emit = defineEmits(["close"]);
const devisStore = useQuoteStore();

const quoteDetails = ref<quote | null>(null);

watch(
  () => props.quoteId,
  async (newId) => {
    if (newId) {
      await fetchQuoteData(newId);
    } else {
      quoteDetails.value = null;
    }
  },
  { immediate: true }
);

async function fetchQuoteData(id: number) {
  try {
    const data = await devisStore.fetchQuoteDetails(id);
    if (data) {
      quoteDetails.value = data;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails du devis :",
      error
    );
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), "dd MMMM yyyy à HH:mm", { locale: fr });
  } catch (e) {
    console.error("Erreur de formatage de date:", e);
    return "Date invalide";
  }
};

const formatPrice = (price: number): string => {
  return price.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const statusClass = (status: string) => {
  switch (status) {
    case "ACCEPTE":
      return "bg-green-100 text-green-700";
    case "REFUSE":
      return "bg-red-100 text-red-700";
    case "EN_ATTENTE":
      return "bg-yellow-100 text-yellow-700";
    case "BROUILLON":
      return "bg-gray-100 text-gray-700";
    case "ANNULE":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const downloadPDF = () => {
  if (quoteDetails.value) {
    console.log("Télécharger PDF pour le devis :", quoteDetails.value.id);
  }
};
</script>
