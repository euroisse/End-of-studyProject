<template>
  <div v-if="isClient">
    <ProjectProgress />
    <div class="flex flex-col xl:flex-row gap-6 xl:gap-10 mt-6">
      <!-- Recent Messages -->
      <div class="bg-white rounded-lg shadow-sm p-6 w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="xl:text-xl font-bold text-base">Messages récents</h2>
          <Button
            content="Voir tout"
            customClass="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
          />
        </div>

        <div class="space-y-4">
          <div class="flex items-start p-4 bg-gray-50 rounded-lg">
            <div
              class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4"
            >
              <i class="ri-user-line text-indigo-600"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-medium">Sophie Martin</h4>
                <span class="text-sm text-gray-500">Il y a 2h</span>
              </div>
              <p class="text-gray-600 text-sm">
                Les maquettes sont prêtes pour validation. Pouvez-vous les
                examiner ?
              </p>
            </div>
          </div>

          <div class="flex items-start p-4 bg-gray-50 rounded-lg">
            <div
              class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4"
            >
              <i class="ri-user-line text-indigo-600"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-medium">Thomas Dubois</h4>
                <span class="text-sm text-gray-500">Hier</span>
              </div>
              <p class="text-gray-600 text-sm">
                Point d'étape sur le développement prévu demain à 14h.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices -->
      <div class="bg-white rounded-lg shadow-sm p-6 w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold md:text-base">Factures</h2>
          <Button
            content="Voir tout"
            customClass="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
          />
        </div>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <i class="ri-bill-line text-indigo-600 mr-4"></i>
              <div>
                <h4 class="font-medium">Facture #2025-04</h4>
                <p class="text-sm text-gray-500">Échéance: 25/04/2025</p>
              </div>
            </div>
            <div class="flex items-center">
              <span
                class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium"
                >Payée</span
              >
              <span class="ml-4 font-medium">2 500 €</span>
            </div>
          </div>

          <div
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <i class="ri-bill-line text-indigo-600 mr-4"></i>
              <div>
                <h4 class="font-medium">Facture #2025-03</h4>
                <p class="text-sm text-gray-500">Échéance: 11/04/2025</p>
              </div>
            </div>
            <div class="flex items-center">
              <span
                class="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium"
                >En attente</span
              >
              <span class="ml-4 font-medium">1 800 €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useIsRole } from "#imports";
import Button from "~/components/iu/Button.vue";
import ProjectProgress from "~/components/Projects/ProjectProgress.vue";

definePageMeta({
  layout: "admin",
});

const { isClient } = useIsRole();
</script>

<style scoped></style>
