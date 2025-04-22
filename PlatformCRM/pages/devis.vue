<template>
  <div class="p-8 overflow-x-hidden">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des devis</h1>
      <div class="flex items-center space-x-4">
        <button
          @click="showCreateQuote = true"
          class="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap cursor-pointer !rounded-button"
        >
          <i class="ri-add-line mr-2"></i>
          Créer un devis
        </button>
      </div>
    </div>

    <QuotesQuoteList @preview="previewQuote" />
    <QuotesQuoteModal v-if="showCreateQuote" @close="showCreateQuote = false" />
    <PreviewQuoteModal
      v-if="showPreview"
      :quote="selectedQuote"
      @close="showPreview = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import PreviewQuoteModal from "~/components/quotes/PreviewQuoteModal.vue";

definePageMeta({
  layout: "admin",
});

const showCreateQuote = ref(false);
const showPreview = ref(false);
const selectedQuote = ref(null);

const previewQuote = (quote: any) => {
  selectedQuote.value = quote;
  showPreview.value = true;
};
</script>

<style scoped></style>
