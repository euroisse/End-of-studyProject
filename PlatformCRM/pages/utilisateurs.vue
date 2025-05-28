<template>
  <div v-if="isAdmin" class="min-h-screen bg-gray-50 flex"></div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});
const { isAdmin } = useIsRole();
</script>
