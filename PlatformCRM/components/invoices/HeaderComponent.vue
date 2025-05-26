<template>
  <header class="bg-white shadow-sm">
    <div
      class="max-w-7xl mx-auto px-4 py-6 flex flex-wrap justify-between items-center"
    >
      <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
    </div>
  </header>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "Gestion des factures",
  },
});
</script>
