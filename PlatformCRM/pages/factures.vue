<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Composant d'en-tête -->
    <InvoicesHeaderComponent
      title="Gestion des factures"
      buttonText="Générer la facture à partir d'un devis validé"
      @generate-invoice="handleGenerateInvoice"
    />

   
    <main class="max-w-7xl mx-auto px-4 py-6">

      <InvoicesFilterSearch
        searchPlaceholder="Rechercher une facture..."
        @search="handleSearch"
        @filter-status="handleFilterStatus"
        @sort="handleSort"
      />

      <!-- Tableau des factures -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div class="flex items-center" @click="sortBy('numero')">
                    Numéro
                    <i class="ri-sort-line ml-1"></i>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div class="flex items-center" @click="sortBy('projet')">
                    Projet
                    <i class="ri-sort-line ml-1"></i>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div class="flex items-center" @click="sortBy('date')">
                    Date
                    <i class="ri-sort-line ml-1"></i>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div
                    class="flex items-center justify-end"
                    @click="sortBy('montant')"
                  >
                    Montant
                    <i class="ri-sort-line ml-1"></i>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div class="flex items-center" @click="sortBy('statut')">
                    Statut
                    <i class="ri-sort-line ml-1"></i>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  PDF
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(facture, index) in displayedInvoices"
                :key="index"
                class="hover:bg-gray-50 cursor-pointer"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600"
                >
                  {{ facture.numero }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ facture.projet }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ facture.date }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium"
                >
                  {{ facture.montant }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(facture.statut)"
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ facture.statut }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    class="text-red-600 hover:text-red-800 cursor-pointer"
                    :title="`Télécharger le PDF de la facture ${facture.numero}`"
                  >
                    <i class="ri-file-pdf-line text-xl"></i>
                  </button>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      class="text-gray-500 hover:text-gray-700 cursor-pointer"
                      title="Voir les détails"
                      @click="viewInvoiceDetails(facture)"
                    >
                      <i class="ri-eye-line"></i>
                    </button>
                    <button
                      class="text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Modifier"
                      @click="editInvoice(facture)"
                    >
                      <i class="ri-pencil-line"></i>
                    </button>
                    <button
                      class="text-red-400 hover:text-red-700 cursor-pointer"
                      title="delete"
                      @click="deleteInvoice(facture)"
                    >
                      <i class="ri-delete-bin-5-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              @click="prevPage"
              :disabled="currentPage === 1"
            >
              Précédent
            </button>
            <button
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Suivant
            </button>
          </div>
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">{{ startItem }}</span> à
                <span class="font-medium">{{ endItem }}</span> sur
                <span class="font-medium">{{ filteredInvoices.length }}</span>
                résultats
              </p>
            </div>
            <div>
              <div class="flex items-center">
                <div class="mr-4">
                  <select
                    v-model="itemsPerPage"
                    class="border border-gray-300 rounded text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    @change="handleItemsPerPageChange"
                  >
                    <option value="10">10 par page</option>
                    <option value="25">25 par page</option>
                    <option value="50">50 par page</option>
                    <option value="100">100 par page</option>
                  </select>
                </div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                    @click="prevPage"
                    :disabled="currentPage === 1"
                  >
                    <span class="sr-only">Précédent</span>
                    <i class="ri-arrow-left-s-line text-xs"></i>
                  </button>

                  <!-- Pages -->
                  <template v-for="page in displayedPages" :key="page">
                    <button
                      v-if="page !== '...'"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium cursor-pointer whitespace-nowrap"
                      :class="
                        page === currentPage
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      "
                      @click="goToPage(page)"
                    >
                      {{ page }}
                    </button>
                    <span
                      v-else
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  </template>

                  <button
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                  >
                    <span class="sr-only">Suivant</span>
                    <i class="ri-arrow-right-s-line text-xs"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
definePageMeta({ layout: "admin" });

import type { Invoice } from "~/types";

// Données des factures
const factures = ref<Invoice[]>([
  {
    numero: "FACT-2025-0001",
    projet: "Refonte site web - Entreprise ABC",
    date: "22/04/2025",
    montant: "3 500,00 €",
    statut: "Payée",
  },
  {
    numero: "FACT-2025-0002",
    projet: "Application mobile - Client XYZ",
    date: "18/04/2025",
    montant: "5 200,00 €",
    statut: "Payée",
  },
  {
    numero: "FACT-2025-0003",
    projet: "Maintenance annuelle - Société DEF",
    date: "15/04/2025",
    montant: "1 800,00 €",
    statut: "En attente",
  },
  {
    numero: "FACT-2025-0004",
    projet: "Développement API - StartUp Tech",
    date: "10/04/2025",
    montant: "4 750,00 €",
    statut: "En attente",
  },
  {
    numero: "FACT-2025-0005",
    projet: "Audit sécurité - Banque Secure",
    date: "05/04/2025",
    montant: "6 300,00 €",
    statut: "Payée",
  },
  {
    numero: "FACT-2025-0006",
    projet: "Formation équipe - Entreprise GHI",
    date: "01/04/2025",
    montant: "2 400,00 €",
    statut: "En retard",
  },
  {
    numero: "FACT-2025-0007",
    projet: "Optimisation SEO - E-commerce JKL",
    date: "28/03/2025",
    montant: "1 950,00 €",
    statut: "En retard",
  },
  {
    numero: "FACT-2025-0008",
    projet: "Intégration CRM - Cabinet MNO",
    date: "25/03/2025",
    montant: "3 800,00 €",
    statut: "Payée",
  },
  {
    numero: "FACT-2025-0009",
    projet: "Développement module - Plateforme PQR",
    date: "20/03/2025",
    montant: "2 750,00 €",
    statut: "Payée",
  },
  {
    numero: "FACT-2025-0010",
    projet: "Refonte UX/UI - Application STU",
    date: "15/03/2025",
    montant: "4 200,00 €",
    statut: "Payée",
  },
]);

const searchTerm = ref("");
const selectedStatus = ref("Toutes");
const sortField = ref("date");
const sortDirection = ref("desc");

// État de la pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

const getStatusClass = (statut: string) => {
  switch (statut) {
    case "Payée":
      return "bg-green-100 text-green-800";
    case "En attente":
      return "bg-yellow-100 text-yellow-800";
    case "En retard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Filtrer les factures en fonction de la recherche et du statut sélectionné
const filteredInvoices = computed(() => {
  return factures.value
    .filter((facture) => {
      const matchesSearch =
        searchTerm.value === "" ||
        Object.values(facture).some((value) =>
          value.toLowerCase().includes(searchTerm.value.toLowerCase())
        );

      const matchesStatus =
        selectedStatus.value === "Toutes" ||
        facture.statut === selectedStatus.value;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      // Trier par le champ sélectionné
      if (sortField.value === "montant") {
        // Pour le montant, on extrait les nombres pour la comparaison
        const montantA = parseFloat(
          a.montant.replace(/[^0-9,]/g, "").replace(",", ".")
        );
        const montantB = parseFloat(
          b.montant.replace(/[^0-9,]/g, "").replace(",", ".")
        );
        comparison = montantA - montantB;
      } else {
        comparison = a[sortField.value as keyof Invoice].localeCompare(
          b[sortField.value as keyof Invoice]
        );
      }

      // Inverser si l'ordre est descendant
      return sortDirection.value === "asc" ? comparison : -comparison;
    });
});

// Calculer le nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(filteredInvoices.value.length / itemsPerPage.value);
});

// Calculer les factures à afficher sur la page actuelle
const displayedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredInvoices.value.slice(start, end);
});

// Calculer les indices des éléments affichés
const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const endItem = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage.value,
    filteredInvoices.value.length
  );
});

// Calculer les pages à afficher dans la pagination
const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages.value <= maxVisiblePages) {
  
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Toujours inclure la première page
    pages.push(1);

    // Calculer le début et la fin des pages à afficher autour de la page actuelle
    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);

    // Ajuster si nous sommes près du début
    if (currentPage.value <= 3) {
      endPage = Math.min(4, totalPages.value - 1);
    }

    // Ajuster si nous sommes près de la fin
    if (currentPage.value >= totalPages.value - 2) {
      startPage = Math.max(2, totalPages.value - 3);
    }

    // Ajouter des points de suspension si nécessaire
    if (startPage > 2) {
      pages.push("...");
    }

    // Ajouter les pages intermédiaires
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Ajouter des points de suspension si nécessaire
    if (endPage < totalPages.value - 1) {
      pages.push("...");
    }

    // Toujours inclure la dernière page
    pages.push(totalPages.value);
  }

  return pages;
});

// Méthodes de pagination
const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    currentPage.value = page;
  }}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleItemsPerPageChange = () => {
  // Réinitialiser la page actuelle lorsque le nombre d'éléments par page change
  currentPage.value = 1;
};

// Méthodes de tri et de filtrage
const sortBy = (field: string) => {
  if (sortField.value === field) {
    // Inverser la direction si on clique sur le même champ
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Définir le nouveau champ de tri et réinitialiser la direction
    sortField.value = field;
    sortDirection.value = "desc";
  }
};

const handleSearch = (query: string) => {
  searchTerm.value = query;
  currentPage.value = 1; // Réinitialiser la page quand on effectue une recherche
};

const handleFilterStatus = (status: string) => {
  selectedStatus.value = status;
  currentPage.value = 1; // Réinitialiser la page quand on filtre
};

const handleSort = (sortOption: string) => {
  const [field, direction] = sortOption.split("-");
  sortField.value = field;
  sortDirection.value = direction;
  currentPage.value = 1; 
};

// Méthodes de gestion des factures
const handleGenerateInvoice = () => {
 
  alert("Ouverture de la page de génération de facture");
};

const viewInvoiceDetails = (facture: Invoice) => {

  alert(`Affichage des détails de la facture ${facture.numero}`);
};

const editInvoice = (facture: Invoice) => {

  alert(`Modification de la facture ${facture.numero}`);
};

const deleteInvoice = (facture: Invoice) => {

  alert(`Options supplémentaires pour la facture ${facture.numero}`);
};
</script>

<style scoped>
/* Suppression des flèches pour les inputs de type number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Style personnalisé pour les boutons arrondis (cohérence visuelle) */
.rounded-button {
  border-radius: 0.375rem;
}
</style>
