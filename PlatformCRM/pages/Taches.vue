<template>
  <div class="min-h-screen bg-gray-50 flex container">
    <TasksTaskSidebar
      @update:search-query="searchQuery = $event"
      @update:group-by="groupBy = $event"
      @update:selected-statuses="selectedStatuses = $event"
      @update:selected-priorities="selectedPriorities = $event"
    />

    <main class="flex-1 flex flex-col">
      <header class="bg-white border-b border-gray-200 p-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{
              groupBy === "project" ? "Tâches par projet" : "Tâches par employé"
            }}
          </h2>
          <button
            @click="showNewTaskModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 cursor-pointer whitespace-nowrap !rounded-button rounded-md flex items-center"
          >
            <i class="mr-2 ri-add-line" />
            Nouvelle tâche
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6">
        <div v-for="group in filteredGroups" :key="group.id" class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              <div
                v-if="group.avatar"
                class="w-10 h-10 rounded-full mr-3 overflow-hidden"
              >
                <img
                  :src="group.avatar"
                  :alt="group.name"
                  class="w-8 h-8 rounded-full mr-2 object-cover"
                />
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <i class="ri-user-line text-xl"></i>
              </div>
              {{ group.name }}
            </h3>
            <span class="text-sm text-gray-500"
              >{{ group.taskCount }} tâches</span
            >
          </div>

          <div class="grid gap-4">
            <TasksTaskItem
              v-for="task in group.tasks"
              :key="task.id"
              :task="task"
              @update:status="updateTaskStatus"
            />
          </div>
        </div>
      </div>
    </main>

    <TasksTaskModal
      :show="showNewTaskModal"
      :projects="projects"
      :employees="employees"
      @close="showNewTaskModal = false"
      @create-task="createTask"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
definePageMeta({ layout: "admin" });

// Types
interface Project {
  id: number;
  name: string;
  avatar?: string;
}

interface Employee {
  id: number;
  name: string;
  avatar?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  assignee: Employee;
  status: string;
  priority: string;
  dueDate: string;
}

interface NewTaskData {
  title: string;
  description: string;
  projectId: number | "";
  assigneeId: number | "";
  priority: string;
  dueDate: string;
}

// State
const searchQuery = ref("");
const groupBy = ref<"project" | "employee">("project");
const selectedStatuses = ref<string[]>(["todo", "in_progress", "done"]);
const selectedPriorities = ref<string[]>(["low", "medium", "high"]);
const showNewTaskModal = ref(false);

// Data
const projects = ref<Project[]>([
  {
    id: 1,
    name: "Refonte Site Web",
    avatar: "",
  },
  {
    id: 2,
    name: "Application Mobile",
    avatar: "",
  },
]);

const employees = ref<Employee[]>([
  {
    id: 1,
    name: "Sophie Martin",
    avatar: "",
  },
  {
    id: 2,
    name: "Thomas Bernard",
    avatar: "",
  },
]);

const tasks = ref<Task[]>([
  {
    id: 1,
    title: "Maquettes Homepage",
    description: "Créer les maquettes pour la nouvelle homepage du site",
    projectId: 1,
    assignee: employees.value[0],
    status: "in_progress",
    priority: "high",
    dueDate: "2025-04-25",
  },
  {
    id: 2,
    title: "API Authentication",
    description: "Implémenter l'authentification JWT pour l'API",
    projectId: 2,
    assignee: employees.value[1],
    status: "todo",
    priority: "medium",
    dueDate: "2025-04-28",
  },
]);

// Computed Properties
const filteredGroups = computed(() => {
  const groups = groupBy.value === "project" ? projects.value : employees.value;

  return groups.map((group) => {
    const groupTasks = tasks.value.filter(
      (task) =>
        (groupBy.value === "project" ? task.projectId : task.assignee.id) ===
          group.id &&
        selectedStatuses.value.includes(task.status) &&
        selectedPriorities.value.includes(task.priority) &&
        (task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          task.description
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()))
    );

    return {
      ...group,
      tasks: groupTasks,
      taskCount: groupTasks.length,
    };
  });
});

// Methods
function updateTaskStatus(id: number, status: string) {
  const taskIndex = tasks.value.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks.value[taskIndex].status = status;
  }
}

function createTask(newTaskData: NewTaskData) {
  const assignee = employees.value.find(
    (emp) => emp.id === newTaskData.assigneeId
  );
  if (!assignee) return;

  tasks.value.push({
    id: tasks.value.length + 1,
    title: newTaskData.title,
    description: newTaskData.description,
    projectId: newTaskData.projectId as number,
    assignee,
    status: "todo",
    priority: newTaskData.priority,
    dueDate: newTaskData.dueDate,
  });
}
</script>
