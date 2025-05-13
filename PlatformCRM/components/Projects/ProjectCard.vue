<template>
  <div
    v-if="project"
    class="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow grid grid-cols-1 gap-y-3 md:gap-y-4"
  >
    <div class="flex justify-between items-start">
      <h3 class="text-base font-semibold text-gray-800 sm:text-lg">
        {{ project.title }}
      </h3>
      <span
        :class="getStatusClassComputed"
        class="px-2 py-1 md:px-1 md:py-1 rounded-full text-xs font-medium"
      >
        {{ project.status }}
      </span>
    </div>

    <div>
      <span class="flex items-center text-gray-500 text-sm">
        <i class="ri-building-2-fill text-base text-gray-500 sm:text-sm"></i>
        {{ project.customer?.name }}
      </span>
      <div class="flex justify-between text-xs text-gray-600 mb-1 md:mb-2">
        <span>Progression</span>
        <span>{{ calculateProgress }}%</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full">
        <div
          class="h-full bg-indigo-600 rounded-full"
          :style="{ width: `${calculateProgress}%` }"
        ></div>
      </div>
    </div>

    <div class="flex justify-between items-center text-xs text-gray-600">
      <span>Mise à jour: {{ formattedLastUpdate }}</span>
      <button
        @click="goToProjectDetails(project.id)"
        class="text-indigo-600 hover:text-indigo-800 cursor-pointer"
      >
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "vue-router";
import { useProjectStore } from "~/stores/projectStore";
import type { Project } from "~/types";

const projectStore = useProjectStore();
const router = useRouter();
const route = useRoute();

const projectId = computed(() => Number(route.params.id));
const project = computed<Project>(() => {
  if (projectId.value) {
    return projectStore.projects.find((p) => p.id === projectId.value);
  }
  return undefined;
});

const getStatusClassComputed = computed(() => (status: Project["status"]) => {
  switch (status) {
    case "EN_COURS":
      return "bg-blue-100 text-blue-800";
    case "EN_ATTENTE":
      return "bg-yellow-100 text-yellow-800";
    case "TERMINE":
      return "bg-green-100 text-green-800";
    case "A_VENIR":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});

const formattedLastUpdate = computed(() => {
  if (!project.value?.updatedAt) return "Non défini";
  const date = new Date(project.value.updatedAt);
  if (isNaN(date.getTime())) return "Date invalide";
  return format(date, "dd MMMM", { locale: fr });
});

const calculateProgress = computed(() => {
  if (
    !project.value?.projectStages ||
    project.value.projectStages.length === 0
  ) {
    return 0;
  }
  const completedStages = project.value.projectStages.filter(
    (stage) => stage.status === "TERMINE"
  ).length;
  return Math.round(
    (completedStages / project.value.projectStages.length) * 100
  );
});

const goToProjectDetails = (id: number) => {
  console.log("Navigating to project ID:", id);
  router.push(`/projects/${id}`);
};
</script>
