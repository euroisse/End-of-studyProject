<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold text-white">
              Ajouter une nouvelle étape
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
            <label
              for="title"
              class="block text-sm font-medium mb-2 text-gray-700"
              >Titre</label
            >
            <div class="mb-4">
              <input
                v-model="formData.title"
                type="text"
                id="title"
                name="title"
                class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="EX: Conception des maquettes"
              />
            </div>
          </div>
          <div>
            <label
              for="description"
              class="block text-sm font-medium mb-2 text-gray-700"
              >Description (optionnelle)</label
            >
            <textarea
              v-model="formData.description"
              id="description"
              name="description"
              rows="6"
              class="w-full px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500"
              placeholder="Decrivez votre etape en quelques mots..."
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
                v-model="formData.status"
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
import { ref, computed } from "vue";
import type { ProjectStage } from "~/generated/prisma";
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const route = useRoute();
const projectId = computed(() => Number(route.params.id) ?? null);

const emit = defineEmits(["close", "stageAdded"]);

const formData = ref({
  title: "",
  description: null,
  status: "A_VENIR",
});

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
