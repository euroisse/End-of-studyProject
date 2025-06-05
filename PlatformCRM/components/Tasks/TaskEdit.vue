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
            <h3 class="text-xl font-bold text-white">Modifier la Tâche</h3>
          </div>

          <button
            @click="closeModal"
            class="text-blue-100 hover:text-white transition-colors duration-200"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>

      <form @submit.prevent="updateTask" class="p-6">
        <div class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700"
              >Titre</label
            >
          </div>

          <div class="mb-4">
            <input
              v-model="taskData.title"
              placeholder="Titre"
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
            v-model="taskData.description"
            placeholder="Description"
            rows="4"
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
              v-model="taskData.priority"
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
            class="block text-sm font-medium mb-2 text-gray-700"
            >Statut</label
          >
          <div class="mb-4">
            <select
              v-model="taskData.status"
              class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="A_FAIRE">À faire</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <input
            type="number"
            v-model.number="taskData.effort"
            placeholder="Effort (optionnel)"
            class="w-full p-2 mb-2 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="closeModal"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-300 px-4 py-2 text-base"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="rounded-md font-medium transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 px-4 py-2 text-base flex items-center justify-center gap-2"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useTaskStore } from "~/stores/taskStore";
import type { Task } from "~/types";
import { storeToRefs } from "pinia";

const emit = defineEmits(["close", "task-updated"]);
const taskStore = useTaskStore();
const { taskToEditId, tasks } = storeToRefs(taskStore);

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const taskData = ref<Partial<Task>>({
  title: "",
  description: "",
  priority: "MOYENNE",
  status: "A_FAIRE",
  effort: null,
});

watch(
  taskToEditId,
  (taskId) => {
    if (taskId) {
      const task = tasks.value.find((t) => t.id === taskId);
      if (task) {
        taskData.value = { ...task };
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  taskData.value = {
    title: "",
    description: "",
    priority: "MOYENNE",
    status: "A_FAIRE",
    effort: null,
  };
}
console.log("updateTask appelée", taskData.value);
async function updateTask() {
  console.log("taskToEditId:", taskToEditId.value);
  if (taskToEditId.value) {
    const payload = { ...taskData.value };
    delete payload.projectId;
    delete payload.employeeId;

    const updatedTask = await taskStore.updateTask(taskToEditId.value, payload);
    if (updatedTask) {
      emit("close");
      emit("task-updated", updatedTask);
      taskStore.setTaskToEditId(null);
    }
  }
}

function closeModal() {
  emit("close");
  taskStore.setTaskToEditId(null);
}
</script>
