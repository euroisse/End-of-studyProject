<template>
  <div class="mx-auto p-4 md:p-6 lg:p-8">
    <ProjectsProjectHeader v-if="isEmploye" />

    <ProjectsProjectFilter
      :searchQuery="searchQuery"
      @update:searchQuery="searchQuery = $event"
      @toggleStatusFilter="showStatusFilter = !showStatusFilter"
      @toggleDateFilter="showDateFilter = !showDateFilter"
    />

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
    >
      <ProjectsProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        :getStatusClass="getStatusClass"
        :formatDate="formatDate"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
definePageMeta({
  layout: "admin",
});

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  progress: number;
  lastUpdate: Date;
}
const { isEmploye } = useIsRole();
const searchQuery = ref("");
const showStatusFilter = ref(false);
const showDateFilter = ref(false);

const projects = ref<Project[]>([
  {
    id: 1,
    name: "Refonte Site E-commerce",
    client: "BankSecure",
    status: "En cours",
    progress: 75,
    lastUpdate: new Date("2025-04-10"),
  },
  {
    id: 2,
    name: "Application Mobile",
    client: "BankSecure",
    status: "En attente",
    progress: 30,
    lastUpdate: new Date("2025-04-12"),
  },
  {
    id: 3,
    name: "Campagne Marketing",
    client: "BankSecure",
    status: "Terminé",
    progress: 100,
    lastUpdate: new Date("2025-04-14"),
  },
  {
    id: 4,
    name: "Intégration CRM",
    client: "BankSecure",
    status: "En cours",
    progress: 60,
    lastUpdate: new Date("2025-04-15"),
  },
  {
    id: 5,
    name: "Optimisation SEO",
    client: "BankSecure",
    status: "En attente",
    progress: 15,
    lastUpdate: new Date("2025-04-13"),
  },
  {
    id: 6,
    name: "Refonte UX/UI",
    client: "BankSecure",
    status: "En cours",
    progress: 45,
    lastUpdate: new Date("2025-04-11"),
  },
]);

const filteredProjects = computed(() => {
  return projects.value.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getStatusClass = (status: string): string => {
  switch (status) {
    case "En cours":
      return "bg-blue-100 text-blue-800";
    case "En attente":
      return "bg-yellow-100 text-yellow-800";
    case "Terminé":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: fr });
};
</script>

<style scoped></style>
