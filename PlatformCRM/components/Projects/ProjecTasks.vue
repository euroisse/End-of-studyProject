<template>
  <div class="min-h-screen transition-colors duration-300 bg-gray-50">
    <div class="p-4 flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-indigo-700">Tableau Kanban</h2>
      <button
        v-if="isAdmin"
        @click="isModalOpen = true"
        class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Ajouter une Tâche
      </button>
    </div>
    <div class="grid xl:flex gap-6 overflow-x-auto pb-4">
      <div
        v-for="col in columns"
        :key="col.status"
        class="flex-1 min-w-[300px] bg-white rounded-xl shadow-md p-4 border border-gray-200"
        @dragover.prevent
        @drop="onDrop(col.status)"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="font-bold text-lg" :class="col.color">{{
            col.label
          }}</span>
          <span class="text-xs text-gray-500"
            >{{ filteredTasks(col.status).length }} tâche(s)</span
          >
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="task in filteredTasks(col.status)"
            :key="task.id"
            class="bg-gray-50 border rounded-lg p-3 shadow-sm cursor-grab"
            draggable="true"
            @dragstart="onDragStart(task)"
          >
            <div class="flex justify-between items-center">
              <h4 class="text-base font-semibold text-gray-800">
                {{ task.title }}
              </h4>
              <span
                class="text-xs font-bold px-2 py-1 rounded-xl"
                :class="{
                  'bg-gray-200 text-gray-700': task.status === 'A_FAIRE',
                  'bg-yellow-200 text-yellow-700': task.status === 'EN_COURS',
                  'bg-green-200 text-green-700': task.status === 'TERMINE',
                }"
              >
                {{ task.status }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ task.description }}</p>
            <div class="flex flex-wrap gap-2 text-xs text-gray-500">
              <span
                class="font-bold text-xs px-2 py-1 rounded flex items-center gap-1"
              >
                Priorité:
                <span
                  :class="{
                    'text-red-700': task.priority === 'HAUTE',
                    'text-yellow-700': task.priority === 'MOYENNE',
                    'text-green-700': task.priority === 'BASSE',
                  }"
                  class="ml-1"
                >
                  {{ task.priority }}
                </span>
              </span>
              <span v-if="task.employee" class="mt-1"
                >👤 {{ task.employee.name }}</span
              >
              <span v-if="task.effort !== null" class="mt-1 ml-2"
                >Effort: {{ task.effort }} h</span
              >
            </div>

            <div class="relative">
              <button
                class="text-gray-400 hover:text-gray-700"
                @click.stop="toggleMenu(task.id)"
                type="button"
              >
                <i class="ri-more-2-fill text-lg"></i>
              </button>
              <div
                v-if="openedMenuId === task.id"
                class="absolute right-0 z-10 w-44 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-white"
                @click.stop
              >
                <div class="py-1">
                  <button
                    v-if="isAdmin"
                    class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="editTask(task.id)"
                  >
                    <i class="ri-pencil-line mr-2"></i> Éditer
                  </button>
                  <button
                    v-if="isAdmin"
                    class="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                    @click="prepareDeleteTask(task.id)"
                  >
                    <i class="ri-delete-bin-line mr-2"></i> Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Optionnel : bouton pour ajouter une colonne -->
    <!--
      <div class="flex items-center justify-center min-w-[200px]">
        <button class="text-indigo-600 hover:underline" @click="addColumn">+ Ajouter une colonne</button>
      </div>
      -->

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
import { onMounted, computed, ref } from "vue";
import type { Task, TaskStatus } from "~/types";
import TaskModal from "../Tasks/TaskModal.vue";
import { useProjectStore } from "~/stores/projectStore";
import { useIsRole } from "~/composables/useIsRole";

const props = defineProps<{ projectId: number }>();
const { isAdmin, isEmploye } = useIsRole();

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const projectStore = useProjectStore();
const project = computed(() => projectStore.selectedProject);

const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteConfirmationOpen = ref(false);
const taskToDeleteId = ref();

onMounted(() => {
  taskStore.fetchTasks();
});

const currentProjectTasks = computed(() => {
  return tasks.value.filter((task) => task.projectId === props.projectId);
});

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "A_FAIRE", label: "À Faire", color: "text-gray-700" },
  { status: "EN_COURS", label: "En Cours", color: "text-yellow-700" },
  { status: "TERMINE", label: "Terminé", color: "text-green-700" },
];

const filteredTasks = (status: Task["status"]) => {
  return currentProjectTasks.value.filter((task) => task.status === status);
};

const prepareDeleteTask = (taskId: number) => {
  taskToDeleteId.value = taskId;
  isDeleteConfirmationOpen.value = true;
};

const editTask = (taskId: number) => {
  taskStore.setTaskToEditId(taskId);
  isEditModalOpen.value = true;
};

// Drag & Drop
const draggedTask = ref<Task | null>(null);

function onDragStart(task: Task) {
  draggedTask.value = task;
}
function onDrop(newStatus: Task["status"]) {
  return async () => {
    if (draggedTask.value && draggedTask.value.status !== newStatus) {
      await updateTaskStatus(draggedTask.value.id, newStatus);
      draggedTask.value = null;
    }
  };
}

const updateTaskStatus = async (taskId: number, newStatus: Task["status"]) => {
  try {
    await taskStore.updateTaskStatus(taskId, newStatus);
    if (project.value && project.value.id) {
      await projectStore.fetchProject(project.value.id);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la tâche:",
      error
    );
  }
};
const openedMenuId = ref<number | null>(null);
function toggleMenu(taskId: number) {
  openedMenuId.value = openedMenuId.value === taskId ? null : taskId;
}
// Fermer le menu si on clique ailleurs
onMounted(() => {
  document.addEventListener("click", (e) => {
    openedMenuId.value = null;
  });
});
</script>

<style scoped>
/* Your existing styles */
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
