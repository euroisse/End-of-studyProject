<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
    v-if="showModal"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600">
        <div class="flex justify-between items-center">
          <div class="text-xl font-semibold text-white">
            <h2 class="text-xl font-bold">Modifier le projet</h2>
          </div>

          <button
            @click="closeModal"
            class="text-blue-100 hover:text-white transition-colors duration-200"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>

      <form @submit.prevent="updateProjectInStore" class="p-6">
        <div class="space-y-6">
          <div>
            <label
              for="title"
              class="block text-sm font-medium mb-2 text-gray-700"
              >Titre</label
            >
            <div class="mb-4">
              <input
                id="title"
                v-model="formData.title"
                type="text"
                class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="EX: Renforce du site Web"
              />
            </div>
          </div>

          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Description</label
            >
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              class="w-full px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500"
              placeholder="Decrivez votre projet en quelques mots..."
            ></textarea>
          </div>

          <div>
            <label
              for="startDate"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Date de début</label
            >
            <input
              id="startDate"
              v-model="formData.startDate"
              type="date"
              class="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label
              for="endDate"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Date de fin</label
            >
            <input
              id="endDate"
              v-model="formData.endDate"
              type="date"
              class="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Enregistrement...</span>
            <span v-else>Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineEmits } from "vue";
import { useProjectStore } from "~/stores/projectStore";
import { format } from "date-fns";

const projectStore = useProjectStore();
const emit = defineEmits(["close", "project-updated"]);

const isSubmitting = ref(false);
const showModal = computed(() => projectStore.projectToEdit !== null);

const formData = ref({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
});

const projectToEdit = computed(() => projectStore.projectToEdit);

watch(
  projectToEdit,
  (newProject) => {
    if (newProject) {
      formData.value = {
        title: newProject.title || "",
        description: newProject.description || "",
        startDate: newProject.startDate
          ? formatDateForInput(newProject.startDate)
          : "",
        endDate: newProject.endDate
          ? formatDateForInput(newProject.endDate)
          : "",
      };
    } else {
      formData.value = {
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      };
    }
  },
  { immediate: true }
);

function formatDateForInput(date: Date | string): string {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  return format(dateObj, "yyyy-MM-dd");
}

const updateProjectInStore = async () => {
  if (!projectToEdit.value?.id) return;

  isSubmitting.value = true;

  try {
    await projectStore.updateProject(projectToEdit.value.id, formData.value);

    closeModal();
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du projet:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  projectStore.setSelectedProjectToEdit(null);
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 24px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
}
</style>
