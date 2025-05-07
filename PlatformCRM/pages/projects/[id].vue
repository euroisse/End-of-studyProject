// Voici le code corrigé pour la page de détail du projet (paste-4.txt)

<template>
  <main class="pt-10">
    <ProjectNavbar :project="project" v-if="project" />
    <ProjectTimeline
      :steps="projectStages"
      class="mb-8 bg-white w-full rounded-sm flex-1 p-8"
      v-if="projectStages && projectStages.length > 0"
    />
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
    <div>
      <div class="mt-8">
        <button
          @click="openModal"
          class="w-full flex items-center justify-center py-6 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-md border border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <i class="ri-add-line mr-1"></i>
          Ajouter une étape
        </button>
      </div>
    </div>
    <AddModal
      v-if="showCreateStageProject"
      @close="showCreateStageProject = false"
      @stageAdded="stageAdded"
    />
  </main>
</template>

<script setup lang="ts">
import ProjectNavbar from "~/components/Projects/ProjectNavbar.vue";
import ProjectTimeline from "~/components/Projects/ProjectTimeline.vue";
import type { ProjectStage, Project } from "~/generated/prisma";
import type { ProjectWithProjectStages } from "~/types";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AddModal from "./ProjectStage/AddModal.vue";

definePageMeta({ layout: "admin" });
const showCreateStageProject = ref(false);

const route = useRoute();
const projectId = computed(() => Number(route.params.id) ?? null);
const project = ref<ProjectWithProjectStages | null>(null);
const projectStages = ref<ProjectStage[]>([]);

function openModal() {
  showCreateStageProject.value = true;
}

// Fonction pour charger les données du projet
const loadProjectData = async () => {
  if (!projectId.value) return;

  try {
    const projectData = await $fetch<ProjectWithProjectStages>(
      `/api/Projects/${projectId.value}`
    );
    console.log("get project data", projectData);

    project.value = projectData;
    projectStages.value = projectData.projectStages || [];
  } catch (err) {
    console.error("Erreur lors de la récupération des détails du projet:", err);
    project.value = null;
    projectStages.value = [];
  }
};

onMounted(() => {
  loadProjectData();
});

const stageAdded = async (newStage: ProjectStage) => {
  await loadProjectData();
};

const formatDate = (date?: Date): string => {
  if (date) {
    try {
      return format(date, "yyyy-MM-dd", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "";
    }
  }
  return "";
};
</script>
