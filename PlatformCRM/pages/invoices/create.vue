<template>
  <div class="bg-white rounded-lg w-full max-w-2xl mx-auto my-10 p-6 shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Créer une Facture</h1>
    <div v-if="quoteId">
      <p class="text-gray-700 mb-4">
        Création de facture pour le devis #{{ quoteId }}.
      </p>
      <form @submit.prevent="submitInvoice">
        <div class="mb-4">
          <label
            for="invoiceDate"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Date de la facture:</label
          >
          <input
            type="date"
            id="invoiceDate"
            v-model="invoiceData.date"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-6">
          <label for="amount" class="block text-gray-700 text-sm font-bold mb-2"
            >Montant:</label
          >
          <input
            type="number"
            id="amount"
            v-model="invoiceData.amount"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Enregistrer la Facture
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
    <div v-else>
      <p class="text-red-500">
        Aucun ID de devis fourni pour la création de facture.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const quoteId = ref<number | null>(null);
const invoiceData = ref({
  date: "",
  amount: 0,
});

onMounted(() => {
  if (route.params.quoteId) {
    quoteId.value = Number(route.params.quoteId);
  }
});

const submitInvoice = () => {
  console.log(
    "Facture à créer:",
    invoiceData.value,
    "pour le devis:",
    quoteId.value
  );
  // Implement actual invoice creation logic (API call, etc.)
  alert("Facture créée avec succès (simulé)!");
  router.push(`/quotes/${quoteId.value}`); // Navigate back to the quote details page
};
</script>

<style scoped>
/* Add any specific styles for the invoice creation page */
</style>
