<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
  >
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-4 rounded-2xl shadow-2xl p-0 transform transition-all bg-white"
    >
      <!-- Header -->
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold text-white">Modifier une étape</h2>
          </div>
          <button
            @click="$emit('close')"
            class="text-blue-100 hover:text-white transition-colors duration-200"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="saveProjectStage" class="p-6">
        <div class="space-y-6">
          <!-- Titre -->
          <div>
            <label
              for="title"
              class="block text-sm font-medium mb-2 text-gray-700"
            >
              Titre
            </label>
            <input
              v-model="form.title"
              type="text"
              id="title"
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium mb-2 text-gray-700"
            >
              Description
            </label>
            <textarea
              v-model="form.description"
              id="description"
              rows="5"
              class="w-full px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 resize-none sm:resize-y"
            ></textarea>
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            type="button"
            class="w-full sm:w-auto rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-300 px-4 py-2 text-base"
            @click="$emit('close')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="w-full sm:w-auto rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 px-4 py-2 text-base flex items-center justify-center gap-2"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ProjectStage } from "~/generated/prisma"; // Import ProjectStage
import { useProjectStore } from "~/stores/projectStore"; // Importe ProjectStageWithTasks

const projectStore = useProjectStore();
const emit = defineEmits(["close", "save"]);

const editingStage = computed(() => projectStore.selectedProjectStage);

const form = ref<Partial<ProjectStage>>({
  title: "",
  description: "",
});

watch(
  () => projectStore.selectedProjectStage,
  (newStage) => {
    if (newStage) {
      form.value = {
        id: newStage.id,
        title: newStage.title,
        description: newStage.description,
      };
    } else {
      form.value = { title: "", description: "" }; // Pas de statut par défaut
    }
  },
  { immediate: true, deep: true }
);

const saveProjectStage = async () => {
  if (!editingStage.value?.id) {
    console.error("projectStage id est undefined. Impossible de sauvegarder.");
    return;
  }

  try {
    console.log("Enregistrement de l'étape:", form.value);
    await projectStore.updateProjectStage(editingStage.value.id, {
      title: form.value.title,
      description: form.value.description,
    });
    emit("close");
    console.log("Étape mise à jour avec succès");
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de l'étape: ${error.message}`);
    alert(
      `Erreur lors de la mise à jour: ${error.message || "Erreur inconnue"}`
    );
  }
};
</script>

<style scoped></style>
