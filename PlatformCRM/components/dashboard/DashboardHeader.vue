<template>
  <div
    class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
  >
    <h1 class="text-2xl font-bold text-gray-800">Tableau de bord</h1>
    <div class="flex flex-wrap gap-3">
      <button class="btn btn-primary" @click="showCreateProject = true">
        <i class="ri-folder-add-line mr-2"></i>Nouveau projet
      </button>
    </div>
  </div>
  <div
    v-if="showCreateProject"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div
      ref="modalRef"
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="ri-folder-add-line text-2xl text-white"></i>
            <h2 class="text-xl font-semibold text-white">Nouveau Projet</h2>
          </div>
          <button
            @click="showCreateProject = false"
            class="text-blue-100 hover:text-white transition-colors duration-200"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <h2 class="mt-2 text-blue-100">Informations du projet</h2>
      </div>

      <form @submit.prevent="soumettreFormulaire" class="p-6">
        <div class="space-y-6">
          <div>
            <label
              for="nom-projet"
              class="block text-sm font-medium mb-2 text-gray-700"
            >
              Titre du projet <span class="text-red-500">*</span>
            </label>
            <div class="mb-4">
              <div class="relative">
                <input
                  id="nom-projet"
                  v-model="projet.title"
                  type="text"
                  placeholder="Entrez le nom du projet"
                  class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': erreurs.nom }"
                  @focus="erreurs.nom = ''"
                />
              </div>
            </div>

            <p v-if="erreurs.nom" class="mt-1 text-sm text-red-600">
              {{ erreurs.nom }}
            </p>
          </div>

          <div>
            <label
              for="client"
              class="block text-sm font-medium mb-2 text-gray-700"
            >
              Client <span class="text-red-500">*</span>
            </label>
            <div class="mb-4">
              <div class="relative">
                <select
                  id="client"
                  v-model="projet.customerId"
                  class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': erreurs.client }"
                  @change="erreurs.client = ''"
                >
                  <option
                    class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value=""
                    disabled
                  >
                    Sélectionner un client
                  </option>
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
            </div>
          </div>

          <div>
            <label
              for="Description"
              class="block text-sm font-medium mb-2 text-gray-700"
            >
              Description</label
            >
            <textarea
              class="w-full px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500"
              name=""
              id=""
              rows="10"
              v-model="projet.description"
            ></textarea>
          </div>
          <div>
            <label
              for="date-limite"
              class="block text-sm font-medium mb-2 text-gray-700"
            >
              Date debut
            </label>
            <input
              id="date_debut"
              v-model="projet.dateDebut"
              type="date"
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="showCreateProject = false"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-300 px-4 py-2 text-base"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 px-4 py-2 text-base flex items-center justify-center gap-2"
          >
            Créer le projet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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

<style scoped></style>
