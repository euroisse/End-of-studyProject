<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold text-white">
              Créer un nouveau devis
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
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Projet</label
            >
            <div class="mb-4">
              <select
                v-model="selectedProjectId"
                @change="fetchProjectStages"
                class="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option disabled value="">Sélectionner un projet</option>
                <option
                  v-for="project in projects"
                  :key="project.id"
                  :value="project.id"
                >
                  {{ project.title }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="selectedProjectId">
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
                v-else-if="projectStagesForQuote.length === 0"
                class="text-gray-500"
              >
                Aucune étape définie pour ce projet.
              </div>
              <div
                v-for="stage in projectStore.selectedProject?.projectStages"
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
                    class="w-32 p-2 border rounded-md text-right focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Prix"
                  />
                  <span class="text-gray-600">CFA</span>
                </div>
              </div>
            </div>

            <div class="mt-6 p-4 bg-indigo-50 rounded-lg text-right">
              <h3 class="text-xl font-bold text-indigo-800">
                Prix total estimé: {{ formatPrice(calculateTotal()) }} CFA
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
              class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Statut du devis</label
            >
            <select
              v-model="quoteStatus"
              class="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="EN_ATTENTE">En attente</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-300 px-4 py-2 text-base"
            @click="$emit('close')"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="devisStore.loading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="devisStore.loading">Sauvegarde en cours...</span>
            <span v-else>{{
              isEditing ? "Mettre à jour" : "Créer et envoyer"
            }}</span>
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
import { ref, onMounted, watch, computed } from "vue";
import { useQuoteStore } from "#imports";
import type { ProjectStageRaw, CreateUpdateQuotePayload } from "~/types";

const props = defineProps<{
  quoteId?: number | null;
}>();

const emit = defineEmits(["close", "success"]);

const devisStore = useQuoteStore();
const projectStore = useProjectStore();
const selectedProjectId = ref<number | null>(null);
const dateLivraison = ref<string>("");
const stagePrices = ref<Record<number, number>>({});
const quoteStatus = ref<string>("EN_ATTENTE");
const projectStagesForQuote = ref<ProjectStageRaw[]>([]);
const projects = ref<Project[]>([]);

const isEditing = computed(
  () => props.quoteId !== null && props.quoteId !== undefined
);

// Fonction pour récupérer les projets
async function fetchProjects() {
  try {
    const data = await $fetch<Project[]>("/api/Projects/projects");
    projects.value = data;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

// Fonction pour récupérer les étapes d'un projet sélectionné
async function fetchProjectStages() {
  if (selectedProjectId.value) {
    try {
      await projectStore.fetchProject(selectedProjectId.value);
      if (
        projectStore.selectedProject &&
        projectStore.selectedProject.projectStages
      ) {
        projectStagesForQuote.value =
          projectStore.selectedProject.projectStages;

        projectStagesForQuote.value.forEach((stage) => {
          if (devisStore.currentStagesPrices[stage.id] !== undefined) {
            stagePrices.value[stage.id] =
              devisStore.currentStagesPrices[stage.id];
          } else if (stagePrices.value[stage.id] === undefined) {
            stagePrices.value[stage.id] = 0;
          }
        });
      } else {
        projectStagesForQuote.value = [];
        stagePrices.value = {};
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des étapes du projet :",
        error
      );
      projectStagesForQuote.value = [];
    }
  } else {
    projectStagesForQuote.value = [];
    stagePrices.value = {};
  }
}

// Calcule le prix total
const calculateTotal = (): number => {
  return Object.values(stagePrices.value).reduce(
    (sum, price) => sum + (price || 0),
    0
  );
};

// Formatte le prix pour l'affichage
const formatPrice = (price: number): string => {
  return price.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const handleSubmit = async () => {
  if (!selectedProjectId.value) {
    return;
  }

  if (
    Object.values(stagePrices.value).some(
      (p) => p === null || p === undefined || p < 0
    )
  ) {
    return;
  }

  const stagesWithPrices = projectStagesForQuote.value.map((stage) => ({
    projectStageId: stage.id,
    prix: stagePrices.value[stage.id] || 0,
  }));

  try {
    if (isEditing.value && props.quoteId) {
      const payload: CreateUpdateQuotePayload = {
        projectId: selectedProjectId.value,
        stagesWithPrices: stagesWithPrices,
        status: quoteStatus.value,
        dateLivraison: dateLivraison.value || null,
      };
      await devisStore.updatequote(props.quoteId, payload);
      alert("Devis mis à jour avec succès !");
    } else {
      const payload: CreateUpdateQuotePayload = {
        projectId: selectedProjectId.value,
        stagesWithPrices: stagesWithPrices,
        dateLivraison: dateLivraison.value || undefined,
      };
      await devisStore.createQuote(payload);
      alert("Devis créé et envoyé avec succès !");
    }

    emit("success");
    emit("close");
  } catch (error: any) {
    console.error("Erreur lors de l'opération sur le devis :", error);
  }
};

const saveAsDraft = async () => {
  if (!selectedProjectId.value) {
    return;
  }

  const stagesWithPrices = projectStagesForQuote.value.map((stage) => ({
    projectStageId: stage.id,
    prix: stagePrices.value[stage.id] || 0,
  }));
  const payload: CreateUpdateQuotePayload = {
    projectId: selectedProjectId.value,
    stagesWithPrices: stagesWithPrices,
    dateLivraison: dateLivraison.value || undefined,
    status: "BROUILLON",
  };

  try {
    if (isEditing.value && props.quoteId) {
      await devisStore.updatequote(props.quoteId, payload);
      alert("Devis enregistré comme brouillon avec succès !");
    } else {
      await devisStore.createQuote(payload);
      alert("Devis créé et enregistré comme brouillon avec succès !");
    }
    emit("success");
    emit("close");
  } catch (error: any) {
    console.error("Erreur lors de la sauvegarde comme brouillon :", error);
  }
};

watch(selectedProjectId, (newVal) => {
  if (newVal) {
    fetchProjectStages();
  } else {
    projectStagesForQuote.value = [];
    stagePrices.value = {};
  }
});

watch(
  () => devisStore.quoteDetails,
  (newDetails) => {
    if (isEditing.value && newDetails) {
      selectedProjectId.value = newDetails.projectId;
      dateLivraison.value = newDetails.dateLivraison || "";
      quoteStatus.value = newDetails.status;

      const prices: Record<number, number> = {};
      newDetails.stages.forEach((stage) => {
        prices[stage.projectStageId] = stage.prix;
      });
      stagePrices.value = prices;

      fetchProjectStages();
    } else if (!isEditing.value) {
      selectedProjectId.value = null;
      dateLivraison.value = "";
      stagePrices.value = {};
      quoteStatus.value = "EN_ATTENTE";
      projectStagesForQuote.value = [];
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchProjects();
  if (isEditing.value && props.quoteId) {
    await devisStore.fetchQuoteDetails(props.quoteId);
  }
});
</script>
