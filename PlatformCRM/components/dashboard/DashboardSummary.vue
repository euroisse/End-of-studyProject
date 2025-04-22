<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <CardSummary title="Projets en cours" value="12" icon="ri-task-line" color="indigo" />
      <CardSummary title="Devis en attente" value="5" icon="ri-file-list-2-line" color="yellow" />
      <CardSummary title="Factures validées" value="28" icon="ri-check-line" color="green" />
      <CardSummary title="Tâches à faire" value="15" icon="ri-clipboard-line" color="red" />
    </div>
  </template>
  
  <script setup lang="ts">
import CardSummary from '../Cards/CardSummary.vue';
  </script>
  