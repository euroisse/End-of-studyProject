<template>
  <div class="flex justify-between items-center mb-6 md:mb-8">
    <div>
      <h1 class="text-xl font-bold text-gray-800 sm:text-2xl">Mes Projets</h1>
      <p class="text-gray-600 text-sm sm:text-base">
        Gérez et suivez vos projets digitaux
      </p>
    </div>
    <div>
      <button
        @click="showCreateProject = true"
        class="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap cursor-pointer !rounded-button"
      >
        <i class="ri-add-line mr-2"></i> Nouveau projet
      </button>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showCreateProject" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div ref="modalRef" class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
      <button
        @click="showCreateProject = false"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <i class="ri-close-line text-2xl"></i>
      </button>

      <!-- Formulaire -->
      <form @submit.prevent="soumettreFormulaire" class="space-y-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">
          Informations du projet
        </h2>

        <!-- Nom projet -->
        <div>
          <label for="nom-projet" class="block text-sm font-medium text-gray-700 mb-1">
            Nom du projet <span class="text-red-500">*</span>
          </label>
          <input
            id="nom-projet"
            v-model="projet.nom"
            type="text"
            placeholder="Entrez le nom du projet"
            class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :class="{ 'border-red-500': erreurs.nom }"
            @focus="erreurs.nom = ''"
          />
          <p v-if="erreurs.nom" class="mt-1 text-sm text-red-600">{{ erreurs.nom }}</p>
        </div>

        <!-- Client -->
        <div>
          <label for="client" class="block text-sm font-medium text-gray-700 mb-1">
            Client <span class="text-red-500">*</span>
          </label>
          <input
            id="client"
            v-model="projet.client"
            type="text"
            placeholder="Entrez le nom du client"
            class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :class="{ 'border-red-500': erreurs.client }"
            @focus="erreurs.client = ''"
          />
          <p v-if="erreurs.client" class="mt-1 text-sm text-red-600">{{ erreurs.client }}</p>
        </div>

        <!-- Date et statut -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date limite -->
          <div>
            <label for="date-limite" class="block text-sm font-medium text-gray-700 mb-1">
              Date limite
            </label>
            <input
              id="date-limite"
              v-model="projet.dateLimite"
              type="date"
              class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <!-- Statut -->
          <div>
            <label for="statut" class="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <div class="relative">
              <button
                type="button"
                id="statut"
                @click="toggleStatutDropdown"
                class="w-full px-4 py-2 border rounded-button bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex justify-between items-center cursor-pointer"
              >
                <span>{{ projet.statut || "Sélectionner un statut" }}</span>
                <i class="ri-arrow-down-s-line text-gray-400"></i>
              </button>
              <div v-if="statutDropdownOuvert" class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border py-1">
                <div
                  v-for="statut in statuts"
                  :key="statut"
                  @click="selectStatut(statut)"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ statut }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="showCreateProject = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            Créer le projet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { parseISO } from "date-fns"; 
import { projects } from "~/composables/useProjects"; 

const showCreateProject = ref(false);

const projet = reactive({
  nom: "",
  client: "",
  dateLimite: "",
  statut: "En cours",
});

const erreurs = reactive({
  nom: "",
  client: "",
});

const statutDropdownOuvert = ref(false);
const statuts = ["En cours", "En attente", "Terminé", "En retard"];

const modalRef = ref<HTMLElement | null>(null);

const toggleStatutDropdown = () => {
  statutDropdownOuvert.value = !statutDropdownOuvert.value;
};

const selectStatut = (statut: string) => {
  projet.statut = statut;
  statutDropdownOuvert.value = false;
};

const validerFormulaire = (): boolean => {
  let valide = true;
  if (!projet.nom.trim()) {
    erreurs.nom = "Le nom du projet est obligatoire";
    valide = false;
  }
  if (!projet.client.trim()) {
    erreurs.client = "Le nom du client est obligatoire";
    valide = false;
  }
  return valide;
};

const soumettreFormulaire = () => {
  if (validerFormulaire()) {
    projects.value.unshift({
      id: Date.now(),
      name: projet.nom,
      client: projet.client,
      status: projet.statut,
      progress: 0,
      lastUpdate: projet.dateLimite ? parseISO(projet.dateLimite) : new Date()
    });
    projet.nom = "";
    projet.client = "";
    projet.dateLimite = "";
    projet.statut = "En cours";
    showCreateProject.value = false;
  }
};

const clickOutside = (event: MouseEvent) => {
  if (statutDropdownOuvert.value) {
    const target = event.target as Node;
    if (modalRef.value && !modalRef.value.contains(target)) {
      statutDropdownOuvert.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener("click", clickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", clickOutside);
});
</script>
