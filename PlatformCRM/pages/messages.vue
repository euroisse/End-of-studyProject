<template>
  <div class="max-w-3xl mx-auto py-10">
    <h1 class="text-2xl font-bold mb-6">Messagerie</h1>
    <div v-if="messages.length === 0" class="text-gray-500">
      Aucun message pour le moment.
    </div>
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="mb-6 p-4 bg-white rounded shadow"
    >
      <div class="font-semibold text-indigo-700">
        {{ msg.name }}
      </div>
      <div class="font-semibold text-indigo-700">
        {{ msg.email }}
      </div>
      <div class="text-sm text-gray-500 mb-2">
        {{ msg.subject }} —
        {{
          format(new Date(msg.createdAt), "dd MMMM yyyy à HH:mm", {
            locale: fr,
          })
        }}
      </div>
      <div class="text-gray-800">{{ msg.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
definePageMeta({ layout: "admin" });
const messages = ref<any[]>([]);

onMounted(async () => {
  messages.value = await $fetch("/api/messages", { method: "GET" });
  // Marquer tous les messages comme lus
  if (messages.value.length > 0) {
    await $fetch("/api/messages/mark-read", { method: "POST" });
  }
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.relative:hover button {
  display: block !important;
}
.absolute button {
  display: none;
}
</style>
