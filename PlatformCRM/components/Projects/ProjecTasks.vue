<template>
  <div class="min-h-screen transition-colors duration-300 bg-gray-50">
    <div class="p-4 transition-spacing duration-300">
      <div class="flex justify-between items-center mb-8">
        <div>
          <div class="flex items-center space-x-2 text-sm">
            <span class="text-gray-500 pb-2">Projets /</span>
            <h2 v-if="isAdmin" class="text-2xl font-bold text-gray-800">
              Gestion des Tâches
            </h2>
            <h2 v-if="isEmploye" class="text-2xl font-bold text-gray-800">
              Mes Tâches
            </h2>
          </div>
        </div>
        <div>
          <button
            v-if="isAdmin"
            @click="isModalOpen = true"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ajouter une Tâche
          </button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 my-8">
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-lg bg-blue-500/10">
            <i class="ri-file-text-line text-blue-500"></i>
          </div>
          <span class="text-sm text-gray-500">Tous les statuts</span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Toutes les tâches combinées</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">
            {{ tasks.length }}
          </p>
        </div>
      </div>
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div
            class="p-3 rounded-lg"
            :class="{
              'bg-gray-200': filteredTasks('A_FAIRE').length === 0,
              'bg-gray-500/10': filteredTasks('A_FAIRE').length > 0,
            }"
          >
            <i
              class="ri-time-line w-6 h-6"
              :class="{
                'text-gray-400': filteredTasks('A_FAIRE').length === 0,
                'text-gray-700': filteredTasks('A_FAIRE').length > 0,
              }"
            ></i>
          </div>
          <span class="text-sm text-gray-500"> Statut(To Do) </span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Tâches à Faire</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">
            {{ filteredTasks("A_FAIRE").length }}
          </p>
        </div>
      </div>
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div
            class="p-3 rounded-lg"
            :class="{
              'bg-gray-200': filteredTasks('EN_COURS').length === 0,
              'bg-yellow-500/10': filteredTasks('EN_COURS').length > 0,
            }"
          >
            <i
              class="ri-hourglass-fill"
              :class="{
                'text-gray-400': filteredTasks('EN_COURS').length === 0,
                'text-yellow-800': filteredTasks('EN_COURS').length > 0,
              }"
            ></i>
          </div>
          <span class="text-sm text-gray-500"> Statut(In Progress) </span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Tâches En Cours</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">
            {{ filteredTasks("EN_COURS").length }}
          </p>
        </div>
      </div>
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div
            class="p-3 rounded-lg"
            :class="{
              'bg-gray-200': filteredTasks('TERMINE').length === 0,
              'bg-green-500/10': filteredTasks('TERMINE').length > 0,
            }"
          >
            <i
              class="w-6 h-6 ri-check-line"
              :class="{
                'text-gray-400': filteredTasks('TERMINE').length === 0,
                'text-green-800': filteredTasks('TERMINE').length > 0,
              }"
            ></i>
          </div>
          <span class="text-sm text-gray-500"> Statut(Completed) </span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Tâches Terminées</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">
            {{ filteredTasks("TERMINE").length }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 my-8"
    ></div>

    <div v-if="tasksByProject.length > 0" class="mt-8 space-y-6">
      <div v-for="projectGroup in tasksByProject" :key="projectGroup.projectId">
        <h2
          v-if="isEmploye"
          class="text-xl font-semibold text-gray-800 mb-4 capitalize"
        >
          {{
            projectGroup.projectName || `Projet ID: ${projectGroup.projectId}`
          }}
        </h2>
        <div
          class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6"
        >
          <div
            v-for="task in projectGroup.tasks"
            :key="task.id"
            class="bg-white w-full rounded-xl shadow-md p-4 flex justify-between items-start"
          >
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2 capitalize">
                {{ task.title }}
              </h4>
              <p class="text-sm text-gray-600 mb-2 capitalize">
                {{ task.description }}
              </p>
              <div class="flex items-center text-sm mb-2">
                <span class="mr-4">
                  Priorité :
                  <strong
                    :class="{
                      'text-red-500': task.priority === 'HAUTE',
                      'text-yellow-500': task.priority === 'MOYENNE',
                      'text-green-500': task.priority === 'BASSE',
                    }"
                    >{{ task.priority }}</strong
                  >
                </span>
                <span v-if="task.effort !== null" class="mr-4">
                  Effort : <strong>{{ task.effort }} h</strong></span
                >
                <span v-if="task.employee">
                  Assigné à :
                  <strong> 👤 {{ task.employee.name }}</strong></span
                >
              </div>
              <div class="text-xs text-gray-500">
                ID du Projet : {{ task.projectId }}
              </div>
              <div class="mt-2">
                <span
                  class="inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-full"
                  :class="[
                    task.status === 'A_FAIRE'
                      ? 'bg-gray-200 text-gray-700'
                      : '',
                    task.status === 'EN_COURS'
                      ? 'bg-yellow-200 text-yellow-700'
                      : '',
                    task.status === 'TERMINE'
                      ? 'bg-green-200 text-green-700'
                      : '',
                  ]"
                >
                  {{ task.status }}
                </span>
                <select
                  v-if="isEmploye"
                  v-model="task.status"
                  @change="updateTaskStatus(task.id, task.status)"
                  class="ml-4 text-sm rounded-md border-gray-300 bg-white px-3 py-2 shadow-md focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="A_FAIRE">À Faire</option>
                  <option value="EN_COURS">En Cours</option>
                  <option value="TERMINE">Terminé</option>
                </select>
              </div>
            </div>
            <div v-if="isAdmin" class="flex flex-col items-end">
              <button
                class="text-gray-400 hover:text-blue-600 focus:outline-none"
                @click="
                  taskStore.setTaskToEditId(task.id);
                  isEditModalOpen = true;
                "
              >
                <i class="ri-pencil-line"></i>
              </button>
              <button
                class="text-gray-400 hover:text-red-600 focus:outline-none"
                @click="prepareDeleteTask(task.id)"
              >
                <i class="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TaskModal :is-open="isModalOpen" @close="isModalOpen = false" />
    <TasksTaskEdit
      :is-open="isEditModalOpen"
      @close="isEditModalOpen = false"
    />
    <TasksDeleteTasks
      :is-open="isDeleteConfirmationOpen"
      @close="isDeleteConfirmationOpen = false"
      :task-id-to-delete="taskToDeleteId"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "#imports";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import type { Task } from "~/types";
import TaskModal from "../Tasks/TaskModal.vue";
const { isAdmin, isEmploye } = useIsRole();

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteConfirmationOpen = ref(false);
const taskToDeleteId = ref();
onMounted((taskId: number) => {
  taskStore.fetchTasks();
  taskStore.setTaskToEditId(taskId);
});
const getProjectName = (projectId: number): string | undefined => {
  //  faire une recherche dans une liste de projets.
  const task = tasks.value.find(
    (t) => t.projectId === projectId && t.project?.title
  );
  return task?.project?.title;
};
const tasksByProject = computed(() => {
  const groupedTasks: { [projectId: number]: Task[] } = {};
  tasks.value.forEach((task) => {
    if (!groupedTasks[task.projectId]) {
      groupedTasks[task.projectId] = [];
    }
    groupedTasks[task.projectId].push(task);
  });

  // Convertir l'objet en tableau pour pouvoir itérer dans la template
  return Object.entries(groupedTasks).map(([projectId, projectTasks]) => ({
    projectId: parseInt(projectId),
    projectName: getProjectName(parseInt(projectId)),
    tasks: projectTasks,
  }));
});
const filteredTasks = (status: Task["status"]) => {
  return tasks.value.filter((task) => task.status === status);
};
const prepareDeleteTask = (taskId: number) => {
  taskToDeleteId.value = taskId;
  isDeleteConfirmationOpen.value = true;
};
const updateTaskStatus = async (taskId: number, newStatus: Task["status"]) => {
  try {
    await taskStore.updateTaskStatus(taskId, newStatus);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la tâche:",
      error
    );
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.15s ease-in-out;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.text-gray-700 {
  color: #4b5563;
}

.bg-yellow-200 {
  background-color: #fef08a;
}

.text-yellow-700 {
  color: #a16207;
}

.bg-green-200 {
  background-color: #dcfce7;
}

.text-green-700 {
  color: #16a34a;
}
</style>
