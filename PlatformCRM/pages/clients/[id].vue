<template>
  <div class="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-12">
    <div class="max-w-full mx-auto">
      <div class="mb-8">
        <NuxtLink
          to="/utilisateurs"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <i class="ri-arrow-left-s-line mr-2 text-xl"></i>
          Retour aux utilisateurs
        </NuxtLink>
      </div>

      <div
        v-if="isLoading"
        class="text-center py-16 text-gray-600 bg-white rounded-xl shadow"
      >
        Chargement des détails du client...
      </div>
      <div
        v-else-if="error"
        class="text-center py-16 text-red-600 bg-white rounded-xl shadow"
      >
        Erreur lors du chargement des données du client : {{ error.message }}
      </div>
      <div
        v-else-if="!clientData"
        class="text-center py-16 text-gray-600 bg-white rounded-xl shadow"
      >
        Client introuvable.
      </div>
      <div v-else class="bg-white rounded-xl shadow p-4 sm:p-8">
        <!-- Profil -->
        <div
          class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8"
        >
          <div class="flex-shrink-0 mb-4 md:mb-0">
            <img
              v-if="clientData.profilePicture"
              :src="clientData.profilePicture"
              alt="Photo de profil"
              class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-md border-4 border-blue-100"
            />
            <div
              v-else
              class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-400 font-bold"
            >
              <i class="ri-user-3-line"></i>
            </div>
          </div>
          <div class="flex-1 w-full">
            <h1
              class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-words"
            >
              {{ clientData.name }}
            </h1>
            <p class="text-base sm:text-lg text-gray-600 mb-1 break-all">
              <i class="ri-mail-line mr-1"></i>{{ clientData.email }}
            </p>
            <div class="flex flex-wrap gap-2 sm:gap-4 mt-2">
              <span
                class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              >
                <strong>Entreprise:</strong> {{ clientData.company || "N/A" }}
              </span>
              <span
                class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              >
                <strong>Secteur:</strong> {{ clientData.industry || "N/A" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Infos de contact -->
        <div
          class="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <div class="flex-1">
            <h2
              class="text-lg sm:text-xl font-semibold text-blue-700 mb-2 sm:mb-3 tracking-wider"
            >
              Informations de Contact
            </h2>
            <p class="text-gray-700 mb-1 tracking-wider break-all">
              <strong>Téléphone:</strong> {{ clientData.contacts || "N/A" }}
            </p>
            <p class="text-gray-700 tracking-wider capitalize break-words">
              <strong>Adresse:</strong> {{ clientData.adresse || "N/A" }}
            </p>
          </div>
        </div>

        <!-- Projets -->
        <div
          class="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm h-full flex flex-col"
        >
          <h2
            class="text-lg sm:text-xl font-semibold text-blue-700 mb-3 sm:mb-4 tracking-wider"
          >
            Projets
          </h2>
          <div
            v-if="
              clientData.clientProjects && clientData.clientProjects.length > 0
            "
            class="flex-grow overflow-y-auto max-h-64 space-y-2 sm:space-y-3 pr-1 sm:pr-2"
          >
            <div
              v-for="project in clientData.clientProjects"
              :key="project.id"
              class="bg-white p-2 sm:p-3 rounded-md shadow-xs flex items-center"
            >
              <i class="ri-folder-line text-blue-500 text-lg mr-2 sm:mr-3"></i>
              <div class="truncate">
                <NuxtLink
                  :to="`/projects/${project.id}`"
                  class="font-medium text-gray-800 hover:text-blue-600 tracking-wider capitalize truncate"
                >
                  {{ project.title }}
                </NuxtLink>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm italic">
            Aucun projet associé.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Project } from "~/types";

interface DetailedClientData {
  id: number;
  name: string;
  email: string;
  contacts?: string;
  company?: string;
  industry?: string;
  adresse?: string;
  profilePicture?: string;
  clientProjects?: Project[];
  UserRole?: Array<{
    userId: number;
    roleId: number;
    assignedAt: string;
    role: { id: number; name: string };
  }>;
}

const route = useRoute();
const clientId = ref<number | null>(null);
const clientData = ref<DetailedClientData | null>(null);
const isLoading = ref(true);
const error = ref<any>(null);

definePageMeta({
  layout: "admin",
});

const fetchClientDetails = async () => {
  isLoading.value = true;
  error.value = null;

  let idParam = route.params.id;
  if (Array.isArray(idParam)) {
    clientId.value = parseInt(idParam[0]);
  } else {
    clientId.value = parseInt(idParam as string);
  }

  if (!clientId.value || isNaN(clientId.value)) {
    error.value = { message: "ID client invalide." };
    isLoading.value = false;
    return;
  }

  try {
    const data = await $fetch<DetailedClientData>(
      `/api/clients/${clientId.value}`
    );
    clientData.value = data;
    console.log("Données client reçues:", clientData.value);
  } catch (err: any) {
    console.error("Erreur lors de la récupération des détails du client:", err);
    error.value = {
      message: err.message || "Impossible de charger les détails du client.",
    };
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchClientDetails();
});
</script>

<style scoped></style>
