<template>
  <div class="flex justify-between items-center mb-6 md:mb-8">
    <div>
      <h1 class="text-xl font-bold text-gray-800 sm:text-2xl">Mes Projets</h1>
      <p class="text-gray-600 text-sm sm:text-base">
        Gérez et suivez vos projets digitaux
      </p>
    </div>
    <div v-if="isAdmin">
      <button
        @click="showCreateProject = true"
        class="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap cursor-pointer !rounded-button"
      >
        <i class="ri-add-line mr-2"></i> Nouveau projet
      </button>
    </div>
  </div>

  <div
    v-if="showCreateProject"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
  >
    <div
      ref="modalRef"
      class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative"
    >
      <button
        @click="showCreateProject = false"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <i class="ri-close-line text-2xl"></i>
      </button>

      <form
        @submit.prevent="soumettreFormulaire"
        class="space-y-6 overflow-y-auto max-h-[80vh] pr-4"
      >
        <h2 class="text-lg font-medium text-gray-900 mb-6">
          Informations du projet
        </h2>

        <div>
          <label
            for="nom-projet"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Titre du projet <span class="text-red-500">*</span>
          </label>
          <input
            id="nom-projet"
            v-model="projet.title"
            type="text"
            placeholder="Entrez le nom du projet"
            class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :class="{ 'border-red-500': erreurs.nom }"
            @focus="erreurs.nom = ''"
          />
          <p v-if="erreurs.nom" class="mt-1 text-sm text-red-600">
            {{ erreurs.nom }}
          </p>
        </div>

        <div>
          <label
            for="client"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Client <span class="text-red-500">*</span>
          </label>
          <select
            id="client"
            v-model="projet.customerId"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            :class="{ 'border-red-500': erreurs.client }"
            @change="erreurs.client = ''"
          >
            <option value="" disabled>Sélectionner un client</option>
            <option
              v-for="client in clients"
              :key="client.value"
              :value="client.value"
            >
              {{ client.label }}
            </option>
          </select>
          <p v-if="erreurs.client" class="mt-1 text-sm text-red-600">
            {{ erreurs.client }}
          </p>
        </div>

        <div>
          <label
            for="Description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Description</label
          >
          <textarea
            class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            name=""
            id=""
            rows="10"
            v-model="projet.description"
          ></textarea>
        </div>
        <div>
          <label
            for="date-limite"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Date debut
          </label>
          <input
            id="date_debut"
            v-model="projet.dateDebut"
            type="date"
            class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label
            for="date-limite"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Date fin
          </label>
          <input
            id="date_fin"
            v-model="projet.dateFin"
            type="date"
            class="w-full px-4 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const { isAdmin } = useIsRole();
const showCreateProject = ref(false);
const router = useRouter();

interface Client {
  value: string;
  label: string;
}

const clients = ref<Client[]>([]);

const projet = reactive({
  title: "",
  customerId: "",
  dateDebut: "",
  dateFin: "",
  description: "",
});

const erreurs = reactive({
  nom: "",
  client: "",
});

onMounted(async () => {
  try {
    const data = await $fetch<Client[]>("/api/users/customers");
    clients.value = data;
  } catch (err: any) {
    console.error("Erreur lors de la récupération des clients");
  }
});

const validerFormulaire = (): boolean => {
  let valide = true;
  if (!projet.title.trim()) {
    erreurs.nom = "Le titre du projet est obligatoire";
    valide = false;
  }
  if (!projet.customerId) {
    erreurs.client = "Le client est obligatoire";
    valide = false;
  }
  return valide;
};

const resetForm = () => {
  projet.title = "";
  projet.customerId = "";
  projet.dateDebut = "";
  projet.dateFin = "";
  projet.description = "";
  erreurs.nom = "";
  erreurs.client = "";
};

const soumettreFormulaire = async () => {
  if (validerFormulaire()) {
    try {
      const response = await $fetch("/api/Projects/projects", {
        method: "POST",
        body: {
          customerId: projet.customerId,
          title: projet.title,
          description: projet.description,
          startDate: projet.dateDebut,
          endDate: projet.dateFin,
        },
      });

      console.log("Projet créé avec succès:", response);
      showCreateProject.value = false;
      resetForm();

      router.push("/projects");
    } catch (error: any) {
      console.error("Erreur lors de la création du projet:", error);

      if (error.data) {
        if (error.data.statusMessage) {
          erreurs.nom = error.data.statusMessage;
        } else {
        }
      } else {
        erreurs.nom = "Une erreur inattendue s'est produite.";
      }
    }
  }
};
</script>
