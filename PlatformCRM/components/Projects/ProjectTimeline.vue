<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold mb-6">Étapes du projet</h2>
    <div class="relative">
      <div
        class="absolute top-5 left-5 h-[calc(100%-40px)] w-0.5 bg-gray-200"
      ></div>
      <div class="space-y-8">
        <div v-for="(step, index) in steps" :key="index" class="relative flex">
          <div
            :class="`w-10 h-10 rounded-full flex items-center justify-center z-10
                ${
                  step.status === 'TERMINE'
                    ? 'bg-green-500'
                    : step.status === 'EN_COURS'
                    ? 'bg-indigo-500'
                    : 'bg-gray-200'
                }`"
          >
            <i :class="` ${getIconClass(step.status)} text-white`"></i>
          </div>
          <div
            class="ml-8 bg-gray-50 shadow-sm md:p-6 hover:shadow-md transition-shadow rounded-lg p-4 flex-1"
          >
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-medium">{{ step.name }}</h3>
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
            <h3 class="font-medium">{{ step.description }}</h3>
            <!-- <p class="text-sm text-gray-500">Date de livraison estimée: {{ step.endDate }}</p> */ -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div v-else>
      Chargement des étapes du projet...
    </div> -->
</template>

<script setup lang="ts">
import { defineProps } from "vue";

interface ProjectStage {
  id: number;
  name: string;
  description: string;
  status: "TERMINE" | "EN_COURS" | "A_VENIR" | "EN_ATTENTE";
  // order: number;
}
[];

defineProps<{
  steps: ProjectStage[] | null;
}>();

const getStatusText = (status: ProjectStage["status"]): string => {
  switch (status) {
    case "TERMINE":
      return "Terminé";
    case "EN_COURS":
      return "En cours";
    case "A_VENIR":
      return "À venir";
    case "EN_ATTENTE":
      return "En attente";
    default:
      return "Inconnu";
  }
};

const getIconClass = (status: ProjectStage["status"]): string => {
  switch (status) {
    case "TERMINE":
      return "ri-checkbox-circle-fill";
    case "EN_COURS":
      return "ri-code-fill";
    case "A_VENIR":
      return "ri-time-line";
    case "EN_ATTENTE":
      return "ri-pause-circle-line";
    default:
      return "ri-question-line";
  }
};
</script>
