<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500">{{ title }}</p>
        <h3 class="text-2xl font-bold text-gray-800">{{ value }}</h3>
      </div>
      <div
        :class="`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`"
      >
        <i :class="`ri ${icon} text-${color}-600 text-xl`"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
}>();
</script>
