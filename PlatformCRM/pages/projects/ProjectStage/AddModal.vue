<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">
            Ajouter une nouvelle étape
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label
            for="title"
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >Titre</label
          >
          <input
            v-model="formData.title"
            type="text"
            id="title"
            name="title"
            class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="description"
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >Description (optionnelle)</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            name="description"
            rows="6"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div class="mb-4">
          <label
            for="status"
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >Statut</label
          >
          <select
            v-model="formData.status"
            id="status"
            name="status"
            class="shadow border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            @click="$emit('close')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ProjectStage } from "~/generated/prisma";

const route = useRoute();
const projectId = computed(() => Number(route.params.id) ?? null);

const emit = defineEmits(["close", "stageAdded"]);

const formData = ref({
  title: "",
  description: null,
  status: "A_VENIR",
});

const isSubmitting = ref(false);

const statusOptions = {
  A_VENIR: "À venir",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  EN_ATTENTE: "En attente",
};

const handleSubmit = async () => {
  if (!projectId.value) {
    console.error("ID du projet manquant");
    return;
  }

  isSubmitting.value = true;

  try {
    const newStage = await $fetch("/api/Projects/projectStage", {
      method: "POST",
      body: {
        projectId: projectId.value,
        title: formData.value.title,
        description: formData.value.description || undefined,
        status: formData.value.status,
      },
    });

    emit("stageAdded", newStage);
    emit("close");

    // Reset form
    formData.value.title = "";
    formData.value.description = null;
    formData.value.status = "A_VENIR";
  } catch (error) {
    console.error("Erreur lors de la création de l'étape :", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
