<template>
  <aside class="w-90 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">Messages</h1>
    </div>

    <div class="p-4 border-b border-gray-200">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher une conversation..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div
        v-for="conversation in filteredConversations"
        :key="conversation.id"
        :class="[
          'p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-100 flex items-center justify-between',
          { 'bg-blue-200': conversation.active },
        ]"
        @click="$emit('select', conversation.id)"
      >
        <div class="flex items-center flex-1">
          <div class="relative">
            <template v-if="conversation.avatar">
              <img :src="conversation.avatar" :alt="conversation.name" class="w-10 h-10 rounded-full object-cover" />
            </template>
            <template v-else>
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <i class="ri-user-line text-gray-500"></i>
              </div>
            </template>
            <span
              :class="[
                'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white',
                conversation.online ? 'bg-green-400' : 'bg-gray-300',
              ]"
            ></span>
          </div>
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900">{{ conversation.name }}</p>
              <p class="text-xs text-gray-500">{{ formatTime(conversation.timestamp) }}</p>
            </div>
            <p class="text-sm text-gray-600 truncate">{{ conversation.lastMessage }}</p>
          </div>
        </div>
        <button
          class="text-gray-400 hover:text-red-700 focus:outline-none"
          @click.stop="$emit('delete-conversation', conversation.id)"
        >
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Conversation } from '@/types';

const props = defineProps<{
  conversations: Conversation[];
}>();

defineEmits<{
  (e: 'select', id: number): void;
  (e: 'delete-conversation', id: number): void;
}>();

const searchQuery = ref('');

const filteredConversations = computed(() => {
  if (!searchQuery.value) {
    return props.conversations;
  }
  return props.conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, 'HH:mm', { locale: fr });
  } else if (isYesterday(date)) {
    return 'Hier';
  } else {
    return format(date, 'dd/MM', { locale: fr });
  }
};
</script>