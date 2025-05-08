<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold font-Roboto">Modifier une etape</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <i class="ri-close-line"></i>
        </button>
      </div>
      <form @submit.prevent="saveProjectStage">
        <div class="mb-4">
          <label for="title" class="block text-gray-700 text-sm font-bold mb-2"
            >Titre</label
          >
          <input
            v-model="form.title"
            type="text"
            id="title"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="description"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Description</label
          >
          <textarea
            v-model="form.description"
            id="description"
            rows="10"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div class="mb-4">
          <label for="status" class="block text-gray-700 text-sm font-bold mb-2"
            >Statut</label
          >
          <select
            v-model="form.status"
            id="status"
            name="status"
            class="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            @click="$emit('close')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ProjectStage } from "~/generated/prisma";
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

watch(editingStage, (newStage) => {
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
}),
  { immediate: true };

const saveProjectStage = async () => {
  if (!editingStage.value?.id) {
    console.error("projectstage id est undefined");
    return;
  }

  try {
    await projectStore.updateProjectStage(editingStage.value.id, form.value);
    emit("close");
    console.log("Étape mise à jour avec succès");
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de l'étape: ${error.message}`);
  }
};
</script>
