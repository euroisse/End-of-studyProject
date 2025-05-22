<template>
  <div class="p-8 overflow-x-hidden">
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

    <QuotesQuoteList ref="quoteListRef" @preview="previewQuote" />

    <quoteModal v-if="showCreateQuote" @close="handleQuoteModalClose" />
    <PreviewQuoteModal
      v-if="showPreview && selectedQuote"
      :quoteId="selectedQuote.id"
      @close="showPreview = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PreviewQuoteModal from "~/components/quotes/PreviewQuoteModal.vue";
import QuotesQuoteList from "~/components/quotes/QuoteList.vue";
import QuoteModal from "~/components/quotes/QuoteModal.vue";
import { useIsRole } from "~/composables/useIsRole";
import type { quote } from "~/types";
definePageMeta({ layout: "admin" });

const { isAdmin } = useIsRole();

const showCreateQuote = ref(false);
const showPreview = ref(false);
const selectedQuote = ref<quote | null>(null);

// Ajoute une référence au composant QuotesQuoteList
const quoteListRef = ref<InstanceType<typeof QuotesQuoteList> | null>(null);

const previewQuote = (item: quote) => {
  selectedQuote.value = item;
  showPreview.value = true;
};

// Fonction pour gérer la fermeture du modal
const handleQuoteModalClose = async () => {
  showCreateQuote.value = false;

  if (
    quoteListRef.value &&
    typeof quoteListRef.value.refreshQuotes === "function"
  ) {
    await quoteListRef.value.refreshQuotes();
  } else {
    console.warn(
      "La méthode refreshQuotes n'est pas disponible sur quoteListRef."
    );
  }
};
</script>
