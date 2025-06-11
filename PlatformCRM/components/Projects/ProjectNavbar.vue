<template>
  <div v-if="project">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <!-- Bloc gauche : icône + infos projet -->
        <div class="flex items-start">
          <button
            @click="goBackToProjects"
            class="mr-4 mt-1 text-gray-500 text-xl hover:text-gray-800 focus:outline-none"
            title="Retour aux projets"
          >
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold mb-1">{{ project.title }}</h1>
            <div class="flex flex-col gap-1">
              <div class="text-gray-600" v-if="project.customer">
                <span class="font-medium">Client :</span>
                <span class="ml-1 font-semibold text-indigo-700">{{
                  project.customer.name
                }}</span>
              </div>
              <div class="text-gray-600">
                <span class="font-medium">Date de début :</span>
                <span class="ml-1">{{
                  formatDateDisplay(project.startDate)
                }}</span>
              </div>
              <div class="text-gray-600">
                <span class="font-medium">Date de fin :</span>
                <span class="ml-1">{{
                  formatDateDisplay(project.endDate)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Bouton modifier -->
        <button
          v-if="isAdmin && activeTab === 'apercu'"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center !rounded-button whitespace-nowrap"
          @click="openEditModal"
        >
          <i class="ri-pencil-line mr-2"></i>
          Modifier le projet
        </button>
      </div>

      <!-- NAVIGATION TABS (inchangé) -->
      <div
        class="flex gap-2 w-full px-3 pt-3 border-b shadow-sm bg-white border-gray-200"
      >
        <div class="flex items-center justify-between w-full">
          <div class="hidden sm:block">
            <nav class="-mb-px flex space-x-8">
              <button
                @click="() => setActiveTab('apercu')"
                :class="[
                  'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium focus:outline-none',
                  activeTab === 'apercu'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                ]"
              >
                Aperçu
              </button>
              <button
                @click="() => setActiveTab('taches')"
                :class="[
                  'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium focus:outline-none',
                  activeTab === 'taches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                ]"
              >
                Tâches
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'apercu'">
      <ProjectsProjectTimeline />
    </div>

    <div v-if="activeTab === 'taches'">
      <ProjecTasks :projectId="project.id" />
    </div>

    <ProjectEditModal
      :showModal="showEditModal"
      @close="showEditModal = false"
      @project-updated="onProjectUpdated"
      :projectToEdit="project"
    />
  </div>
</template>

<script setup lang="ts">
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

import ProjectEditModal from "~/components/ProjectModal/ProjectEditModal.vue";
import ProjecTasks from "./ProjecTasks.vue";
const { isAdmin } = useIsRole();
const showEditModal = ref(false);
console.log(showEditModal.value);
const activeTab = ref("apercu");

const emit = defineEmits(["project-updated"]);
const projectStore = useProjectStore();
const project = computed(() => projectStore.selectedProject);

const formatDateDisplay = (dateString?: string | Date | null): string => {
  if (!dateString) return "Non défini";

  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;

    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, "dd MMMM yyyy", { locale: fr });
    }
    return "Date invalide";
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return "Date invalide";
  }
};

function openEditModal() {
  projectStore.setSelectedProjectToEdit(project.value);
  showEditModal.value = true;
}

const onProjectUpdated = async () => {
  showEditModal.value = false;
};

const router = useRouter();

const goBackToProjects = () => {
  router.push({ name: "projects" });
  console.log("Retour à la page des projets");
};

const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
};
</script>

<style scoped></style>
