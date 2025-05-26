<template>
  <div class="p-6 bg-white w-full">
    <div v-if="quoteDetails">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <button
            @click="$router.back()"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="ri-arrow-go-back-line mr-2"></i>
          </button>
          <h1 class="text-2xl font-bold text-gray-800 mr-6">
            Devis #{{ quoteDetails.number }}
          </h1>
          <button
            v-if="quoteDetails.status === 'EN_ATTENTE' && isClient"
            @click="validateQuote"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-all whitespace-nowrap cursor-pointer !rounded-button"
          >
            Valider le Devis
          </button>
          <span
            v-else
            :class="[
              'inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium',
              statusClass(quoteDetails.status),
            ]"
          >
            {{ quoteDetails.status }}
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <button
            v-if="quoteDetails && quoteDetails.status === 'ACCEPTE'"
            @click="downloadPDF"
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition-all whitespace-nowrap cursor-pointer !rounded-button"
          >
            <i class="ri-download-line mr-2"></i>
            Télécharger PDF
          </button>
        </div>
      </div>

      <p class="text-gray-600 font-bold">
        Client: {{ quoteDetails.customer?.name || "N/A" }}
      </p>
      <p class="text-gray-600 font-bold">
        Projet: {{ quoteDetails.project?.title || "N/A" }}
      </p>
      <p class="text-gray-600 font-bold">
        Date de livraison estimée:
        {{
          quoteDetails.dateLivraison
            ? formatDate(quoteDetails.dateLivraison)
            : "N/A"
        }}
      </p>
      <p
        class="text-lg font-bold mt-4"
        :class="quoteDetails.newTotalPrice ? 'text-red-600' : 'text-gray-800'"
      >
        Prix Total:
        {{
          formatPrice(
            quoteDetails.newTotalPrice !== null &&
              quoteDetails.newTotalPrice !== undefined
              ? quoteDetails.newTotalPrice
              : quoteDetails.totalPrice
          )
        }}
        CFA
      </p>
    </div>
    <div v-else class="text-center py-8">
      <p class="text-gray-500">Chargement des détails du devis...</p>
    </div>

    <div class="space-y-6 mt-6" v-if="quoteDetails">
      <h2 class="text-xl font-semibold text-gray-700">Étapes du devis</h2>
      <div class="relative border-l-2 border-gray-200 pl-6 space-y-10">
        <div
          v-for="(stage, index) in quoteDetails.stages"
          :key="stage.projectStageId"
          class="relative"
        >
          <span
            class="absolute -left-[9px] top-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"
          ></span>
          <div class="bg-gray-50 p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-1">
              <h3 class="text-lg font-medium text-gray-800">
                {{ stage.projectStage.title }}
              </h3>
              <span class="text-blue-600 font-semibold">
                {{ stage.prix }} CFA
              </span>
            </div>
            <p class="text-gray-600 text-sm">
              {{ stage.projectStage.description || "Pas de description." }}
            </p>
          </div>
        </div>
        <p v-if="quoteDetails.stages.length === 0" class="text-gray-500">
          Aucune étape définie pour ce devis.
        </p>
      </div>
    </div>

    <hr class="my-10 border-gray-200" />

    <div class="flex justify-end">
      <button
        v-if="quoteDetails && quoteDetails.status === 'ACCEPTE' && isAdmin"
        @click="openCreateInvoiceModal(quoteDetails.id)"
        class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap cursor-pointer !rounded-button"
      >
        <i class="ri-file-text-line mr-2"></i>
        Créer une Facture
      </button>
    </div>
    <InvoiceTable v-if="quoteDetails" :quoteId="quoteDetails.id" />

    <div v-else class="text-center text-gray-600 py-4">
      <p>Chargement des factures du devis...</p>
    </div>
    <CreateInvoiceModal
      v-if="showCreateInvoiceModal && selectedQuoteForInvoice"
      :quoteId="selectedQuoteForInvoice.id"
      @close="showCreateInvoiceModal = false"
      @success="handleInvoiceCreationSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRoute, useRouter } from "vue-router";
import { useQuoteStore } from "#imports";
import type { quote } from "~/types";
import CreateInvoiceModal from "~/components/invoices/CreateInvoiceModal.vue";
import InvoiceTable from "~/components/invoices/InvoiceTable.vue";

definePageMeta({ layout: "admin" });

const route = useRoute();
const devisStore = useQuoteStore();
const { isClient, isAdmin } = useIsRole();
const quoteDetails = ref<quote | null>(null);
const showCreateInvoiceModal = ref(false);
const selectedQuoteForInvoice = ref<quote | null>(null);
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchQuoteData(Number(newId));
    } else {
      quoteDetails.value = null;
    }
  },
  { immediate: true }
);

async function fetchQuoteData(id: number) {
  try {
    const data = await devisStore.fetchQuoteDetails(id);
    if (data) {
      quoteDetails.value = data;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails du devis :",
      error
    );
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), "dd MMMM yyyy à HH:mm", { locale: fr });
  } catch (e) {
    console.error("Erreur de formatage de date:", e);
    return "Date invalide";
  }
};

const formatPrice = (price: number): string => {
  return price.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const statusClass = (status: string) => {
  switch (status) {
    case "ACCEPTE":
      return "bg-green-100 text-green-700";
    case "REFUSE":
      return "bg-red-100 text-red-700";
    case "EN_ATTENTE":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const downloadPDF = () => {
  if (quoteDetails.value) {
    console.log("Télécharger PDF pour le devis :", quoteDetails.value.id);
  }
};

async function validateQuote() {
  if (quoteDetails.value && confirm("Voulez-vous vraiment valider ce devis?")) {
    try {
      await devisStore.updateQuoteStatus(quoteDetails.value.id, "ACCEPTE");
      await fetchQuoteData(quoteDetails.value.id);
      console.log(`Le devis ${quoteDetails.value.id} validé avec succès`);
    } catch (error) {
      console.log("Erreur lors de la validation", error);
    }
  }
}

const openCreateInvoiceModal = (quoteId: number) => {
  selectedQuoteForInvoice.value = quoteDetails.value;
  showCreateInvoiceModal.value = true;
};

const handleInvoiceCreationSuccess = async () => {
  await fetchQuoteData(Number(route.params.id));
  console.log("Invoice created successfully!");
};
</script>
