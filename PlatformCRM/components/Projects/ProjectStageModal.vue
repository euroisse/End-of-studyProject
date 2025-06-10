<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold text-white">Modifier une etape</h2>
          </div>

          <button
            @click="$emit('close')"
            class="text-blue-100 hover:text-white transition-colors duration-200"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>
      <form @submit.prevent="saveProjectStage" class="p-6">
        <div class="space-y-6">
          <div>
            <label
              for="title"
              class="block text-sm font-medium mb-2 text-gray-700"
              >Titre</label
            >
          </div>
          <div class="mb-4">
            <input
              v-model="form.title"
              type="text"
              id="title"
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium mb-2 text-gray-700"
            >Description</label
          >
          <textarea
            v-model="form.description"
            id="description"
            rows="10"
            class="w-full px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label
            for="status"
            class="block text-sm font-medium mb-2 text-gray-700"
            >Statut</label
          >
          <div class="mb-4">
            <select
              v-model="form.status"
              id="status"
              name="status"
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="(status, key) in statusOptions"
                :key="key"
                :value="key"
              >
                {{ status }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-300 px-4 py-2 text-base"
            @click="$emit('close')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 px-4 py-2 text-base flex items-center justify-center gap-2"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"; // Ensure computed is imported
import type { ProjectStage } from "~/generated/prisma";
import { useProjectStore } from "~/stores/projectStore"; // Ensure correct path if changed

const projectStore = useProjectStore();
const emit = defineEmits(["close", "save"]);

const editingStage = computed(() => projectStore.selectedProjectStage);

const form = ref<Partial<ProjectStage>>({
  title: "",
  description: "",
  status: "A_VENIR",
});

const statusOptions = {
  A_VENIR: "À venir",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  EN_ATTENTE: "En attente",
};

watch(
  () => projectStore.selectedProjectStage,
  (newStage) => {
    if (newStage) {
      form.value = {
        id: newStage.id,
        title: newStage.title,
        description: newStage.description,
        status: newStage.status,
      };
    } else {
      form.value = { title: "", description: "", status: "A_VENIR" };
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
      ...form.value,
    });
    emit("close");
    console.log("Étape mise à jour avec succès");
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de l'étape: ${error.message}`);
    // Afficher une alerte ou un message d'erreur à l'utilisateur
    alert(
      `Erreur lors de la mise à jour: ${error.message || "Erreur inconnue"}`
    );
  }
};
</script>

<style scoped></style>
