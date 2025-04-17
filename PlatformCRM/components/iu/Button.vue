<template>
    <div>
    <button
      :class="[
        'px-4 py-2 rounded-lg shadow-md transition-all',
        customClass,
      ]"
    >
      {{ content }}
    </button>
</div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    content: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      default: '',
    },
  });
  </script>
  