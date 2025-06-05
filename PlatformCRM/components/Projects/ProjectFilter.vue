<template>
  <div
    class="flex items-center gap-4 flex-shrink-0 h-12 border-b bg-white border-gray-200 mb-4"
  >
    <div class="relative grid flex-1 grid-cols-1 pl-8">
      <div class="grid flex-1 grid-cols-1">
        <input
          type="text"
          placeholder="Rechercher projet"
          class="col-start-1 row-start-1 block size-full pl-8 text-base outline-none placeholder:text-gray-400 sm:text-sm/6 bg-white text-gray-900 placeholder-gray-400"
          :value="searchQuery"
          @input="emitSearchQuery(($event.target as HTMLInputElement).value)"
        />
        <div
          class="pointer-events-none col-start-1 row-start-1 flex items-center pr-3"
        >
          <i class="ri-search-line size-5 text-gray-400"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

defineProps<{
  searchQuery: string;
}>();

const emit = defineEmits([
  "update:searchQuery",
  "filterByProgress",
  "filterByClient",
  "filterByDate",
]);

const emitSearchQuery = (value: string) => {
  emit("update:searchQuery", value);
};
</script>
