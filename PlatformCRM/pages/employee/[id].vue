<template>
  <div class="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-12">
    <div class="max-w-full w-full mx-auto">
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
        Chargement des détails de l'employé...
      </div>
      <div
        v-else-if="error"
        class="text-center py-16 text-red-600 bg-white rounded-xl shadow"
      >
        Erreur lors du chargement des données de l'employé : {{ error.message }}
      </div>
      <div
        v-else-if="!employeeData"
        class="text-center py-16 text-gray-600 bg-white rounded-xl shadow"
      >
        Employé introuvable.
      </div>

      <div v-else class="bg-white rounded-xl shadow p-8">
        <!-- Profil -->
        <div
          class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8"
        >
          <div class="flex-shrink-0">
            <img
              v-if="employeeData.profilePicture"
              :src="employeeData.profilePicture"
              alt="Photo de profil"
              class="w-32 h-32 rounded-full object-cover shadow-md border-4 border-blue-100"
            />
            <div
              v-else
              class="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-400 font-bold"
            >
              <i class="ri-user-3-line"></i>
            </div>
          </div>
          <div class="flex-1 w-full">
            <h1 class="text-3xl font-bold text-gray-800 mb-2 capitalize">
              {{ employeeData.name }}
            </h1>
            <p class="text-lg text-gray-600 mb-1">
              <i class="ri-mail-line mr-1"></i>{{ employeeData.email }}
            </p>
            <div class="flex flex-wrap gap-4 mt-2">
              <span class="text-md font-normal text-gray-700">
                Poste :
                <span
                  class="ml-1 font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize"
                  style="padding: 0 0.5em; border-radius: 0.5em"
                >
                  {{ employeeData.poste || "N/A" }}
                </span>
              </span>
              <span class="text-md font-normal text-gray-700">
                Département :
                <span
                  class="ml-1 font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize"
                  style="padding: 0 0.5em; border-radius: 0.5em"
                >
                  {{ employeeData.department || "N/A" }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Tâches assignées -->
        <div class="mt-8">
          <h2
            class="text-xl font-semibold text-blue-700 mb-4 flex items-center justify-between"
          >
            Tâches assignées
            <span
              class="text-sm font-normal text-blue-600 px-3 py-1 bg-blue-100 rounded-full"
            >
              {{ employeeData.tasks?.length || 0 }}
            </span>
          </h2>
          <div
            v-if="employeeData.tasks && employeeData.tasks.length > 0"
            class="space-y-4"
          >
            <div
              v-for="task in employeeData.tasks"
              :key="task.id"
              class="bg-gray-50 p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center gap-2"
            >
              <div class="flex items-center gap-3 flex-1">
                <i class="ri-task-line text-green-500 text-2xl"></i>
                <div>
                  <p
                    class="font-medium text-gray-800 tracking-wider capitalize"
                  >
                    {{ task.title }}
                  </p>
                  <p class="text-sm text-gray-600 mb-1">
                    Projet :
                    <NuxtLink
                      :to="`/projects/${task.project.id}`"
                      class="text-blue-500 hover:underline tracking-wider capitalize"
                    >
                      {{ task.project.title }}
                    </NuxtLink>
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 md:justify-end">
                <span class="text-xs font-normal text-gray-700">
                  Priorité :
                  <span
                    class="ml-1 font-semibold"
                    :class="{
                      'text-red-500 bg-red-100 border border-red-200':
                        task.priority === 'HAUTE',
                      'text-yellow-700 bg-yellow-100 border border-yellow-200':
                        task.priority === 'MOYENNE',
                      'text-blue-500 bg-blue-100 border border-blue-200':
                        task.priority === 'BASSE',
                    }"
                    style="padding: 0 0.5em; border-radius: 0.5em"
                  >
                    {{ task.priority }}
                  </span>
                </span>
                <span class="text-xs font-normal text-gray-700">
                  Statut :
                  <span
                    class="ml-1 font-semibold"
                    :class="{
                      'text-green-600 bg-green-100 border border-green-200':
                        task.status === 'TERMINE',
                      'text-yellow-500 bg-yellow-100 border border-yellow-200':
                        task.status === 'EN_COURS',
                      'text-gray-500 bg-gray-100 border border-gray-200':
                        task.status === 'A_FAIRE',
                      'text-red-500 bg-red-100 border border-red-200':
                        task.status === 'CANCELLED',
                    }"
                    style="padding: 0 0.5em; border-radius: 0.5em"
                  >
                    {{ task.status }}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm italic mt-2">
            Aucune tâche associée.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

interface AssignedTask {
  id: number;
  title: string;
  description: string;
  priority: "BASSE" | "MOYENNE" | "HAUTE";
  status: "A_FAIRE" | "EN_COURS" | "TERMINE" | "CANCELLED";
  project: {
    id: number;
    title: string;
  };
}

interface DetailEmployeeData {
  id: number;
  name: string;
  email: string;
  poste?: string;
  department?: string;
  profilePicture?: string;
  tasks?: AssignedTask[];
  UserRole?: Array<{
    userId: number;
    roleId: number;
    assignedAt: string;
    role: { id: number; name: string };
  }>;
}

const route = useRoute();
const employeeId = ref<number | null>(null);
const employeeData = ref<DetailEmployeeData | null>(null);
const isLoading = ref(true);
const error = ref<any>(null);

definePageMeta({
  layout: "admin",
});

const fetchEmployeeDetails = async () => {
  isLoading.value = true;
  error.value = null;

  // Extrait l'ID de l'URL
  let idParam = route.params.id;
  if (Array.isArray(idParam)) {
    employeeId.value = parseInt(idParam[0]);
  } else {
    employeeId.value = parseInt(idParam as string);
  }

  if (!employeeId.value || isNaN(employeeId.value)) {
    error.value = { message: "ID employé invalide." };
    isLoading.value = false;
    return;
  }

  try {
    const data = await $fetch<DetailEmployeeData>(
      `/api/employee/${employeeId.value}`
    );
    employeeData.value = data;
    console.log("Données employé reçues:", employeeData.value);
  } catch (err: any) {
    console.error(
      "Erreur lors de la récupération des détails de l'employé:",
      err
    );
    error.value = {
      message: err.message || "Impossible de charger les détails de l'employé.",
    };
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchEmployeeDetails();
});
</script>

<style scoped></style>
