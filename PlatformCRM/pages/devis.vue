<template>
  <div class="p-8 overflow-x-hidden container">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isAdmin ? "Gestion des devis" : "Mes devis" }}
      </h1>
      <div v-if="isAdmin">
        <button
          @click="showCreateQuote = true"
          class="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <i class="ri-add-line mr-2"></i> Créer un devis
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

<script setup lang="ts">
import { ref } from "vue";
import PreviewQuoteModal from "~/components/quotes/PreviewQuoteModal.vue";
import QuotesQuoteList from "~/components/quotes/QuoteList.vue";

definePageMeta({ layout: "admin" });

const { isAdmin } = useIsRole();

const showCreateQuote = ref(false);
const showPreview = ref(false);
const selectedQuote = ref(null);

const previewQuote = (quote: any) => {
  selectedQuote.value = quote;
  showPreview.value = true;
};
</script>
