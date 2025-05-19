<template>
  <div
    v-if="quote"
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
          <h1 class="text-2xl font-bold text-gray-800">
            Devis #{{ quote.numero }}
          </h1>
          <span
            :class="[
              'inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium',
              statusClass(quote.statut),
            ]"
          >
            {{ quote.statut }}
          </span>
        </div>

        <!-- Étapes -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-700">Étapes</h2>
          <div class="relative border-l-2 border-gray-200 pl-6 space-y-10">
            <div
              v-for="(etape, index) in quote.etapes"
              :key="index"
              class="relative"
            >
              <span
                class="absolute -left-[9px] top-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"
              ></span>
              <div class="bg-gray-50 p-4 rounded-xl shadow-sm">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="text-lg font-medium text-gray-800">
                    {{ etape.nom }}
                  </h3>
                  <span class="text-blue-600 font-semibold">
                    {{ etape.prix }} €
                  </span>
                </div>
                <p class="text-sm text-gray-500">
                  Début : {{ formatDate(etape.dateDebut) }} — Fin :
                  {{ formatDate(etape.dateFin) }}
                </p>
              </div>
            </div>
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

<style scoped></style>

<script setup lang="ts">
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const props = defineProps<{
  quote: {
    numero: string;
    statut: string;
    etapes: {
      nom: string;
      prix: number;
      dateDebut: string;
      dateFin: string;
    }[];
  } | null;
}>();

const quote = props.quote;

const formatDate = (dateStr: string) => {
  return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
};

const statusClass = (statut: string) => {
  switch (statut) {
    case "Accepté":
      return "bg-green-100 text-green-700";
    case "Refusé":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};
const downloadPDF = () => {
  if (props.quote) {
    console.log("Télécharger PDF pour le devis :");
    // l'implémentation pour télécharger le PDF
  }
};
</script>
