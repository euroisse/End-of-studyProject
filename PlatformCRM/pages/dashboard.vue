<template>
  <div class="flex-1 p-4 md:p-8 lg:p-12 xl:p-16">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
    <DashboardHeader v-if="isAdmin" />
    <DashboardSummary v-if="isEmploye || isClient" />

    <div v-if="isEmploye">
      <ProjectProgress :projects="projectStore.projects" class="mb-6" />
    </div>

    <div v-else>
      <ClientProjectProgress class="mb-6" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InvoiceList :invoices="invoices" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DashboardHeader from "~/components/dashboard/DashboardHeader.vue";
import DashboardSummary from "~/components/dashboard/DashboardSummary.vue";
import ProjectProgress from "~/components/dashboard/ProjectProgress.vue";
import InvoiceList from "~/components/dashboard/InvoiceList.vue";
import ClientProjectProgress from "~/components/dashboard/ClientProjectProgress.vue";
import { useProjectStore } from "#imports";

definePageMeta({ layout: "admin" });
const { isEmploye, isAdmin, isClient } = useIsRole();

const projectStore = useProjectStore();

const invoices = ref<
  {
    id: number;
    invoiceNumber: string;
    invoiceDate: string | Date;
    totalAmount: number;
  }[]
>([]);

onMounted(async () => {
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
    if (isEmploye.value || isClient.value) {
      await projectStore.fetchUserProjects(userId);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données du tableau de bord:",
      error
    );
  }
});
</script>

<style scoped></style>
