<template>
  <div class="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
    <div>
      <div class="mb-6">
        <NuxtLink
          to="/utilisateurs"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <div class="text-lg">
            <i class="ri-arrow-left-s-line"></i>
          </div>
          Retour aux utilisateurs
        </NuxtLink>
      </div>
      <div v-if="isLoading" class="text-center py-8 text-gray-600">
        Chargement des détails du client...
      </div>
      <div v-else-if="!clientData" class="text-center py-8 text-gray-600">
        Client introuvable.
      </div>
      <div v-else>
        <div
          class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200"
        >
          <h1 class="text-3xl font-bold text-gray-800">
            {{ clientData.name }}
          </h1>
          <span class="text-lg text-gray-600">{{ clientData.email }}</span>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-blue-50 rounded-lg shadow-sm"
        >
          <div>
            <h2 class="text-xl font-semibold text-blue-700 mb-3">
              Informations de Contact
            </h2>
            <p class="text-gray-700 mb-1">
              <strong>Téléphone:</strong> {{ clientData.contacts || "N/A" }}
            </p>
            <p class="text-gray-700">
              <strong>Adresse:</strong> {{ clientData.adresse || "N/A" }}
            </p>
          </div>
          <div
            v-if="clientData.profilePicture"
            class="flex justify-center items-center"
          >
            <img
              :src="clientData.profilePicture"
              alt="Photo de profil"
              class="w-32 h-32 rounded-full object-cover shadow-md border-2 border-blue-200"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div
            class="bg-purple-50 p-5 rounded-lg shadow-sm h-full flex flex-col"
          >
            <h2 class="text-xl font-semibold text-purple-700 mb-4">Projets</h2>
            <div
              v-if="
                clientData.clientProjects &&
                clientData.clientProjects.length > 0
              "
              class="flex-grow overflow-y-auto max-h-64 space-y-3 pr-2"
            >
              <div
                v-for="project in clientData.clientProjects"
                :key="project.id"
                class="bg-white p-3 rounded-md shadow-xs flex items-center"
              >
                <i class="ri-folder-line text-purple-500 text-lg mr-3"></i>
                <div>
                  <NuxtLink
                    :to="`/projects/${project.id}`"
                    class="font-medium text-gray-800 hover:text-purple-600"
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
