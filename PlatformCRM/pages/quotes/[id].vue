<template>
  <div class="p-6 bg-white w-full">
    <div v-if="quoteDetails">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <NuxtLink to="/devis" class="text-gray-400 hover:text-gray-600">
            <i class="ri-arrow-left-s-line text-xl mr-2 mt-1"></i>
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-800 mr-6">
            Devis <span class="text-green-500">#{{ quoteDetails.number }}</span>
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

      <p class="text-gray-600 font-bold ml-3 mb-1 tracking-wider">
        Client:
        <span class="text-gray-600 font-normal capitalize tracking-wider">{{
          quoteDetails.customer?.name || "N/A"
        }}</span>
      </p>
      <p class="text-gray-600 font-bold ml-3 mb-1 tracking-wider">
        Projet:
        <span class="text-gray-600 font-normal capitalize tracking-wider">
          {{ quoteDetails.project?.title || "N/A" }}</span
        >
      </p>
      <p class="text-gray-600 font-bold ml-3 mb-1 tracking-wider">
        Date:
        <span class="text-gray-600 font-normal capitalize tracking-wider">
          {{
            quoteDetails.createdAt ? formatDate(quoteDetails.createdAt) : "N/A"
          }}</span
        >
      </p>
      <p class="text-lg font-bold mt-4 ml-3 text-gray-800">
        Prix Total:
        <span
          v-if="quoteDetails.newTotalPrice"
          class="line-through text-gray-500 mr-2"
        >
          {{ formatPrice(quoteDetails.totalPrice) }} CFA
        </span>
        <span
          :class="quoteDetails.newTotalPrice ? 'text-red-600' : 'text-gray-800'"
        >
          {{
            formatPrice(
              quoteDetails.newTotalPrice !== null &&
                quoteDetails.newTotalPrice !== undefined
                ? quoteDetails.newTotalPrice
                : quoteDetails.totalPrice
            )
          }}
          CFA
        </span>
      </p>
    </div>
    <div v-else class="text-center py-8">
      <p class="text-gray-500">Chargement des détails du devis...</p>
    </div>

    <div class="space-y-6 mt-10" v-if="quoteDetails">
      <h2 class="text-2xl font-semibold text-gray-800 ml-3">Étapes du devis</h2>
      <div class="relative pl-8 py-2">
        <div
          class="absolute left-[17px] top-0 bottom-0 w-1 bg-blue-200 rounded-full"
        ></div>

        <div
          v-for="(stage, index) in quoteDetails.stages"
          :key="stage.projectStageId"
          class="relative mb-8 last:mb-0"
        >
          <div
            class="absolute -left-1 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-lg"
          >
            <i :class="getStageIcon(index)"></i>
          </div>

          <div
            class="bg-white p-5 rounded-xl shadow-md border border-gray-200 ml-8"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-semibold text-blue-700">
                {{ stage.projectStage.title }}
              </h3>
              <span class="text-blue-600 font-bold text-lg whitespace-nowrap">
                {{ formatPrice(stage.prix) }} CFA
              </span>
            </div>
            <p class="text-gray-700 text-base leading-relaxed">
              {{
                stage.projectStage.description ||
                "Pas de description détaillée pour cette étape."
              }}
            </p>
          </div>
        </div>
        <p
          v-if="quoteDetails.stages.length === 0"
          class="text-gray-500 text-center py-4 ml-8"
        >
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

    <InvoiceTable
      v-if="quoteDetails && isAdmin && quoteDetails.status !== 'EN_ATTENTE'"
      :quoteId="quoteDetails.id"
      :key="quoteDetails.id"
    />

    <div
      v-else-if="
        quoteDetails && isAdmin && quoteDetails.status === 'EN_ATTENTE'
      "
      class="text-center text-gray-600 py-4"
    >
      <p>Les factures seront affichées une fois le devis validé.</p>
    </div>

    <div v-else-if="!quoteDetails" class="text-center text-gray-600 py-4">
      <p>Chargement des factures du devis...</p>
    </div>

    <CreateInvoiceModal
      v-if="showCreateInvoiceModal && selectedQuoteForInvoice"
      :quoteId="selectedQuoteForInvoice.id"
      :quoteTotalPrice="getDisplayPrice(selectedQuoteForInvoice)"
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
import { NuxtLink } from "#components";

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
    return format(new Date(dateStr), "dd MMMM 'à' HH:mm", { locale: fr });
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
const getDisplayPrice = (quoteItem: quote): number => {
  if (
    quoteItem.newTotalPrice !== undefined &&
    quoteItem.newTotalPrice !== null
  ) {
    return quoteItem.newTotalPrice;
  } else if (
    quoteItem.totalPrice !== undefined &&
    quoteItem.totalPrice !== null
  ) {
    return quoteItem.totalPrice;
  }
  return 0;
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

const getStageIcon = (index: number) => {
  const icons = [
    "ri-lightbulb-line",
    "ri-pencil-ruler-2-line",
    "ri-tools-line",
    "ri-check-double-line",
    "ri-flag-line",
    "ri-arrow-right-circle-line",
  ];
  return icons[index] || "ri-arrow-right-circle-line";
};

const downloadPDF = async () => {
  if (!quoteDetails.value) return;
  const id = quoteDetails.value.id;
  const url = `/api/quotes/${id}/pdf`;
  window.open(url, "_blank");
};

async function validateQuote() {
  if (quoteDetails.value && confirm("Voulez-vous vraiment valider ce devis?")) {
    try {
      await devisStore.updateQuoteStatus(quoteDetails.value.id, "ACCEPTE");
      await fetchQuoteData(quoteDetails.value.id);
      console.log(`Le devis ${quoteDetails.value.id} validé avec succès`);
    } catch (error) {
      console.error("Erreur lors de la validation", error);
    }
  }
}

const openCreateInvoiceModal = (quoteId: number) => {
  selectedQuoteForInvoice.value = quoteDetails.value;
  showCreateInvoiceModal.value = true;
};

const handleInvoiceCreationSuccess = async () => {
  await fetchQuoteData(Number(route.params.id));
};
</script>

<style scoped></style>
