<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">{{ isEditing ? 'Modifier le client' : 'Nouveau client' }}</h3>
          <button @click="$emit('close',client)" class="text-gray-400 hover:text-gray-500">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              v-model="formData.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              v-model="formData.email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              required
            >
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de projets</label>
            <input
              type="number"
              v-model="formData.projectCount"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date d'inscription</label>
            <input
              type="date"
              :value="formatDateForInput(formData.joinDate)"
              @input="formData.joinDate = parseDateFromInput(($event.target as HTMLInputElement).value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              {{ isEditing ? 'Mettre à jour' : 'Créer le client' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { format, parseISO } from 'date-fns';
  
  interface Client {
    id?: number;
    name: string;
    email: string;
    status: string;
    projectCount: number;
    joinDate: string;
    avatar?: string ;
   
  }
  
  const props = defineProps<{
    show: boolean;
    client?: Client;
    isEditing: boolean;
  }>();
  
  const emit = defineEmits(['close', 'save'])
  
  const defaultFormData = {
    name: '',
    email: '',
    status: 'active',
    projectCount: 0,
    joinDate: format(new Date(), 'yyyy-MM-dd'), 
  };
  
  const formData = ref<Client>({ ...defaultFormData });
  
  watch(
    () => props.client,
    (newClient) => {
      if (newClient) {
        formData.value = { ...newClient };
      } else {
        formData.value = { ...defaultFormData };
      }
    },
    { immediate: true }
  );
  
  const submitForm = () => {
    emit('save', formData.value);
  };
  
  const formatDateForInput = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return '';
    }
  };
  
  const parseDateFromInput = (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error parsing date from input:', error);
      return new Date().toISOString().split('T')[0]; 
    }
  };
  </script>
  
  <style scoped>
  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.5em 1.5em;
  }
  </style>