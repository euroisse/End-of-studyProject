<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-6">Avancement de votre projet</h2>
    <div v-if="projects.length === 0" class="text-gray-500 text-center py-4">
      Aucun projet disponible pour le moment.
    </div>
    <div v-else class="space-y-10 min-w-[600px]">
      <div
        v-for="project in projects"
        :key="project.id"
        class="border-b pb-6 last:border-b-0 last:pb-0"
      >
        <div class="mb-4">
          <h3 class="font-semibold text-gray-800 text-lg">
            {{ project.title }}
          </h3>
        </div>
        <div class="flex mb-8 space-x-0">
          <div
            v-for="(stage, stageIndex) in project.projectStages"
            :key="stage.id"
            class="flex-1 flex flex-col items-center relative"
          >
            <!-- Ligne de progression à gauche (sauf pour la première étape) -->
            <div
              v-if="stageIndex !== 0"
              class="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-1/2 z-0"
              :class="
                getLineColor(
                  getProjectStageStatus(
                    project.projectStages[stageIndex - 1]?.tasks || []
                  )
                )
              "
            ></div>
            <!-- Ligne de progression à droite (sauf pour la dernière étape) -->
            <div
              v-if="stageIndex !== project.projectStages.length - 1"
              class="absolute right-0 top-1/2 -translate-y-1/2 h-1 w-1/2 z-0"
              :class="getLineColor(getProjectStageStatus(stage.tasks || []))"
            ></div>
            <!-- Cercle étape -->
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold relative z-10 transition-colors duration-300 shadow',
                getStageColor(getProjectStageStatus(stage.tasks || [])),
              ]"
            >
              <i
                :class="getIconClass(getProjectStageStatus(stage.tasks || []))"
                class="text-xl"
              ></i>
            </div>
            <!-- Titre étape -->
            <div
              class="mt-2 w-full text-center text-xs text-gray-600 font-medium"
            >
              {{ stage.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project, Tasks } from "~/types/prismaFrontend/prisma";

// Ajoute ce type si besoin
type ProjectStageStatus = "A_VENIR" | "EN_COURS" | "TERMINE" | "EN_ATTENTE";

interface ProjectStage {
  id: number;
  projectId: number;
  title: string;
  description: string;
  tasks?: Tasks[];
  createdAt: string;
  updatedAt: string;
}

interface ExtendedProject extends Project {
  projectStages: ProjectStage[];
}

defineProps<{
  projects: ExtendedProject[];
}>();

function getProjectStageStatus(tasks: Tasks[] = []): ProjectStageStatus {
  if (!tasks || tasks.length === 0) return "A_VENIR";
  if (tasks.every((task) => task.status === "TERMINE")) return "TERMINE";
  if (tasks.some((task) => task.status === "EN_COURS")) return "EN_COURS";
  if (tasks.some((task) => task.status === "A_FAIRE")) return "EN_COURS";
  return "EN_COURS";
}

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

const getStageColor = (status: ProjectStageStatus) => {
  return (
    {
      TERMINE: "bg-green-500",
      EN_COURS: "bg-indigo-500",
      A_VENIR: "bg-gray-300",
      EN_ATTENTE: "bg-yellow-400",
    }[status] || "bg-gray-300"
  );
};

const getLineColor = (previousStageStatus: ProjectStageStatus) => {
  return previousStageStatus === "TERMINE" ? "bg-green-500" : "bg-gray-300";
};
</script>

<style scoped>
.flex-1 {
  flex: 1 1 0%;
}
</style>
