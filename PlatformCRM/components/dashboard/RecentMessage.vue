<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">Messages récents</h2>
      <Button
        content="Voir tout"
        customClass="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
      />
    </div>
    <ul class="divide-y divide-gray-200">
      <li
        v-for="(message, index) in messages"
        :key="index"
        class="py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer"
      >
        <i class="ri-user-3-line text-xl text-indigo-500"></i>
        <div>
          <p class="text-gray-800 font-semibold">{{ message.sender }}</p>
          <p class="text-sm text-gray-600">{{ message.content }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ message.time }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Button from "../iu/Button.vue";
defineProps<{
  messages: { sender: string; content: string; time: string }[];
}>();
</script>

<style scoped></style>
