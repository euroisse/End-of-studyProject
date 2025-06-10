<template>
  <div
    v-if="project"
    class="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow grid grid-cols-1 gap-y-2 md:gap-y-4"
  >
    <div class="flex justify-between items-start">
      <h3 class="text-base font-semibold text-gray-800 sm:text-lg">
        {{ project.title }}
      </h3>
    </div>

    <div>
      <span class="flex items-center text-gray-500 text-sm mb-2">
        <i class="ri-user-2-line text-base text-gray-500 sm:text-sm mr-2"></i>
        {{ project.customer.name }}
      </span>
      <div class="flex justify-between text-xs text-gray-600 mb-3 md:mb-2">
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
      <span>Mise à jour : {{ formattedLastUpdate }}</span>
      <button
        @click="goToProjectDetails(project.id)"
        class="text-gray-600 hover:text-indigo-800 cursor-pointer"
      >
        <i class="ri-arrow-right-s-line text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "vue-router";

import type { ProjectWithProjectStages } from "~/types";

const props = defineProps<{
  project: ProjectWithProjectStages;
}>();
const projectStore = useProjectStore();
const { project } = props;
const router = useRouter();

const formattedLastUpdate = computed(() => {
  if (!project.startDate) return "Non défini";

  const date = new Date(project.startDate);
  if (isNaN(date.getTime())) return "Date invalide";

  return format(date, "dd MMMM yyyy", { locale: fr });
});

const calculateProgress = computed(() => {
  if (!project.projectStages || project.projectStages.length === 0) {
    return 0;
  }
  const completedStages = project.projectStages.filter(
    (stage) => stage.status === "TERMINE"
  ).length;
  return Math.round((completedStages / project.projectStages.length) * 100);
});

const goToProjectDetails = (id: number) => {
  console.log("Navigating to project ID:", id);
  // projectStore.setSelectedProjectToEdit(project);
  router.push(`/projects/${id}`);
};
</script>
