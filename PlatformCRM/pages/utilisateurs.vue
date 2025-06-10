<template>
  <div class="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
    <div class="flex items-center justify-between border-gray-200 pb-3 mb-6">
      <div class="flex space-x-4 text-xl font-semibold text-gray-700">
        <span class="text-xl">Gestion des utilisateurs</span>
      </div>
    </div>
    <div class="flex gap-2 w-full px-3 border-b bg-white border-gray-200">
      <div class="flex items-center justify-between w-full">
        <div class="hidden sm:block">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="setActiveTab('Clients')"
              :class="[
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium focus:outline-none',
                activeTab === 'Clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              ]"
            >
              Clients
            </button>
            <button
              @click="setActiveTab('Employees')"
              :class="[
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium focus:outline-none',
                activeTab === 'Employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              ]"
            >
              Employés
            </button>
          </nav>
        </div>
      </div>
    </div>

    <div>
      <div v-if="activeTab === 'Clients'">
        <ClientTable
          :clients="clientDisplayData"
          @refresh-clients="fetchAndProcessUsers"
        />
      </div>

      <div v-if="activeTab === 'Employees'">
        <EmployeeTable
          :employees="employeeDisplayData"
          @refresh-employee="fetchAndProcessUsers"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ClientTable from "~/components/Clients/ClientTable.vue";
import EmployeeTable from "~/components/Employees/EmployeeTable.vue";
import type { UserData, ClientDisplayData, EmployeeDisplayData } from "~/types";

definePageMeta({
  layout: "admin",
});

const activeTab = ref("Clients");
const allUsers = ref<UserData[]>([]);
const clientDisplayData = ref<ClientDisplayData[]>([]);
const employeeDisplayData = ref<EmployeeDisplayData[]>([]);

const isLoading = ref(true);
const error = ref<any>(null);

const fetchAndProcessUsers = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const userString = localStorage.getItem("user");
    if (!userString) {
      error.value = {
        message: "Utilisateur non connecté. Veuillez vous connecter.",
      };
      isLoading.value = false;
      return;
    }

    const user = JSON.parse(userString);
    const userId = user.id;

    const data = await $fetch<UserData[]>("/api/users", {
      method: "POST",
      body: { userId: userId },
    });

    allUsers.value = data;
    console.log("All fetched users:", allUsers.value);

    // Filter and map client data
    clientDisplayData.value = allUsers.value
      .filter((user) => user.UserRole.some((ur) => ur.role.name === "customer"))
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.contacts || undefined,
        company: user.company || undefined,
      }));
    console.log("Client display data:", clientDisplayData.value);

    // Filter and map employee data
    employeeDisplayData.value = allUsers.value
      .filter((user) => user.UserRole.some((ur) => ur.role.name === "employee"))
      .map((user) => ({
        id: user.id,
        name: user.name,
        post: user.poste || undefined,
        project: "N/A",
      }));
    console.log("Employee display data:", employeeDisplayData.value);
  } catch (err: any) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAndProcessUsers();
});

const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
};
</script>

<style scoped></style>
