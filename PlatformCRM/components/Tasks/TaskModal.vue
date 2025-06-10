<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <h3 class="text-xl font-semibold text-white">Nouvelle Tâche</h3>
          </div>

          <button
            @click="emit('close')"
            class="text-blue-100 hover:text-white transition-colors duration-200"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>

      <form @submit.prevent="submitTask" class="p-6">
        <div class="space-y-6">
          <div>
            <label
              for="title"
              class="block text-sm font-medium mb-2 text-gray-700"
              >Titre</label
            >
          </div>

          <div class="mb-4">
            <input
              v-model="title"
              placeholder="Entrez un titre"
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium mb-2 text-gray-700"
            >Description</label
          >

          <textarea
            v-model="description"
            placeholder="Decrivez votre tâche en quelques mots..."
            rows="6"
            class="w-full px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            for="priorité"
            class="block text-sm font-medium mb-2 text-gray-700"
            >Priorité</label
          >
          <div class="mb-4">
            <select
              v-model="priority"
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BASSE">Basse</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="HAUTE">Haute</option>
            </select>
          </div>
        </div>
        <div>
          <label
            for="statut"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Statut</label
          >
          <div class="mb-4">
            <select
              v-model="status"
              class="w-full p-2 mb-2 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="A_FAIRE">À faire</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Assigné à</label>
          <div class="mb-4">
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
        </div>
        <div class="mb-4">
          <input
            type="number"
            v-model.number="effort"
            placeholder="Effort (optionnel)"
            class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="mb-4">
          <input
            hidden
            type="number"
            v-model.number="projectId"
            placeholder="ID du projet (optionnel)"
            class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-300 px-4 py-2 text-base"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 px-4 py-2 text-base flex items-center justify-center gap-2"
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

onMounted(async () => {
  await employeeStore.fetchEmployees();
  employees.value = employeeStore.employees;

  projectId.value = route.params.id ? Number(route.params.id) : null;

  submitTask;
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
