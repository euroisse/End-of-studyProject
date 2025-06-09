<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-xl font-bold mb-6">Avancement de votre projet</h2>
    <div v-if="projects.length === 0" class="text-gray-500 text-center py-4">
      Aucun projet disponible pour le moment.
    </div>
    <div v-else>
      <div v-for="project in projects" :key="project.id" class="relative mb-8">
        <h3 class="font-semibold text-gray-800 text-lg mb-4">
          {{ project.title }}
        </h3>
        <div class="flex justify-between mb-8 space-x-4">
          <div
            v-for="(stage, stageIndex) in project.projectStages"
            :key="stage.id"
            class="relative flex items-center"
          >
            <div
              v-if="stageIndex !== 0"
              class="absolute left-[-50%] top-1/2 w-[50%] h-1 bg-gray-300"
              :style="{
                backgroundColor: getLineColor(
                  project.projectStages[stageIndex - 1]?.status
                ),
              }"
            ></div>

            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 relative ',
                getStageColor(stage.status),
              ]"
            >
              <i
                :class="getIconClass(stage.status)"
                class="text-white text-xl"
              ></i>
            </div>
            <p
              class="absolute top-12 w-10 text-center text-sm font-medium text-gray-600"
            >
              {{ stage.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project, ProjectStageStatus } from "~/generated/prisma";

interface ProjectStage {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: ProjectStageStatus;
  createdAt: string;
  updatedAt: string;
}

interface ExtendedProject extends Project {
  projectStages: ProjectStage[];
}

defineProps<{
  projects: ExtendedProject[];
}>();

const getIconClass = (status: ProjectStageStatus) => {
  return (
    {
      TERMINE: "ri-check-line",
      EN_COURS: "ri-code-line",
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
      A_VENIR: "bg-gray-200",
      EN_ATTENTE: "bg-yellow-400",
    }[status] || "bg-gray-200"
  );
};

const getLineColor = (previousStageStatus: ProjectStageStatus) => {
  return previousStageStatus === "TERMINE" ? "bg-green-500" : "bg-gray-300";
};
</script>

<style scoped>
/* You can add specific styles here if needed */
</style>
