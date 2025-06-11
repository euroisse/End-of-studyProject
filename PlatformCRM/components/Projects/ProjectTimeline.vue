<template>
  <div class="mb-8 bg-white w-full rounded-sm flex-1 p-8 pt-4">
    <h2 class="text-xl font-bold font-Roboto mb-6 ml-3">Étapes du projet</h2>
    <div class="relative">
      <div
        class="absolute top-5 left-5 h-[calc(100%-40px)] w-0.5 bg-gray-200"
      ></div>
      <div class="space-y-8">
        <div
          v-for="(step, index) in projectStore.selectedProject?.projectStages"
          :key="step.id"
          class="relative flex"
        >
          <div
            :class="`w-10 h-10 rounded-full flex items-center justify-center
              ${
                getProjectStageStatus(step.tasks) === 'TERMINE'
                  ? 'bg-green-500'
                  : getProjectStageStatus(step.tasks) === 'EN_COURS'
                  ? 'bg-indigo-500'
                  : getProjectStageStatus(step.tasks) === 'A_VENIR'
                  ? 'bg-gray-200'
                  : 'bg-gray-200'
              } text-white font-medium text-[14px] font-Roboto`"
          >
            <i :class="getIconClass(getProjectStageStatus(step.tasks))"></i>
          </div>

          <div
            class="ml-8 bg-gray-50 shadow-sm md:p-6 hover:shadow-md transition-shadow rounded-lg p-4 flex-1"
          >
            <div class="flex justify-between items-start mb-4">
              <h1 class="font-medium text-[16px] capitalize">
                {{ step.title }}
              </h1>
              <span
                :class="`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    getProjectStageStatus(step.tasks) === 'TERMINE'
                      ? 'bg-green-100 text-green-600'
                      : getProjectStageStatus(step.tasks) === 'EN_COURS'
                      ? 'bg-indigo-100 text-indigo-600'
                      : getProjectStageStatus(step.tasks) === 'A_VENIR'
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-100 text-gray-600'
                  }`"
              >
                {{ getStatusText(getProjectStageStatus(step.tasks)) }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <p class="text-gray-500 capitalize">{{ step.description }}</p>
              <div v-if="isAdmin" class="flex space-x-2">
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
  <div class="mt-8">
    <button
      v-if="isAdmin"
      @click="showCreateStageProject = true"
      class="w-full flex items-center justify-center py-6 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-md border border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      <i class="ri-add-line mr-1"></i>
      Ajouter une étape
    </button>
  </div>
  <AddModal
    :is-open="showCreateStageProject"
    @close="showCreateStageProject = false"
    @stageAdded="stageAdded"
  />
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import type { Tasks } from "~/generated/prisma";
import ProjectStageModal from "./ProjectStageModal.vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useProjectStore } from "~/stores/projectStore";
import AddModal from "~/pages/projects/ProjectStage/AddModal.vue";
import type { ProjectStageWithTasks } from "~/types";

const { isAdmin } = useIsRole();
const emit = defineEmits(["refreshStages"]);
const projectStore = useProjectStore();
const showModal = ref(false);
const selectedProjectStage = ref<ProjectStageWithTasks | null>(null);
const showCreateStageProject = ref(false);

// Définit un type pour les statuts d'étape utilisés dans l'interface
type ProjectStageStatus = "TERMINE" | "EN_COURS" | "A_VENIR";

const getStatusText = (status: ProjectStageStatus) => {
  return (
    {
      TERMINE: "Terminé",
      EN_COURS: "En cours",
      A_VENIR: "À venir",
    }[status] || "Inconnu"
  );
};

const getIconClass = (status: ProjectStageStatus) => {
  return (
    {
      TERMINE: "ri-checkbox-circle-fill",
      EN_COURS: "ri-code-fill",
      A_VENIR: "ri-time-line",
    }[status] || "ri-question-line"
  );
};

const formatDate = (date?: Date | null): string => {
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

const editProjectStage = (stage: ProjectStageWithTasks) => {
  console.log("Édition de l'étape:", stage);
  selectedProjectStage.value = stage;
  projectStore.setSelectedProjectStage(stage);
  showModal.value = true;
};

const closeModal = () => {
  selectedProjectStage.value = null;
  showModal.value = false;
};

const handleSaveProjectStage = async (updatedStage: ProjectStageWithTasks) => {
  try {
    // La mise à jour de l'étape ne concerne que les champs directs de ProjectStage (titre, description)
    // Le statut est géré par les tâches
    await projectStore.updateProjectStage(updatedStage.id!, {
      title: updatedStage.title,
      description: updatedStage.description,
    });
    closeModal();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étape:", error);
  }
};

const deleteProjectStage = async (id: number) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?")) {
    try {
      await projectStore.deleteProjectStage(id);
    } catch (error: any) {
      console.error(
        `Erreur lors de la suppression de l'étape: ${error.message}`
      );
    }
  }
};

const stageAdded = (newStage: ProjectStageWithTasks) => {
  if (projectStore.selectedProject && newStage) {
    console.log("Nouvelle étape ajoutée:", newStage);
    console.log(
      "Project avant ajout de l'étape:",
      projectStore.selectedProject
    );
    if (!projectStore.selectedProject.projectStages) {
      projectStore.selectedProject.projectStages = [];
    }

    projectStore.selectedProject.projectStages.push(newStage);
  }
  showCreateStageProject.value = false;
};

// La logique de statut de l'étape basée sur les tâches
function getProjectStageStatus(tasks: Tasks[] = []): ProjectStageStatus {
  if (!tasks || tasks.length === 0) {
    return "A_VENIR";
  }
  if (tasks.every((task) => task.status === "TERMINE")) {
    return "TERMINE";
  }
  // Si au moins une tâche est en cours, ou s'il y a des tâches à faire mais aucune en cours
  if (tasks.some((task) => task.status === "EN_COURS")) {
    return "EN_COURS";
  }
  // Si toutes les tâches ne sont pas terminées, et aucune n'est en cours, mais il reste des tâches à faire
  if (tasks.some((task) => task.status === "A_FAIRE")) {
    return "EN_COURS";
  }

  // Par défaut, si aucune condition n'est remplie, on considère que l'étape est en cours
  return "EN_COURS";
}
</script>

<style scoped>
/* Les styles restent les mêmes */
.bg-a-venir {
  background-color: #e5e7eb;
  color: #4b5563;
}

.text-a-venir {
  color: #4b5563;
}

.bg-en-attente {
  background-color: #fef08a;
  color: #a16207;
}

.text-en-attente {
  color: #a16207;
}
</style>
