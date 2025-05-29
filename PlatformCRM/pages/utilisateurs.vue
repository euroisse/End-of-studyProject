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
              @click="() => setActiveTab('Clients')"
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
              @click="() => setActiveTab('Employees')"
              :class="[
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium focus:outline-none',
                activeTab === 'Employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              ]"
            >
              Employees
            </button>
          </nav>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Clients'">
      <ClientTable :contacts="clientContacts" />
    </div>

    <div v-if="activeTab === 'Employees'">
      <EmployeeTable :employees="employeeContacts" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ClientTable from "~/components/Clients/ClientTable.vue";
import type { Contact, Employees } from "~/types";

definePageMeta({
  layout: "admin",
});

const activeTab = ref("Clients");

const clientContacts = ref<Contact[]>([
  {
    id: "1",
    name: "Russell Powell",
    email: "russell.93@example.com",
    phoneNumber: "732-123-1235",
    company: "BigCorp Inc.",
  },
  {
    id: "2",
    name: "Louis Sanders",
    email: "louis.sanders@example.com",
    phoneNumber: "313-548-2489",
    company: "Innovate Solutions",
  },
  {
    id: "3",
    name: "Jordan Evans",
    email: "jordan.e@example.com",
    phoneNumber: "248-775-5441",
    company: "Global Dynamics",
  },
  {
    id: "4",
    name: "Billy Rogers",
    email: "billy.rogers@example.com",
    phoneNumber: "884-577-1428",
    company: "Quantum Systems",
  },
  {
    id: "5",
    name: "Helen Graham",
    email: "helen.g@example.com",
    phoneNumber: "732-123-1035",
    company: "Alpha Corp",
  },
  {
    id: "6",
    name: "Alice Gray",
    email: "alice.gray@example.com",
    phoneNumber: "313-548-2489",
    company: "Cybernetics Ltd.",
  },
]);
const employeeContacts = ref<Employees[]>([
  {
    id: "1",
    name: "Alice Johnson",
    post: "Software Engineer",
    project: "Project Alpha",
  },
  {
    id: " 2",
    name: "Bob Williams",
    post: "Project Manager",
    project: "Project Beta",
  },
  {
    id: "3",
    name: "Charlie Brown",
    post: "UX Designer",
    project: "Project Gamma",
  },
  {
    id: "4",
    name: "Diana Prince",
    post: "Data Analyst",
    project: "Project Alpha",
  },
  {
    id: "5",
    name: "Eve Adams",
    post: "HR Specialist",
    project: "Internal",
  },
]);

const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
};
</script>

<style scoped></style>
