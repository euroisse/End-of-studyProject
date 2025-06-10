<template>
  <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <div
      class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-500 text-sm font-medium">
          <span v-if="isAdmin">Total Projets</span>
          <span v-else-if="isEmploye">Projets attribués</span>
          <span v-else-if="isClient">Vos Projets</span>
        </h3>
        <p class="text-2xl font-bold text-gray-800">
          <span v-if="isAdmin">{{ summaryData?.totalProjects || 0 }}</span>
          <span v-else-if="isEmploye">{{
            summaryData?.assignedProjectsCount || 0
          }}</span>
          <span v-else-if="isClient">{{
            summaryData?.yourProjectsCount || 0
          }}</span>
          <span v-else>0</span>
        </p>
      </div>
      <i
        class="ri-folders-line text-indigo-500 text-4xl w-16 h-16 justify-center text-center pt-3 rounded-full bg-indigo-50"
      ></i>
    </div>

    <div
      v-if="isEmploye"
      class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-500 text-sm font-medium">Tâches attribuées</h3>
        <p class="text-2xl font-bold text-gray-800">
          {{ summaryData?.assignedTasksCount || 0 }}
        </p>
      </div>
      <i
        class="ri-task-line text-orange-500 text-4xl w-16 h-16 justify-center text-center pt-3 rounded-full bg-orange-50"
      ></i>
    </div>

    <div
      v-if="isClient || isAdmin"
      class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-500 text-sm font-medium">
          <span v-if="isAdmin">Total Factures</span>
          <span v-else-if="isClient">Vos Devis</span>
        </h3>
        <p class="text-2xl font-bold text-gray-800">
          <span v-if="isAdmin">{{ summaryData?.totalInvoices || 0 }}</span>
          <span v-else-if="isClient">{{
            summaryData?.yourQuotesCount || 0
          }}</span>
          <span v-else>0</span>
        </p>
      </div>
      <i
        class="ri-bill-line text-green-500 text-4xl w-16 h-16 justify-center text-center pt-3 rounded-full bg-green-50"
      ></i>
    </div>

    <div
      v-if="isAdmin"
      class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-500 text-sm font-medium">Total Devis</h3>
        <p class="text-2xl font-bold text-gray-800">
          {{ summaryData?.totalQuotes || 0 }}
        </p>
      </div>
      <i
        class="ri-file-text-line text-yellow-500 text-4xl w-16 h-16 justify-center text-center pt-3 rounded-full bg-yellow-50"
      ></i>
    </div>

    <div
      v-if="isClient"
      class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-500 text-sm font-medium">Vos Factures</h3>
        <p class="text-2xl font-bold text-gray-800">
          {{ summaryData?.yourInvoicesCount || 0 }}
        </p>
      </div>
      <i
        class="ri-money-euro-box-line text-purple-500 text-4xl w-16 h-16 justify-center text-center pt-3 rounded-full bg-purple-50"
      ></i>
    </div>

    <div
      v-if="isAdmin"
      class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-500 text-sm font-medium">Clients total</h3>
        <p class="text-2xl font-bold text-gray-800">
          {{ summaryData?.totalClients || 0 }}
        </p>
      </div>
      <i
        class="ri-group-line text-purple-500 text-4xl w-16 h-16 justify-center text-center pt-3 rounded-full bg-purple-50"
      ></i>
    </div>

    <div
      v-if="isAdmin"
      class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-500 text-sm font-medium">Employés total</h3>
        <p class="text-2xl font-bold text-gray-800">
          {{ summaryData?.totalEmployees || 0 }}
        </p>
      </div>
      <i
        class="ri-user-2-line text-blue-500 text-4xl w-16 h-16 justify-center text-center pt-3 rounded-full bg-blue-50"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAdmin, isClient, isEmploye } = useIsRole();
defineProps<{
  summaryData?: {
    totalProjects?: number;
    totalInvoices?: number;
    totalClients?: number;
    totalEmployees?: number;
    assignedProjectsCount?: number;
    yourProjectsCount?: number;
    yourInvoicesCount?: number;
    yourQuotesCount?: number;
    assignedTasksCount?: number;
    totalQuotes?: number;
  };
}>();
</script>

<style scoped></style>
