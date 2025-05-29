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
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Contacts
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
          <tr v-if="clients.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Aucun client trouvé.
            </td>
          </tr>
          <tr v-else v-for="client in clients" :key="client.id">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ client.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ client.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ client.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ client.phoneNumber || "N/A" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-4">
                <button
                  @click="viewContact(client.id)"
                  class="text-green-600 hover:text-green-900"
                  title="Voir plus"
                >
                  <i class="ri-eye-line"></i>
                </button>
                <button
                  @click="editContact(client.id)"
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
import type { ClientDisplayData } from "~/types";

defineProps<{
  clients: ClientDisplayData[];
}>();

const viewContact = (id: number) => {
  console.log("Voir le contact avec l'ID :", id);
  navigateTo(`/clients/${id}`);
};

const editContact = (id: number) => {
  console.log("Modifier le contact avec l'ID :", id);
};
</script>

<style scoped></style>
