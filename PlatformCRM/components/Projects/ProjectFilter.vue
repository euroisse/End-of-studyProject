<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6 md:mb-8">
    <div
      class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
    >
      <div class="flex-1 relative">
        <i
          class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></i>
        <input
          type="text"
          placeholder="Rechercher un projet..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          :value="searchQuery"
          @input="emitSearchQuery(($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex items-center space-x-2 sm:space-x-4">
        <button
          class="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 flex items-center space-x-2 whitespace-nowrap cursor-pointer !rounded-button text-sm"
          @click="toggleProgressFilter"
        >
          <i class="ri-bar-chart-line"></i>
          <span>Progression</span>
        </button>
        <button
          class="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 flex items-center space-x-2 whitespace-nowrap cursor-pointer !rounded-button text-sm"
          @click="toggleClientFilter"
        >
          <i class="ri-building-2-line"></i>
          <span>Client</span>
        </button>
        <button
          class="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 flex items-center space-x-2 whitespace-nowrap cursor-pointer !rounded-button text-sm"
          @click="toggleDateFilter"
        >
          <i class="ri-calendar-line"></i>
          <span>Date</span>
        </button>
      </div>
    </div>

    <!-- Filtre par progression -->
    <div
      v-if="showProgressFilter"
      class="mt-4 p-3 border border-gray-200 rounded-lg"
    >
      <h4 class="font-medium text-sm mb-2">Filtrer par progression</h4>
      <div class="flex space-x-3">
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="filters.progress.notStarted"
            class="mr-2"
          />
          <span>Non commencé (0%)</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="filters.progress.inProgress"
            class="mr-2"
          />
          <span>En cours (1-99%)</span>
        </label>
        <label class="flex items-center text-sm">
          <input
            type="checkbox"
            v-model="filters.progress.completed"
            class="mr-2"
          />
          <span>Terminé (100%)</span>
        </label>
      </div>
      <div class="flex justify-end mt-2">
        <button
          @click="applyProgressFilter"
          class="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm"
        >
          Appliquer
        </button>
      </div>
    </div>

    <!-- Filtre par client -->
    <div
      v-if="showClientFilter"
      class="mt-4 p-3 border border-gray-200 rounded-lg"
    >
      <h4 class="font-medium text-sm mb-2">Filtrer par client</h4>
      <select
        v-model="filters.clientId"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="">Tous les clients</option>
        <option
          v-for="client in clients"
          :key="client.value"
          :value="client.value"
        >
          {{ client.label }}
        </option>
      </select>
      <div class="flex justify-end mt-2">
        <button
          @click="applyClientFilter"
          class="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm"
        >
          Appliquer
        </button>
      </div>
    </div>

    <!-- Filtre par date -->
    <div
      v-if="showDateFilter"
      class="mt-4 p-3 border border-gray-200 rounded-lg"
    >
      <h4 class="font-medium text-sm mb-2">Filtrer par date</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs mb-1">Date de début</label>
          <input
            type="date"
            v-model="filters.date.startDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label class="block text-xs mb-1">Date de fin</label>
          <input
            type="date"
            v-model="filters.date.endDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
      <div class="flex justify-end mt-2">
        <button
          @click="applyDateFilter"
          class="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm"
        >
          Appliquer
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, reactive } from "vue";

defineProps<{
  searchQuery: string;
}>();

const emit = defineEmits([
  "update:searchQuery",
  "filterByProgress",
  "filterByClient",
  "filterByDate",
]);
interface Client {
  value: string;
  label: string;
}

const clients = ref<Client[]>([]);
const showProgressFilter = ref(false);
const showClientFilter = ref(false);
const showDateFilter = ref(false);

const filters = reactive({
  progress: {
    notStarted: false,
    inProgress: false,
    completed: false,
  },
  clientId: "",
  date: {
    startDate: "",
    endDate: "",
  },
});

const emitSearchQuery = (value: string) => {
  emit("update:searchQuery", value);
};

const toggleProgressFilter = () => {
  showProgressFilter.value = !showProgressFilter.value;
  if (showProgressFilter.value) {
    showClientFilter.value = false;
    showDateFilter.value = false;
  }
};

const toggleClientFilter = async () => {
  const data = await $fetch<Client[]>("/api/users/customers");
  clients.value = data;
  showClientFilter.value = !showClientFilter.value;
  if (showClientFilter.value) {
    showProgressFilter.value = false;
    showDateFilter.value = false;
  }
};

const toggleDateFilter = () => {
  showDateFilter.value = !showDateFilter.value;
  if (showDateFilter.value) {
    showProgressFilter.value = false;
    showClientFilter.value = false;
  }
};

const applyProgressFilter = () => {
  emit("filterByProgress", {
    notStarted: filters.progress.notStarted,
    inProgress: filters.progress.inProgress,
    completed: filters.progress.completed,
  });
  showProgressFilter.value = false;
};

const applyClientFilter = () => {
  emit("filterByClient", filters.clientId);
  showClientFilter.value = false;
};

const applyDateFilter = () => {
  emit("filterByDate", {
    startDate: filters.date.startDate,
    endDate: filters.date.endDate,
  });
  showDateFilter.value = false;
};
</script>
