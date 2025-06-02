<template>
  <div class="grid grid-cols-1 md:grid-cols-1 gap-10 mb-6 w-full">
    <CardSummary
      title="Projets en cours"
      value="12"
      icon="ri-task-line"
      color="indigo"
    />
    <CardSummary
      v-if="isClient"
      title="Devis en attente"
      value="5"
      icon="ri-file-list-2-line"
      color="yellow"
    />
    <CardSummary
      v-if="isClient"
      title="Factures validées"
      value="28"
      icon="ri-check-line"
      color="green"
    />
    <CardSummary
      title="Tâches à faire"
      value="15"
      icon="ri-clipboard-line"
      color="red"
    />
  </div>
</template>

<script setup lang="ts">
const { isClient } = useIsRole();
import CardSummary from "../Cards/CardSummary.vue";
</script>
