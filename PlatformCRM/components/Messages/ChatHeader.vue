<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center px-6">
    <div class="flex items-center">
      <template v-if="conversation?.avatar">
        <img
          :src="conversation.avatar"
          :alt="conversation.name"
          class="w-10 h-10 rounded-full object-cover"
        />
      </template>
      <template v-else>
        <div
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <i class="ri-user-line text-gray-500"></i>
        </div>
      </template>
      <div class="ml-3">
        <h2 class="text-lg font-medium text-gray-900">
          {{ conversation?.name }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ conversation?.online ? "En ligne" : "Hors ligne" }}
        </p>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import type { Conversation } from "@/types";

defineProps<{
  conversation?: Conversation;
}>();
</script>
