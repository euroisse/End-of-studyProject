<template>
  <main class="pt-10">
    <ProjectNavbar :project="project" v-if="project" />
    <div
      v-else
      class="text-center py-8 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Projet non trouvé
      </h2>
      <p class="text-gray-500 dark:text-gray-400">
        Aucun projet ne correspond à l'identifiant spécifié. Veuillez essayer
        avec un autre projet.
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/projects"
          class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-colors duration-300"
        >
          Retourner à la liste des projets
        </NuxtLink>
      </div>
    </div>
    <div></div>
    <AddModal
      v-if="showCreateStageProject"
      @close="showCreateStageProject = false"
      @stageAdded="stageAdded"
    />
  </main>
</template>

<script setup lang="ts">
import ProjectNavbar from "~/components/Projects/ProjectNavbar.vue";
import type { ProjectStage } from "~/generated/prisma";

import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

import AddModal from "./ProjectStage/AddModal.vue";
import { useProjectStore } from "~/stores/projectStore";
definePageMeta({ layout: "admin" });
const showCreateStageProject = ref(false);
const projectStore = useProjectStore();

const route = useRoute();
const projectId = computed(() => Number(route.params.id) ?? null);
const project = computed(() => projectStore.selectedProject);

// Fonction pour charger les données du projet
onMounted(async () => {
  if (!projectId.value) return;

  try {
    await projectStore.fetchProject(projectId.value);
  } catch (err) {
    console.error("Erreur lors de la récupération des détails du projet:", err);
  }
});
const stageAdded = async (newStage: ProjectStage) => {
  showCreateStageProject.value = false;
};

// const formatDate = (date?: Date): string => {
//   if (date) {
//     try {
//       return format(date, "yyyy-MM-dd", { locale: fr });
//     } catch (error) {
//       console.error("Erreur de formatage de date:", error);
//       return "";
//     }
//   }
//   return "";
// };
</script>
