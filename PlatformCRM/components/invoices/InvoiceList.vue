<template>
    <div class="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Derniers devis</h2>
      <ul class="space-y-4">
        <li
          v-for="(invoice, index) in invoices"
          :key="index"
          class="flex justify-between items-center border-b pb-2 last:border-b-0"
        >
          <div>
            <p class="font-medium text-gray-700">#{{ invoice.number }} - {{ getClientName(invoice.number) }}</p>
            <p class="text-sm text-gray-500">{{ invoice.date }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-sm px-2 py-1 rounded-full"
              :class="invoice.paid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'"
            >
              {{ invoice.paid ? 'Validé' : 'En attente' }}
            </span>
            <i class="ri-arrow-right-s-line text-gray-400"></i>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    invoices: { number: string; date: string; amount: string; paid: boolean }[];
  }>();
  
  // 👇 Exemple de nom de client selon numéro
  const getClientName = (number: string) => {
    const clients: Record<string, string> = {
      '2025-042': 'Marie Dubois',
      '2025-041': 'Thomas Martin',
      '2025-040': 'Julie Bernard',
    };
    return clients[number] ?? 'Client inconnu';
  };
  </script>
  