<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm""
    v-if="props.show"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-xl w-full p-0 transform transition-all bg-white"
    >
      <div class="p-6 rounded-t-2xl bg-blue-600 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-white">Modifier l'employé</h2>
        <button
          @click="close"
          class="text-gray-100 hover:text-gray-300"
          aria-label="Fermer"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
      <form @submit.prevent="submitEdit" class="p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700"
              >Nom</label
            >

            <div class="mb-4">
              <input
                v-model="form.name"
                class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-gray-700 text-sm mb-2">Poste</label>
            <div class="mb-4">
              <input
                v-model="form.post"
                class="w-full px-3 py-2 z-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>
        <div v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</div>
        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            @click="close"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

const props = defineProps<{
  show: boolean;
  employee: { id: number; name: string; post: string } | null;
}>();
const emit = defineEmits(["close", "updated"]);

const form = ref({ name: "", post: "" });
const error = ref("");

watch(
  () => props.employee,
  (emp) => {
    if (emp) {
      form.value.name = emp.name;
      form.value.post = emp.post || "";
    }
  },
  { immediate: true }
);

const close = () => emit("close");

const submitEdit = async () => {
  error.value = "";
  try {
    const res = await $fetch(`/api/users/employee/${props.employee?.id}`, {
      method: "PUT",
      body: { name: form.value.name, post: form.value.post },
    });
    emit("updated");
    close();
  } catch (e: any) {
    error.value = e?.data?.message || "Erreur lors de la mise à jour";
  }
};
</script>
