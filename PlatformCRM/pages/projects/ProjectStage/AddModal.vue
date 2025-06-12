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
                :class="{ 'border-red-500': errors.title }"
                required
                placeholder="EX: Conception des maquettes"
                @focus="errors.title = ''"
              />
            </div>
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">
              {{ errors.title }}
            </p>
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
              placeholder="Décrivez votre étape en quelques mots..."
            ></textarea>
          </div>
          <div>
            <label
              for="endDate"
              class="block text-sm font-medium mb-2 text-gray-700"
              >Date de livraison estimée</label
            >
            <input
              v-model="formData.endDate"
              type="date"
              id="endDate"
              class="w-full px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.endDate }"
              @focus="errors.endDate = ''"
            />
            <p v-if="errors.endDate" class="mt-1 text-sm text-red-600">
              {{ errors.endDate }}
            </p>
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
import { ref, computed, reactive } from "vue";
import type { ProjectStage } from "~/generated/prisma";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  projectStartDate: {
    type: String,
    default: undefined,
  },
  projectEndDate: {
    type: String,
    default: undefined,
  },
});

const route = useRoute();
const projectId = computed(() => Number(route.params.id) ?? null);

const emit = defineEmits(["close", "stageAdded"]);

const formData = ref({
  title: "",
  description: null as string | null,
  endDate: null as string | null,
});

const errors = reactive({
  title: "",
  endDate: "",
});

const validateForm = (): boolean => {
  let valid = true;
  errors.title = "";
  errors.endDate = "";

  if (!formData.value.title.trim()) {
    errors.title = "Le titre de l'étape est obligatoire.";
    valid = false;
  }

  if (formData.value.endDate) {
    const stageEndDate = new Date(formData.value.endDate);
    stageEndDate.setHours(0, 0, 0, 0);

    if (props.projectStartDate) {
      const projectStartDate = new Date(props.projectStartDate);
      projectStartDate.setHours(0, 0, 0, 0);
      if (stageEndDate < projectStartDate) {
        errors.endDate =
          "La date de livraison de l'étape ne peut pas être antérieure à la date de début du projet.";
        valid = false;
      }
    }

    if (props.projectEndDate) {
      const projectEndDate = new Date(props.projectEndDate);
      projectEndDate.setHours(0, 0, 0, 0);
      if (stageEndDate > projectEndDate) {
        errors.endDate =
          "La date de livraison de l'étape ne peut pas être postérieure à la date de fin du projet.";
        valid = false;
      }
    }
  }

  return valid;
};

const handleSubmit = async () => {
  if (!projectId.value) {
    console.error("ID du projet manquant");
    return;
  }

  if (!validateForm()) {
    return;
  }

  try {
    const newStage = await $fetch<ProjectStage>("/api/Projects/projectStage", {
      method: "POST",
      body: {
        projectId: projectId.value,
        title: formData.value.title,
        description: formData.value.description || undefined,
        endDate: formData.value.endDate
          ? new Date(formData.value.endDate)
          : null,
      },
    });

    emit("stageAdded", newStage);
    emit("close");

    // Reset form
    formData.value.title = "";
    formData.value.description = null;
    formData.value.endDate = null;
  } catch (error) {
    console.error("Erreur lors de la création de l'étape :", error);
    // You might want to display a more generic error if the API returns one
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
