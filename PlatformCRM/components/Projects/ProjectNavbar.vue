<template>
  <div v-if="project">
    <div class="flex justify-between items-center mb-4">
      <div>
        <div class="flex justify-center items-center">
          <button
            @click="goBackToProjects"
            class="mr-3 text-gray-500 text-xl hover:text-gray-800 focus:outline-none"
          >
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <h1 class="text-2xl font-bold pb-2">{{ project.title }}</h1>
        </div>
        <div class="text-gray-600 items-center" v-if="project.customer">
          <p>Client: {{ project.customer.name }}</p>
        </div>
      </div>
      <div>
        <button
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center !rounded-button whitespace-nowrap"
          @click="handleEditProject"
        >
          <i class="ri-pencil-line mr-2"></i>
          Modifier le projet
        </button>
      </div>
      <!-- <p class="text-gray-600 mb-3" v-else>Client: Non défini</p> -->
    </div>
    <div class="flex flex-row">
      <div class="mb-3">
        <label
          for="date_debut"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Date début
        </label>
        <input
          id="date_debut"
          type="date"
          class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          :value="formatDate(project.startDate)"
          readonly
        />
        <label
          for="date_fin"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Date fin
        </label>
        <input
          id="date_fin"
          type="date"
          class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          :value="formatDate(project.endDate)"
          readonly
        />
      </div>
    </div>
  </div>

  <div v-else>Chargement de l'en-tête du projet...</div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "vue-router";
import type { ProjectWithProjectStages } from "~/types";

defineProps<{
  project: ProjectWithProjectStages | null;
}>();

const formatDate = (date?: Date | null): string => {
  if (date && date instanceof Date && !isNaN(date.getTime())) {
    try {
      return format(date, "yyyy-MM-dd", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "";
    }
  }
  return "";
};

const handleEditProject = () => {
  //  Implementer la logique pour modifier le projet
  console.log("Bouton Modifier le projet cliqué");
};

const router = useRouter();

const goBackToProjects = () => {
  router.push({ name: "projects" });
  console.log("Retour à la page des projets");
};
</script>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
