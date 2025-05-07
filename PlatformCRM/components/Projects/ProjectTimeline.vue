<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold font-Roboto mb-6">Étapes du projet</h2>
    <div class="relative">
      <div
        class="absolute top-5 left-5 h-[calc(100%-40px)] w-0.5 bg-gray-200"
      ></div>
      <div class="space-y-8">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="relative flex"
        >
          <div
            :class="`w-10 h-10 rounded-full flex items-center justify-center z-10
            ${
              step.status === 'TERMINE'
                ? 'bg-green-500'
                : step.status === 'EN_COURS'
                ? 'bg-indigo-500'
                : 'bg-gray-200'
            } text-white font-medium text-[14px] font-Roboto`"
          >
            <i :class="getIconClass(step.status)"></i>
          </div>

          <div
            class="ml-8 bg-gray-50 shadow-sm md:p-6 hover:shadow-md transition-shadow rounded-lg p-4 flex-1"
          >
            <div class="flex justify-between items-start mb-4">
              <h1 class="font-medium text-[16px]">{{ step.title }}</h1>
              <span
                :class="`px-3 py-1 rounded-full text-sm font-medium
                ${
                  step.status === 'TERMINE'
                    ? 'bg-green-100 text-green-600'
                    : step.status === 'EN_COURS'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600'
                }`"
              >
                {{ getStatusText(step.status) }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <p class="text-gray-500">{{ step.description }}</p>
              <div class="flex space-x-2">
                <i
                  class="ri-pencil-line text-gray-600 cursor-pointer hover:text-indigo-600"
                  @click="editProjectStage(step)"
                ></i>
                <i
                  class="ri-delete-bin-6-line text-gray-600 cursor-pointer hover:text-red-600"
                  @click="deleteProjectStage(step.id)"
                ></i>
              </div>
            </div>

            <p class="text-sm text-gray-500 mt-2">
              Date de livraison estimée: {{ formatDate(step.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <ProjectStageModal
      v-if="showModal"
      :project-stage="selectedProjectStage"
      @close="closeModal"
      @save="handleSaveProjectStage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import type { ProjectStage, ProjectStageStatus } from "~/generated/prisma";
import ProjectStageModal from "./ProjectStageModal.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const props = defineProps<{ steps: ProjectStage[] }>();
const emit = defineEmits(["refreshStages"]);

const showModal = ref(false);
const selectedProjectStage = ref<ProjectStage | null>(null);

const getStatusText = (status: ProjectStageStatus) => {
  return (
    {
      TERMINE: "Terminé",
      EN_COURS: "En cours",
      A_VENIR: "À venir",
      EN_ATTENTE: "En attente",
    }[status] || "Inconnu"
  );
};

const getIconClass = (status: ProjectStageStatus) => {
  return (
    {
      TERMINE: "ri-checkbox-circle-fill",
      EN_COURS: "ri-code-fill",
      A_VENIR: "ri-time-line",
      EN_ATTENTE: "ri-pause-circle-line",
    }[status] || "ri-question-line"
  );
};

const formatDate = (date?: Date): string => {
  if (date) {
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "";
    }
  }
  return "";
};

const editProjectStage = (stage: ProjectStage) => {
  selectedProjectStage.value = { ...stage };
  showModal.value = true;
};

const closeModal = () => {
  selectedProjectStage.value = null;
  showModal.value = false;
};

const handleSaveProjectStage = async (updatedStage: ProjectStage) => {
  try {
    emit("refreshStages");
    closeModal();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étape:", error);
  }
};

const deleteProjectStage = async (id: number) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?")) {
    try {
      const response = await $fetch(`/api/projectStage/${id}`, {
        method: "DELETE",
      });

      if (response) {
        emit("refreshStages");
        console.log("Étape de projet supprimée avec succès");
      } else {
        console.error("La suppression de l'étape a échoué.");
      }
    } catch (error: any) {
      console.error(
        `Erreur lors de la suppression de l'étape: ${error.message}`
      );
    }
  }
};
</script>
