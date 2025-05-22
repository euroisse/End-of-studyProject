<template>
  <div
    v-if="true"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
      <div class="flex justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800">
          Confirmer la suppression
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
      <p class="text-gray-700 mb-6">
        Êtes-vous sûr de vouloir supprimer le devis
        <span class="font-semibold">{{ quoteToDelete?.number }}</span> ? Cette
        action est irréversible.
      </p>
      <div class="flex justify-end space-x-4">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="executeDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from "~/stores/quoteStore";
import type { quote } from "~/types";
const props = defineProps<{
  quoteItem: quote | null;
}>();
const quoteToDelete = computed(() => props.quoteItem);
const quoteStore = useQuoteStore();
const emit = defineEmits(["close", "success"]);
const executeDelete = async () => {
  if (props.quoteItem) {
    try {
      await quoteStore.deleteQuote(props.quoteItem.id);
    } catch (error) {
      console.error("Erreur lors de la suppression du devis :", error);
      alert("Une erreur est survenue lors de la suppression du devis.");
    } finally {
      emit("close");
    }
  }
};
</script>

<style scoped></style>
