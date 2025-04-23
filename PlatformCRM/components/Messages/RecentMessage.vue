<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Messages récents</h2>
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
defineProps<{
  messages: { sender: string; content: string; time: string }[];
}>();
</script>
