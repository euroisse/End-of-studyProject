<template>
     <div class="min-h-screen overflow-hidden flex bg-gray-50">
  <Sidebar />
  <!-- Main Content -->
  <main class="ml-64 flex-1">
    <NavigationTop />
    <div class="p-6">
        <slot/>
    </div>
</main>
    </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/dashboard/Sidebar.vue";
import NavigationTop from "~/components/dashboard/NavigationTop.vue";
</script>

<style scoped>

</style>