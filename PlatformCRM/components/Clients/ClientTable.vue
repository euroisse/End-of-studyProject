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
          <tr v-for="contact in contacts" :key="contact.id">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ contact.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contact.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contact.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contact.phoneNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-4">
                <button
                  @click="viewContact(contact.id)"
                  class="text-green-600 hover:text-green-900"
                  title="Voir plus"
                >
                  <i class="ri-eye-line"></i>
                </button>
                <button
                  @click="editContact(contact.id)"
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
import type { Contact } from "~/types";

// Définition des props pour le composant ClientTable
defineProps<{
  contacts: Contact[];
}>();

const viewContact = (id: string) => {
  console.log("Voir le contact avec l'ID :", id);
};

const editContact = (id: string) => {
  console.log("Modifier le contact avec l'ID :", id);
};
</script>

<style scoped>
/* Pas de styles spécifiques ici car Tailwind gère la plupart du design */
</style>
