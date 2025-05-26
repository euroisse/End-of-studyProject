<template>
  <div class="mb-6 flex flex-wrap justify-between items-center gap-4">
    <!-- Barre de recherche -->
    <div class="relative flex-grow max-w-md">
      <input
        type="text"
        :placeholder="searchPlaceholder"
        v-model="searchQuery"
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        @input="emitSearch"
      />
      <i
        class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      ></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps({
  searchPlaceholder: {
    type: String,
    default: "Rechercher une facture...",
  },
});

// État local
const searchQuery = ref("");

const emit = defineEmits(["search", "filterStatus", "sort"]);

const emitSearch = () => {
  emit("search", searchQuery.value);
};
</script>
