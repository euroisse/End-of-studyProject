<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Avancement des projets</h2>
    <div v-if="projects.length === 0" class="text-gray-500 text-center py-4">
      Aucun projet attribué pour le moment.
    </div>
    <div v-else class="space-y-8 min-w-[600px]">
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

        <div class="flex justify-between mb-8 space-x-4">
          <div
            v-for="(stage, stageIndex) in project.projectStages"
            :key="stage.id"
            class="relative flex items-center flex-shrink-0"
          >
            <div
              v-if="stageIndex !== 0"
              class="absolute left-[-50%] top-1/2 w-[50%] h-1 bg-gray-300 z-0"
            ></div>

            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold relative z-10 transition-colors duration-300',
                getStageColor(stage.status),
              ]"
            >
              <i :class="getIconClass(stage.status)" class="text-xl"></i>
            </div>

            <div
              class="absolute items-center top-14 w-20 text-center text-xs text-gray-600"
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
</script>

<style scoped>
/* You can add more specific styling here */
</style>
