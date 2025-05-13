<template>
  <div
    v-if="isOpen"
    class="fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h3 class="text-lg font-bold mb-4">Confirmer la Suppression</h3>
      <p class="mb-4">Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
      <div class="flex justify-between space-x-2">
        <button @click="emit('close')" class="text-gray-600 hover:underline">
          Annuler
        </button>
        <button
          @click="deleteTasks"
          class="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const taskStore = useTaskStore();
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  taskIdToDelete: {
    type: Number,
    default: null,
  },
});
const emit = defineEmits(["close"]);

const deleteTasks = async () => {
  if (props.taskIdToDelete !== null) {
    await taskStore.deleteTask(props.taskIdToDelete);
    emit("close");
  }
};
</script>
