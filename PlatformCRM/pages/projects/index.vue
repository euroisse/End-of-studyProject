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
      <div v-for="project in filteredProjects" :key="project.id">
        <ProjectsProjectCard :project="project" />
      </div>
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

definePageMeta({
  layout: "admin",
});

const { isAdmin } = useIsRole();
const searchQuery = ref("");
const showStatusFilter = ref(false);
const showDateFilter = ref(false);
const projectStore = useProjectStore();
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

    if (userRole === "ADMIN") {
      await projectStore.fetchProjects();
    } else {
      await projectStore.fetchUserProjects(userId);
    }
    loading.value = false;
  } catch (err: any) {
    error.value = err;
    loading.value = false;
    console.error("Erreur de recupera:", err);
  }
});

const filteredProjects = computed(() => {
  return projectStore.projects.filter((project) => {
    const projectName = project.title || "";
    return projectName.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});
</script>

<style scoped></style>
