<template>
  <main class="bg-white w-full rounded-sm flex-1 p-8">
    <ProjectNavbar :project="project" v-if="project" />
    <ProjectTimeline :steps="projectStages" class="mb-8" v-if="projectStages" />
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
  </main>

  <!-- <div v-if="loadingProject" class="flex justify-center items-center h-screen">
    <template>
      <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <header class="bg-white dark:bg-gray-800 shadow">
          <div
            class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center"
          >
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Projet Refonte Site E-commerce
            </h1>
            <button
              @click="handleEditProject"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            >
              Modifier le projet
            </button>
          </div>
        </header>
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="md:grid md:grid-cols-1 md:gap-6">
            <div class="md:col-span-1">
              <div class="px-4 sm:px-0">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                  Étapes du projet
                </h2>
              </div>
            </div>
            <div class="md:col-span-2">
              <div
                class="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-md"
              >
                <ul
                  role="list"
                  class="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <li
                    v-for="(etape, index) in etapes"
                    :key="index"
                    class="py-4 flex items-start gap-4 px-4 sm:px-6"
                  >
                    <div
                      :class="[
                        'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10',
                        etape.status === 'Terminé'
                          ? 'bg-green-500'
                          : etape.status === 'En cours'
                          ? 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-700',
                      ]"
                    >
                      <i
                        :class="getIconClass(etape.status) + ' text-white'"
                      ></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ etape.titre }}
                      </div>
                      <p class="text-sm text-gray-900 dark:text-gray-400">
                        {{ etape.description }}
                      </p>
                      <p
                        v-if="etape.dateLivraison"
                        class="text-sm text-gray-500 dark:text-gray-400"
                      >
                        Date de livraison estimée : {{ etape.dateLivraison }}
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          etape.status === 'Terminé'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : etape.status === 'En cours'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
                        ]"
                      >
                        {{ etape.status }}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </template>
  </div> -->
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
</template>

<script setup lang="ts">
import ProjectNavbar from "~/components/Projects/ProjectNavbar.vue";
import ProjectTimeline from "~/components/Projects/ProjectTimeline.vue";
import type { ProjectStage, Project } from "~/generated/prisma";
import type { ProjectWithProjectStages } from "~/types";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AddModal from "./ProjectStage/AddModal.vue";

definePageMeta({ layout: "admin" });
const showCreateStageProject = ref(false);

const route = useRoute();
const projectId = computed(() => Number(route.params.id) ?? null);
const project = ref<ProjectWithProjectStages | null>(null);
const projectStages = ref<ProjectStage[]>();

function openModal() {
  showCreateStageProject.value = true;
}

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    try {
      const projectData = await $fetch<Project>(`/api/Projects/${Number(id)}`);
      console.log("get project data", projectData);

      projectStages.value = projectData.projectStages || [];
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des détails du projet:",
        err
      );
      projectStages.value = [];
    }
  }
});

const stageAdded = async (newStage: ProjectStage) => {
  if (projectId.value) {
    try {
      const stagesData = await $fetch<ProjectStage[]>(
        `/api/Projects/${projectId.value}`
      );
      projectStages.value = stagesData;
    } catch (err) {
      console.error("Erreur lors de la récupération des étapes :", err);
    }
  }
};

// interface Etape {
//   titre: string;
//   description: string;
//   status: "Terminé" | "En cours" | "À venir" | "En attente";
//   dateLivraison?: string;
// }

// const etapes = ref<Etape[]>([
//   {
//     titre: "Analyse des besoins",
//     description:
//       "Définition des objectifs et analyse détaillée des besoins du client",
//     status: "Terminé",
//     dateLivraison: "15/03/2025",
//   },
//   {
//     titre: "Design UX/UI",
//     description: "Création des maquettes et validation du design",
//     status: "Terminé",
//     dateLivraison: "01/04/2025",
//   },
//   {
//     titre: "Développement Frontend",
//     description:
//       "Intégration des maquettes et développement des fonctionnalités",
//     status: "En cours",
//     dateLivraison: "15/04/2025",
//   },
//   {
//     titre: "Tests et Validation",
//     description: "Tests fonctionnels et corrections des bugs",
//     status: "À venir",
//     dateLivraison: "10/05/2025",
//   },
//   {
//     titre: "Mise en production",
//     description: "Déploiement et formation des utilisateurs",
//     status: "À venir",
//     dateLivraison: "25/05/2025",
//   },
// ]);

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

// const getIconClass = (status: Etape["status"]): string => {
//   switch (status) {
//     case "Terminé":
//       return "ri-checkbox-circle-fill";
//     case "En cours":
//       return "ri-code-fill";
//     case "À venir":
//       return "ri-time-line";
//     case "En attente":
//       return "ri-pause-circle-line";
//     default:
//       return "ri-question-line";
//   }
// };
</script>
