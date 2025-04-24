<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center">
            <div v-if="client.avatar" class="w-10 h-10 rounded-full mr-3 overflow-hidden">
              <img :src="client.avatar" :alt="client.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-gray-500">
              <i class="ri-user-line text-xl"></i>
            </div>
            <div>
              <h4 class="text-base font-medium text-gray-900">{{ client.name }}</h4>
              <p class="text-sm text-gray-500">{{ client.email }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              client.status === 'active' ? 'bg-green-100 text-green-800' :
              client.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
              'bg-yellow-100 text-yellow-800',
            ]"
          >
            {{ getClientStatusLabel(client.status) }}
          </div>
          <button @click="$emit('edit', client)" class="text-gray-400 hover:text-gray-600">
            <i class="ri-edit-line"></i>
          </button>
          <button @click="showConfirm = true" class="text-gray-400 hover:text-red-600">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
  
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">
            <i class="ri-folder-line mr-1 hover:text-gray-800"></i>
            {{ client.projectCount }} projets
          </span>
          <span class="text-sm text-gray-500">
            <i class="ri-time-line mr-1 hover:text-gray-800"></i>
            {{ formatJoinDate(client.joinDate) }}
          </span>
        </div>
      </div>
  
      <ClientsConfirmModal
        :visible="showConfirm"
        message="Êtes-vous sûr de vouloir supprimer ce client ?"
        @confirm="confirmDelete"
        @cancel="showConfirm = false"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { format, parseISO, isToday, isYesterday } from 'date-fns';
  import { fr } from 'date-fns/locale'; 
  
  interface Client {
    id: number;
    name: string;
    email: string;
    status: string;
    projectCount: number;
    joinDate: string;
    avatar?: string;
  }
  
  const props = defineProps<{
    client: Client;
  }>();
  
  const emit = defineEmits(['edit', 'delete']);
  const { client } = props;
  const showConfirm = ref(false);
  
  const confirmDelete = () => {
    showConfirm.value = false;
    emit('delete', client.id);
  };
  
  const getClientStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'Actif',
      pending: 'En attente',
      inactive: 'Inactif',
    };
    return statusMap[status] || status;
  };
  
  const formatJoinDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) {
        return 'Client créé aujourd\'hui';
      } else if (isYesterday(date)) {
        return 'Client créé hier';
      } else {
        return `Client depuis le ${format(date, 'd MMMM yyyy', { locale: fr })}`;
      }
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date Invalide';
    }
  };
  </script>