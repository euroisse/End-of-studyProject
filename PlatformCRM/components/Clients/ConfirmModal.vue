<template>
    <div v-if="visible" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ message }}</h3>
        <div class="flex justify-end space-x-3">
          <button @click="$emit('cancel')" class="px-4 py-2 border rounded-md">Annuler</button>
          <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded-md">Confirmer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    visible: Boolean,
    message: String
  });
  defineEmits(['confirm', 'cancel']);
  </script>
  