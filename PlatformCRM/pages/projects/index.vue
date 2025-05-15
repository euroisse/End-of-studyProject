<template>
  <div class="mx-auto p-4 md:p-6 lg:p-8">
    <ProjectsProjectHeader v-if="isAdmin" />

    <ProjectsProjectFilter
      :searchQuery="searchQuery"
      @update:searchQuery="searchQuery = $event"
      @toggleStatusFilter="showStatusFilter = !showStatusFilter"
      @toggleDateFilter="showDateFilter = !showDateFilter"
    />

    <div v-if="loading" class="text-center py-8">Chargement des projets...</div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
    >
      <ProjectsProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        :getStatusClass="getStatusClass"
      />
    </div>

    <div
      v-if="!loading && filteredProjects.length === 0"
      class="text-center text-gray-500 mt-4"
    >
      Aucun projet trouvé.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import type { Project, ProjectStatus } from "~/types";
definePageMeta({
  layout: "admin",
});

const { isAdmin } = useIsRole();
const searchQuery = ref("");
const showStatusFilter = ref(false);
const showDateFilter = ref(false);
const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref<any>(null);

onMounted(async () => {
  const userString = localStorage.getItem("user");
  if (!userString) {
    error.value = {
      message: "Utilisateur non connecté. Veuillez vous connecter.",
    };
    loading.value = false;
    return;
  }

  try {
    const user = JSON.parse(userString);
    const userId = user.id;
    const userRole = user.role;

    const data = await $fetch<Project[]>(
      userRole === "ADMIN" ? "/api/Projects" : `/api/Projects/user/${userId}`
    );

    projects.value = data;
    loading.value = false;
  } catch (err: any) {
    error.value = err;
    loading.value = false;
    console.error("Error fetching projects:", err);
  }
});

const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    const projectName = project.title || "";
    return projectName.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const getStatusClass = (status: ProjectStatus): string => {
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
};
</script>

<style scoped></style>
