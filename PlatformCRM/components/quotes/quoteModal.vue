<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">
            Créer un nouveau devis
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="createQuote" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Projet</label
            >
            <select
              v-model="selectedProjectId"
              class="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
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

          <div>
            <label class="block mb-2 font-semibold text-gray-700"
              >Étapes du projet</label
            >
            <div class="space-y-4">
              <div
                v-for="(etape, index) in etapes"
                :key="index"
                class="flex items-center gap-4"
              >
                <input
                  v-model="etape.nom"
                  type="text"
                  placeholder="Nom de l'étape"
                  class="flex-1 p-3 border rounded-xl"
                />
                <input
                  v-model.number="etape.prix"
                  type="number"
                  placeholder="Prix CFA"
                  class="w-40 p-3 border rounded-xl"
                />
                <button
                  type="button"
                  @click="removeEtape(index)"
                  class="text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </div>
              <button
                type="button"
                @click="addEtape"
                class="text-blue-600 hover:underline"
              >
                + Ajouter une étape
              </button>
            </div>
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700"
              >Date estimée de livraison</label
            >
            <input
              v-model="dateLivraison"
              type="date"
              class="w-full p-3 border rounded-xl"
            />
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="saveAsDraft"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Enregistrer comme brouillon
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Créer et envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuoteStore } from "~/stores/quoteStore";

const emit = defineEmits(["close"]);
const devisStore = useQuoteStore();

const dateLivraison = ref("");
const selectedProjectId = ref("");
const etapes = ref([{ nom: "", prix: 0 }]);
const projects = ref<Project[]>([]);
const addEtape = () => etapes.value.push({ nom: "", prix: 0 });
const removeEtape = (index: number) => etapes.value.splice(index, 1);

const createQuote = async () => {
  if (!selectedProjectId.value) {
    alert("Veuillez sélectionner un projet.");
    return;
  }

  const payload = {
    projectId: Number(selectedProjectId.value),
    dateLivraison: dateLivraison.value,
    stages: etapes.value.map((etape) => ({
      nom: etape.nom,
      prix: etape.prix,
    })),
  };
  console.log("Créer le devis avec :", payload);
  try {
    await devisStore.createQuote(payload);
    emit("close");
  } catch (error) {
    console.error("Erreur lors de la création du devis :", error);
  }
};

const saveAsDraft = () => {
  emit("close");
};

onMounted(async () => {
  const data = await $fetch<Project[]>("/api/Projects/projects");
  projects.value = data;
});
</script>
