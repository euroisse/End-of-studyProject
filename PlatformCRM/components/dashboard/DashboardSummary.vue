<template>
  <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6 w-full">
    <CardSummary
      title="Projets"
      :value="counts.projectsInProgress"
      icon="ri-task-line"
      color="indigo"
    />

    <CardSummary
      v-if="isClient || isAdmin"
      title="Devis en attente"
      :value="counts.pendingQuotes"
      icon="ri-file-list-2-line"
      color="yellow"
    />

    <CardSummary
      v-if="isClient || isAdmin"
      title="Factures validées"
      :value="counts.validatedInvoices"
      icon="ri-check-line"
      color="green"
    />

    <CardSummary
      v-if="isEmploye || isAdmin"
      title="Tâches à faire"
      :value="counts.tasksToDo"
      icon="ri-clipboard-line"
      color="red"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CardSummary from "../Cards/CardSummary.vue";
import { useIsRole } from "#imports";

import { useProjectStore, useQuoteStore, useTaskStore } from "#imports";
import type { ProjectStageStatus } from "~/generated/prisma";

const projectStore = useProjectStore();
const quoteStore = useQuoteStore();
const taskStore = useTaskStore();
const ACTIVE_PROJECT_STAGE_STATUSES: ProjectStageStatus[] = [
  "EN_COURS",
  "A_VENIR",
  "EN_ATTENTE",
];
const counts = ref({
  projectsInProgress: 0,
  pendingQuotes: 0,
  validatedInvoices: 0,
  tasksToDo: 0,
});

const { isClient, isAdmin, isEmploye } = useIsRole();

const fetchDashboardCounts = async () => {
  const userString = localStorage.getItem("user");
  if (!userString) {
    console.warn(
      "Utilisateur non connecté. Impossible de récupérer les données du tableau de bord."
    );
    return;
  }

  try {
    const user = JSON.parse(userString);
    const userId = user.id;

    if (isClient.value) {
      await projectStore.fetchUserProjects(userId);
    } else {
      await projectStore.fetchProjects();

      counts.value.projectsInProgress = projectStore.projects.filter(
        (project) => {
          if (!project.projectStages || project.projectStages.length === 0) {
            return false;
          }

          return project.projectStages.some((stage) =>
            ACTIVE_PROJECT_STAGE_STATUSES.includes(stage.status)
          );
        }
      ).length;
    }

    if (isClient.value || isAdmin.value) {
      await quoteStore.fetchQuotesList();
      counts.value.pendingQuotes = quoteStore.quotesList.filter(
        (q) => q.status === "EN_ATTENTE"
      ).length;
    }

    let invoicesApiUrl = "";
    if (isAdmin.value) {
      invoicesApiUrl = `/api/invoices`;
    } else if (isClient.value) {
      invoicesApiUrl = `/api/invoices/user/${userId}`;
    }

    if (invoicesApiUrl) {
      const response = await $fetch<any>(invoicesApiUrl);
      const invoices = response.data || [];
      counts.value.validatedInvoices = invoices.filter(
        (inv: any) => inv.status === "VALIDATED"
      ).length;
    }

    if (isEmploye.value || isAdmin.value) {
      await taskStore.fetchTasks();

      if (isEmploye.value) {
        counts.value.tasksToDo = taskStore.tasks.filter(
          (task) => task.status === "A_FAIRE" && task.employeeId === userId
        ).length;
      } else {
        // Admin
        counts.value.tasksToDo = taskStore.tasks.filter(
          (task) => task.status === "A_FAIRE"
        ).length;
      }
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données du tableau de bord via les stores:",
      error
    );
  }
};

onMounted(() => {
  fetchDashboardCounts();
});
</script>
