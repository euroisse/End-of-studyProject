<template>
  <div
    v-if="isOpen"
    class="fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto"
  >
    <div
      class="bg-white p-6 rounded-lg w-full max-w-[700px] shadow-lg max-h-[90vh]"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">Modifier la Tâche</h3>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="updateTask" class="p-6">
        <div class="mb-4 pt-2">
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Titre</label
          >
          <div class="mb-2">
            <input
              v-model="taskData.title"
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
            v-model="taskData.description"
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
            v-model="taskData.priority"
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
            v-model="taskData.status"
            class="w-full p-2 mb-2 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="A_FAIRE">À faire</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINE">Terminé</option>
          </select>
        </div>

        <div class="mb-4">
          <input
            type="number"
            v-model.number="taskData.effort"
            placeholder="Effort (optionnel)"
            class="w-full p-2 mb-2 border rounded-xl focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="closeModal"
            class="text-gray-600 hover:underline"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
  taskStore.setTaskToEditId(null); // Réinitialiser l'ID lors de la fermeture
}
</script>
