<template>
  <div class="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
    <div>
      <div class="mb-6">
        <NuxtLink
          to="/utilisateurs"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <div class="text-lg">
            <i class="ri-arrow-left-s-line mr-2"></i>
          </div>
          Retour aux utilisateurs
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="text-center py-8 text-gray-600">
        Chargement des détails de l'employé...
      </div>
      <div v-else-if="error" class="text-center py-8 text-red-600">
        Erreur lors du chargement des données de l'employé : {{ error.message }}
      </div>
      <div v-else-if="!employeeData" class="text-center py-8 text-gray-600">
        Employé introuvable.
      </div>

      <div v-else>
        <div
          class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200"
        >
          <h1 class="text-3xl font-bold text-gray-800">
            {{ employeeData.name }}
          </h1>
          <span class="text-lg text-gray-600">{{ employeeData.email }}</span>
        </div>

        <div
          class="flex flex-row gap-6 mb-8 p-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <div>
            <h2 class="text-xl font-semibold text-blue-700 mb-3">
              Informations de l'employé
            </h2>
            <p class="text-gray-700 mb-1 tracking-wider capitalize">
              <strong>Poste:</strong> {{ employeeData.poste || "N/A" }}
            </p>
            <p class="text-gray-700 tracking-wider capitalize">
              <strong>Département:</strong>
              {{ employeeData.department || "N/A" }}
            </p>
          </div>
          <div
            v-if="employeeData.profilePicture"
            class="flex justify-center items-center"
          >
            <img
              :src="employeeData.profilePicture"
              alt="Photo de profil"
              class="w-32 h-32 rounded-full object-cover shadow-md border-2 border-blue-200"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 w-full gap-6">
          <div class="bg-gray-50 p-5 rounded-lg shadow-sm h-full flex flex-col">
            <h2
              class="text-xl font-semibold text-blue-700 mb-4 flex items-center justify-between"
            >
              Tâches assignées
              <span
                class="text-sm font-normal text-blue-600 px-3 py-1 bg-blue-200 rounded-full"
              >
                {{ employeeData.tasks?.length || 0 }}
              </span>
            </h2>
            <div
              v-if="employeeData.tasks && employeeData.tasks.length > 0"
              class="flex-grow overflow-y-auto max-h-64 space-y-3 pr-2"
            >
              <div
                v-for="task in employeeData.tasks"
                :key="task.id"
                class="bg-white p-3 rounded-md shadow-xs flex items-center"
              >
                <i class="ri-task-line text-green-500 text-lg mr-3"></i>
                <div>
                  <p
                    class="font-medium text-gray-800 tracking-wider capitalize"
                  >
                    {{ task.title }}
                  </p>
                  <p class="text-sm text-gray-600 mb-2">
                    Projet:
                    <NuxtLink
                      :to="`/projects/${task.project.id}`"
                      class="text-blue-500 hover:underline tracking-wider capitalize"
                    >
                      {{ task.project.title }}
                    </NuxtLink>
                  </p>
                  <p class="text-sm text-gray-500 mr-2">
                    Priorité:
                    <span
                      class="text-sm font-normal px-3 py-1 rounded-full"
                      :class="{
                        'text-red-500 bg-red-200': task.priority === 'HAUTE',
                        'text-yellow-600 bg-yellow-200':
                          task.priority === 'MOYENNE',
                        'text-blue-500 bg-blue-200': task.priority === 'BASSE',
                      }"
                      >{{ task.priority }}</span
                    >
                    | Statut:
                    <span
                      class="text-sm font-normal px-2 py-1 rounded-full mb-1"
                      :class="{
                        'text-green-600 bg-green-200':
                          task.status === 'TERMINE',
                        'text-orange-500 bg-orange-100':
                          task.status === 'EN_COURS',
                        'text-gray-500 bg-gray-200': task.status === 'A_FAIRE',
                        'text-red-500 bg-red-200': task.status === 'CANCELLED',
                      }"
                      >{{ task.status }}</span
                    >
                  </p>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 text-sm italic">
              Aucune tâche associée.
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
