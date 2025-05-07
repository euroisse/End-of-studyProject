<template>
  <div v-if="project">
    <div class="flex justify-between items-center mb-6">
      <div class="">
        <div class="flex items-center mb-6">
          <button
            @click="goBackToProjects"
            class="mr-3 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <h1 class="text-2xl font-bold">{{ project.title }}</h1>
        </div>

        <div>
          <p class="text-gray-600 mb-2" v-if="project.customer">
            Client: {{ project.customer.name }}
          </p>
          <p class="text-gray-600 mb-3" v-else>Client: Non défini</p>
          <div class="flex flex-row gap-3">
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
      </div>
      <div class="flex items-center space-x-4">
        <button
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center !rounded-button whitespace-nowrap"
          @click="handleEditProject"
        >
          <i class="ri-pencil-line mr-2"></i>
          Modifier le projet
        </button>
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

type ProjectStatus = "En_COURS" | "A_VENIR" | "TERMINE" | "EN_ATTENTE";

interface Project {
  id: number;
  title: string;
  status: ProjectStatus;
  customerId: number;
  customer?: {
    name: string;
  };
  startDate?: Date | null;
  endDate?: Date | null;
}

const props = defineProps<{
  project: Project | null;
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
