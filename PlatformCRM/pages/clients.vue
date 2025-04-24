<template>
  <div class="min-h-screen bg-gray-50 flex">
    <ClientsClientSideBar
      :searchQuery="searchQuery"
      :selectedClientStatuses="selectedClientStatuses"
      :selectedProjectRanges="selectedProjectRanges"
      :clientStatuses="clientStatuses"
      :projectRanges="projectRanges"
      @update:searchQuery="searchQuery = $event"
      @toggleClientStatus="toggleClientStatus"
      @toggleProjectRange="toggleProjectRange"
    />

    <main class="flex-1 flex flex-col">
      <header class="bg-white border-b border-gray-200 p-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">Liste des clients</h2>
          <button
            @click="openNewClientModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 cursor-pointer whitespace-nowrap rounded-md flex items-center"
          >
            <i class="ri-add-line mr-2"></i>
            Nouveau client
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6">
        <div class="grid gap-4">
          <ClientsClientCard
            v-for="client in filteredClients"
            :key="client.id"
            :client="client"
            @edit="editClient"
            @delete="deleteClient"
          />
        </div>
      </div>
    </main>

    <ClientsClientModal
      :show="showClientModal"
      :client="currentClient"
      :isEditing="isEditing"
      @close="closeClientModal"
      @save="saveClient"
    />
  </div>
</template>

<script lang="ts" setup>
import { ClientsClientSideBar } from '#components';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
definePageMeta({ layout: 'admin' });
// State
const searchQuery = useStorage('searchQuery', '');
const showClientModal = ref(false);
const isEditing = ref(false);
const currentClient = ref<Client | null>(null);
const selectedClientStatuses = useStorage('selectedClientStatuses', ['active', 'pending', 'inactive']);
const selectedProjectRanges = useStorage('selectedProjectRanges', ['0-5', '6-10', '10+']);

// Constants
const clientStatuses = [
  { value: 'active', label: 'Actif' },
  { value: 'pending', label: 'En attente' },
  { value: 'inactive', label: 'Inactif' },
];

const projectRanges = [
  { value: '0-5', label: '0-5 projets' },
  { value: '6-10', label: '6-10 projets' },
  { value: '10+', label: '10+ projets' },
];

interface Client {
  id: number;
  name: string;
  email: string;
  status: string;
  projectCount: number;
  joinDate: string;
  avatar?: string;
}


const clients = useStorage<Client[]>('clients', [
  {
    id: 1,
    name: 'Entreprise ABC',
    email: 'contact@abc.com',
    status: 'active',
    projectCount: 8,
    joinDate: '2024-01-15',
    avatar:
      '',
  },
  {
    id: 2,
    name: 'Studio Design XYZ',
    email: 'hello@xyz-design.com',
    status: 'pending',
    projectCount: 3,
    joinDate: '2025-02-01',
    avatar:''
      ,
  },
]);

// Computed
const filteredClients = computed(() => {
  return clients.value.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus = selectedClientStatuses.value.includes(client.status);

    const matchesProjects = selectedProjectRanges.value.some((range) => {
      if (range === '0-5') return client.projectCount <= 5;
      if (range === '6-10') return client.projectCount > 5 && client.projectCount <= 10;
      return client.projectCount > 10;
    });

    return matchesSearch && matchesStatus && matchesProjects;
  });
});

// Methods
const toggleClientStatus = (status: string) => {
  const index = selectedClientStatuses.value.indexOf(status);
  if (index === -1) {
    selectedClientStatuses.value.push(status);
  } else {
    selectedClientStatuses.value.splice(index, 1);
  }
};

const toggleProjectRange = (range: string) => {
  const index = selectedProjectRanges.value.indexOf(range);
  if (index === -1) {
    selectedProjectRanges.value.push(range);
  } else {
    selectedProjectRanges.value.splice(index, 1);
  }
};

const openNewClientModal = () => {
  currentClient.value = null;
  isEditing.value = false;
  showClientModal.value = true;
};

const editClient = (client: Client) => {
  currentClient.value = { ...client };
  isEditing.value = true;
  showClientModal.value = true;
};

const closeClientModal = () => {
  showClientModal.value = false;
  currentClient.value = null;
};

const saveClient = (client: Client) => {
  if (isEditing.value) {
    const index = clients.value.findIndex((c) => c.id === client.id);
    if (index !== -1) {
      
      clients.value = clients.value.map((c) => (c.id === client.id ? client : c));
    }
  } else {
    const newId = clients.value.length > 0 ? Math.max(...clients.value.map((c) => c.id)) + 1 : 1;
    clients.value.push({ ...client, id: newId });
  }
  showClientModal.value = false;
};

const deleteClient = (clientId: number) => {
  clients.value = clients.value.filter((c) => c.id !== clientId);
};
</script>