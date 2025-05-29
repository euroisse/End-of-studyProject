<template>
  <div class="pt-4">
    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Poste
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="employees.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              Aucun employé trouvé.
            </td>
          </tr>
          <tr v-else v-for="employee in employees" :key="employee.id">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ employee.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.post || "N/A" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-4">
                <button
                  @click="viewEmployee(employee.id)"
                  class="text-green-600 hover:text-green-900"
                  title="Voir plus"
                >
                  <i class="ri-eye-line"></i>
                </button>
                <button
                  @click="editEmployee(employee.id)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Modifier"
                >
                  <i class="ri-pencil-line"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmployeeDisplayData } from "~/types";

defineProps<{
  employees: EmployeeDisplayData[];
}>();

const viewEmployee = (id: number) => {
  console.log("Voir l'employé avec l'ID :", id);
};

const editEmployee = (id: number) => {
  console.log("Modifier l'employé avec l'ID :", id);
};
</script>

<style scoped></style>
