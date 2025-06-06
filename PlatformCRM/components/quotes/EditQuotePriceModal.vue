<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex justify-between items-center">
          <div class="text-xl font-semibold text-white">
            <h2 class="text-xl font-bold tracking-wide">
              Éditer les prix du devis
            </h2>
          </div>

          <button
            @click="$emit('close')"
            class="text-blue-100 hover:text-white transition-colors duration-200"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Projet</label
            >
            <input
              type="text"
              :value="projectTitle"
              class="w-full border rounded-xl px-3 py-2 bg-gray-100 cursor-not-allowed"
              readonly
            />
          </div>

          <div v-if="projectStagesForQuote.length > 0">
            <label class="block mb-2 font-semibold text-gray-700"
              >Étapes du projet et prix</label
            >
            <div class="space-y-4">
              <div v-if="devisStore.loading" class="text-center py-4">
                <div
                  class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-indigo-500 border-gray-200"
                ></div>
                <p class="mt-1 text-gray-600">Chargement des étapes...</p>
              </div>
              <div
                v-else
                v-for="stage in projectStagesForQuote"
                :key="stage.id"
                class="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 class="font-medium text-gray-800">{{ stage.title }}</h4>
                  <p class="text-sm text-gray-600">
                    {{ stage.description || "Pas de description." }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <label :for="`price-${stage.id}`" class="sr-only"
                    >Prix pour {{ stage.title }}</label
                  >
                  <input
                    :id="`price-${stage.id}`"
                    type="number"
                    v-model.number="stagePrices[stage.id]"
                    min="0"
                    step="0.01"
                    class="w-32 p-2 border rounded-md text-right focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Prix"
                  />
                  <span class="text-gray-600">CFA</span>
                </div>
              </div>
            </div>

            <div class="mt-6 p-4 bg-indigo-50 rounded-lg text-right">
              <h3 class="text-xl font-bold text-indigo-800">
                Prix total initial: {{ formatPrice(originalTotalPrice) }} CFA
              </h3>
              <h3 class="text-xl font-bold text-indigo-800 mt-2">
                Nouveau prix total estimé:
                {{ formatPrice(calculateTotal()) }} CFA
              </h3>
            </div>
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700"
              >Date estimée de livraison</label
            >
            <input
              v-model="dateLivraison"
              type="date"
              class="w-full p-3 border rounded-xl bg-gray-100 cursor-not-allowed"
              readonly
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Statut du devis</label
          >
          <input
            type="text"
            :value="quoteStatusDisplayName"
            class="w-full border rounded-xl px-3 py-2 bg-gray-100 cursor-not-allowed"
            readonly
          />
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            :disabled="devisStore.loading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="devisStore.loading"
              >Mise à jour des prix en cours...</span
            >
            <span v-else>Mettre à jour les prix</span>
          </button>
        </div>
        <div v-if="devisStore.error" class="text-red-600 text-sm mt-2">
          Erreur: {{ devisStore.error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useQuoteStore } from "~/stores/quoteStore";

import type { ProjectStageRaw, QuoteStageInput, quote } from "~/types";

const props = defineProps<{
  quoteId: number;
}>();

const emit = defineEmits(["close", "success"]);

const devisStore = useQuoteStore();

const selectedProjectId = ref<number | null>(null);
const dateLivraison = ref<string>("");
const stagePrices = ref<Record<number, number>>({});
const quoteStatus = ref<string>("");
const projectStagesForQuote = ref<ProjectStageRaw[]>([]);
const projectTitle = ref<string>("");
const originalTotalPrice = ref<number>(0);

const quoteStatusDisplayName = computed(() => {
  switch (quoteStatus.value) {
    case "EN_ATTENTE":
      return "En attente";
    case "ACCEPTE":
      return "Accepté";
    case "REFUSE":
      return "Refusé";
    case "ANNULE":
      return "Annulé";
    case "BROUILLON":
      return "Brouillon";
    default:
      return quoteStatus.value;
  }
});

// Calcule le prix total des étapes (this will be the newTotalPrice)
const calculateTotal = (): number => {
  return Object.values(stagePrices.value).reduce(
    (sum, price) => sum + (price || 0),
    0
  );
};

const formatPrice = (price: number): string => {
  return price.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const handleSubmit = async () => {
  if (!props.quoteId) {
    alert("Erreur : ID du devis manquant pour la mise à jour.");
    return;
  }

  // Validation simple des prix
  if (
    Object.values(stagePrices.value).some(
      (p) => p === null || p === undefined || p < 0
    )
  ) {
    alert(
      "Veuillez vous assurer que tous les prix sont valides et non négatifs."
    );
    return;
  }

  const stagesWithPrices: QuoteStageInput[] = Object.keys(
    stagePrices.value
  ).map((stageId) => ({
    projectStageId: parseInt(stageId),
    prix: stagePrices.value[parseInt(stageId)] || 0,
  }));

  try {
    const payload = {
      stages: stagesWithPrices,
    };
    await devisStore.updatequote(props.quoteId, payload);
    emit("close");
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour des prix du devis :", error);
  }
};

onMounted(async () => {
  if (props.quoteId) {
    await devisStore.fetchQuoteDetails(props.quoteId);
    if (devisStore.quoteDetails) {
      const details: quote = devisStore.quoteDetails;
      selectedProjectId.value = details.projectId;
      dateLivraison.value = details.dateLivraison || "";
      quoteStatus.value = details.status;
      projectTitle.value = details.project?.title || "N/A";
      originalTotalPrice.value = details.totalPrice;

      // Remplit les étapes et les prix avec les données existantes du devis
      projectStagesForQuote.value = details.stages.map((s) => ({
        id: s.projectStageId,
        title: s.projectStage.title,
        description: s.projectStage.description,
      }));

      details.stages.forEach((stage) => {
        stagePrices.value[stage.projectStageId] = stage.prix;
      });
    }
  }
});
</script>
