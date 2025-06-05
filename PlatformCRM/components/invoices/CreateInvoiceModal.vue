<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="rounded-2xl shadow-2xl max-w-lg w-full p-0 transform transition-all bg-white"
        >
          <div class="p-6 rounded-t-2xl bg-blue-600">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-semibold text-white">
                  Créer une Facture
                </h2>
              </div>

              <button
                @click="$emit('close')"
                class="text-blue-100 hover:text-white transition-colors duration-200"
              >
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div v-if="quoteId">
              <p class="text-gray-700 mb-4">
                Création de facture pour le devis #{{ quoteId }}.
              </p>
              <p class="text-gray-700 mb-4 font-bold">
                Montant total du devis: {{ quoteTotalPrice }} FCFA
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
                    class="shadow appearance-none border focus:ring-2 focus:ring-indigo-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label
                    for="amount"
                    class="block text-gray-700 text-sm font-bold mb-2"
                    >Montant Payé:</label
                  >
                  <input
                    type="number"
                    id="amount"
                    v-model.number="invoiceData.amount"
                    class="shadow appearance-none border focus:ring-2 focus:ring-indigo-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label
                    for="paymentMethod"
                    class="block text-gray-700 text-sm font-bold mb-2"
                    >Méthode de paiement:</label
                  >
                  <select
                    id="paymentMethod"
                    v-model="invoiceData.paymentMethod"
                    class="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Sélectionner une méthode</option>
                    <option value="OrangeMoney">OrangeMoney</option>
                    <option value="MTNMoney">MTNMoney</option>
                    <option value="BankTransfer">Virement Bancaire</option>
                    <option value="Cash">Espèces</option>
                  </select>
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
                    @click="$emit('close')"
                    class="bg-gray-300 hover:bg-gray-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  quoteId: number | null;
  quoteTotalPrice: number;
}>();

const emit = defineEmits(["close", "success"]);

const invoiceData = ref({
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "",
  amount: "",
});

const submitInvoice = async () => {
  if (!props.quoteId) {
    alert(
      "Erreur: Aucun ID de devis n'est disponible pour la création de facture."
    );
    return;
  }
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user ? user.id : null;

  if (!props.quoteId || !userId) {
    alert("Erreur: Informations utilisateur ou ID devis manquants.");
    return;
  }
  try {
    const response = await $fetch(`/api/invoices`, {
      method: "POST",
      body: JSON.stringify({
        quoteId: props.quoteId,
        amountPaid: invoiceData.value.amount,
        invoiceDate: invoiceData.value.date,
        paymentMethod: invoiceData.value.paymentMethod,
        userId: userId,
        newTotalPrice: props.quoteTotalPrice,
      }),
    });
    console.log("Invoice creation response:", response);
    emit("success");
    emit("close");
  } catch (error: any) {
    console.error("Erreur lors de la création de la facture:", error);
    alert(`Échec de la création de la facture: ${error.message}`);
  }
};
</script>
