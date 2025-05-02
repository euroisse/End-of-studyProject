<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">Factures</h2>
      <Button
        content="Voir tout"
        customClass="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer whitespace-nowrap"
      />
    </div>

    <div class="space-y-4">
      <div
        v-for="(invoice, index) in invoices"
        :key="index"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center">
          <i class="ri-bill-line text-indigo-600 mr-4"></i>
          <div>
            <h4 class="font-medium">{{ invoice.number }}</h4>
            <p class="text-sm text-gray-500">Échéance: {{ invoice.dueDate }}</p>
          </div>
        </div>
        <div class="flex items-center">
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="invoice.statusClass"
            >{{ invoice.status }}</span
          >
          <span class="ml-4 font-medium">{{ invoice.amount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "../iu/Button.vue";
defineProps<{
  invoices: {
    number: string;
    dueDate: string;
    status: string;
    statusClass: string;
    amount: string;
  }[];
}>();
</script>

<style scoped></style>
