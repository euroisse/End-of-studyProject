<template>
  <div class="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-12">
    <div class="max-w-full w-full mx-auto">
      <h1 class="text-2xl font-bold mb-6">Message de contacts</h1>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ContactMessage } from "~/types";
definePageMeta({ layout: "admin" });
const messages = ref<any[]>([]);

onMounted(async () => {
  messages.value = await $fetch<ContactMessage[]>("/api/messages", {
    method: "GET",
  });
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
