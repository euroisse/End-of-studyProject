<template>
  <div class="flex-1 p-4 md:p-8 lg:p-12 xl:p-16">
    <h1
      v-if="isEmploye || isClient"
      class="text-2xl font-bold text-gray-800 mb-2"
    >
      Tableau de bord
    </h1>
    <DashboardHeader v-if="isAdmin" />
    <DashboardSummary
      v-if="isEmploye || isClient || isAdmin"
      :summaryData="dashboardData?.summary"
    />

    <div v-if="loading" class="text-center py-8">
      Chargement du tableau de bord...
    </div>
    <div v-else-if="error" class="text-red-600 text-center py-8">
      Erreur lors du chargement du tableau de bord: {{ error.message || error }}
    </div>
    <div v-else>
      <div v-if="isEmploye">
        <ProjectProgress
          :projects="dashboardData?.projects || []"
          class="mb-6"
        />
      </div>

      <div v-else-if="isClient">
        <ClientProjectProgress
          :projects="dashboardData?.projects || []"
          class="mb-6"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InvoiceList :invoices="dashboardData?.invoices || []" />
        </div>
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
interface DashboardApiResponse {
  statusCode: number;
  data: {
    projects?: any[];
    summary?: {
      assignedProjectsCount?: number;
      yourProjectsCount?: number;
      yourInvoicesCount?: number;
      totalProjects?: number;
      totalInvoices?: number;
      totalClients?: number;
      totalEmployees?: number;
    };
    invoices?: any[];
  };
}
const projectStore = useProjectStore();
const dashboardData = ref<DashboardApiResponse["data"] | null>(null);
const loading = ref(true);
const error = ref<any>(null);

onMounted(async () => {
  const userString = localStorage.getItem("user");
  if (!userString) {
    console.warn(
      "Utilisateur non connecté. Impossible de récupérer les données du tableau de bord."
    );
    error.value = { message: "Utilisateur non connecté." };
    loading.value = false;
    return;
  }
  try {
    const user = JSON.parse(userString);
    const userId = user.id;

    const response = await $fetch<DashboardApiResponse>(
      `/api/dashboard?userId=${userId}`
    );

    dashboardData.value = response.data;

    if ((isEmploye.value || isClient.value) && dashboardData.value?.projects) {
      projectStore.fetchUserProjects(userId);
    }
  } catch (err: any) {
    console.error(
      "Erreur lors de la récupération des données du tableau de bord:",
      err
    );
    error.value = err.data?.statusMessage || err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
