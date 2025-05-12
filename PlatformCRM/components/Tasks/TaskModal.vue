<template>
  <div
    v-if="isOpen"
    class="fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto"
  >
    <div
      class="bg-white p-6 rounded-lg w-full max-w-[700px] shadow-lg max-h-[90vh]"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">Nouvelle Tâche</h3>
        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="submitTask" class="p-6">
        <div class="mb-4 pt-2">
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Titre</label
          >
          <div class="mb-2">
            <input
              v-model="title"
              placeholder="Titre"
              class="w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
        </div>

        <div class="mb-4">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >

          <textarea
            v-model="description"
            placeholder="Description"
            rows="4"
            class="w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div class="mb-4">
          <label
            for="priorité"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Priorité</label
          >
          <select
            v-model="priority"
            class="w-full p-2 mb-2 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="BASSE">Basse</option>
            <option value="MOYENNE">Moyenne</option>
            <option value="HAUTE">Haute</option>
          </select>
        </div>
        <div class="mb-4">
          <label
            for="statut"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Statut</label
          >
          <select
            v-model="status"
            class="w-full p-2 mb-2 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="A_FAIRE">À faire</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINE">Terminé</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Assigné à</label>
          <select
            v-model="employeeId"
            class="w-full border rounded-xl p-2 focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option disabled value="">-- Choisir un employé --</option>
            <option
              v-for="emp in employees"
              :key="emp.value"
              :value="emp.value"
            >
              {{ emp.label }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <input
            type="number"
            v-model.number="effort"
            placeholder="Effort (optionnel)"
            class="w-full p-2 mb-2 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div class="mb-4">
          <input
            hidden
            type="number"
            v-model.number="projectId"
            placeholder="ID du projet (optionnel)"
            class="w-full p-2 mb-4 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="text-gray-600 hover:underline"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEmployeeStore } from "~/stores/employeeStore";
import { useRoute } from "vue-router";

import type { SelectOptions, Task } from "~/types";

const emit = defineEmits(["close"]);
const route = useRoute();
const taskStore = useTaskStore();
const employeeStore = useEmployeeStore();
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const title = ref("");
const description = ref("");
const priority = ref<Task["priority"]>("MOYENNE");
const status = ref<Task["status"]>("A_FAIRE");
const effort = ref<number | null>(null);
const projectId = ref<number | null>(null);
const employeeId = ref<number | null>(null);

const employees = ref<SelectOptions[]>([]);
const newTask = ref({
  title: "",
  description: "",
  status: "A_FAIRE",
  priority: "MOYENNE",
  projectId: null,
  effort: null,
  employeeId: null,
});
onMounted(async () => {
  await employeeStore.fetchEmployees();
  employees.value = employeeStore.employees;

  projectId.value = route.params.id ? Number(route.params.id) : null;
});

async function submitTask() {
  const taskData = {
    title: title.value,
    description: description.value,
    priority: priority.value,
    status: status.value,
    effort: effort.value ?? undefined,
    projectId: projectId.value as number,
    employeeId: employeeId.value as number,
  };

  console.log("Task data:", taskData);

  await taskStore.createTask(taskData);

  title.value = "";
  description.value = "";
  priority.value = "MOYENNE";
  status.value = "A_FAIRE";
  effort.value = null;
  projectId.value = null;
  employeeId.value = null;

  emit("close");
}
</script>
