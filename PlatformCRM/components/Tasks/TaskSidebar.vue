<template>
  <aside class="w-80 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">Gestion des tâches</h1>
    </div>

    <div class="p-4 border-b border-gray-200">
      <div class="space-y-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher une tâche..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <i 
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ri-search-line"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Grouper par</label
          >
          <div class="flex gap-2">
            <button
              @click="updateGroupBy('project')"
              :class="[
                'px-3 py-1 text-sm cursor-pointer whitespace-nowrap !rounded-button rounded-sm hover:bg-blue-700 hover:text-white',
                groupBy === 'project'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              Projet
            </button>
            <button
              @click="updateGroupBy('employee')"
              :class="[
                'px-3 py-1 text-sm cursor-pointer whitespace-nowrap !rounded-button hover:bg-blue-700 rounded-sm hover:text-white',
                groupBy === 'employee'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              Employé
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Statut</label
          >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in statuses"
              :key="status.value"
              @click="toggleStatus(status.value)"
              :class="[
                'px-3 py-1 text-sm cursor-pointer whitespace-nowrap !rounded-button hover:bg-blue-700 rounded-sm hover:text-white',
                selectedStatuses.includes(status.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Priorité</label
          >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="priority in priorities"
              :key="priority.value"
              @click="togglePriority(priority.value)"
              :class="[
                'px-3 py-1 text-sm cursor-pointer whitespace-nowrap !rounded-button hover:bg-blue-700 rounded-sm hover:text-white',
                selectedPriorities.includes(priority.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ priority.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const statuses = [
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminé" },
];

const priorities = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
];

const searchQuery = ref("");
const groupBy = ref<"project" | "employee">("project");
const selectedStatuses = ref<string[]>(["todo", "in_progress", "done"]);
const selectedPriorities = ref<string[]>(["low", "medium", "high"]);

// Emitted to parent
const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:groupBy": [value: "project" | "employee"];
  "update:selectedStatuses": [value: string[]];
  "update:selectedPriorities": [value: string[]];
}>();

// Watch for changes and emit to parent
watch(searchQuery, (newVal) => {
  emit("update:searchQuery", newVal);
});

function updateGroupBy(value: "project" | "employee") {
  groupBy.value = value;
  emit("update:groupBy", value);
}

function toggleStatus(status: string) {
  const index = selectedStatuses.value.indexOf(status);
  if (index === -1) {
    selectedStatuses.value.push(status);
  } else {
    selectedStatuses.value.splice(index, 1);
  }
  emit("update:selectedStatuses", [...selectedStatuses.value]);
}

function togglePriority(priority: string) {
  const index = selectedPriorities.value.indexOf(priority);
  if (index === -1) {
    selectedPriorities.value.push(priority);
  } else {
    selectedPriorities.value.splice(index, 1);
  }
  emit("update:selectedPriorities", [...selectedPriorities.value]);
}
</script>
