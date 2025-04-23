<!-- components/TaskModal.vue -->
<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Nouvelle tâche</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <i class="ri-close-line"  />
          </button>
        </div>
  
        <form @submit.prevent="createTask" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input 
              type="text"
              v-model="taskData.title"
              class="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="taskData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Projet</label>
              <select 
                v-model="taskData.projectId"
                class="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
              <select 
                v-model="taskData.assigneeId"
                class="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                  {{ employee.name }}
                </option>
              </select>
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
              <input 
                type="date"
                v-model="taskData.dueDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select 
                v-model="taskData.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>
  
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-button hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            >
              Annuler
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Créer la tâche
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive } from 'vue';
  
  interface Project {
    id: number;
    name: string;
    avatar: string;
  }
  
  interface Employee {
    id: number;
    name: string;
    avatar: string;
  }
  
  interface NewTaskData {
    title: string;
    description: string;
    projectId: number | '';
    assigneeId: number | '';
    priority: string;
    dueDate: string;
  }
  
   defineProps<{
    show: boolean;
    projects: Project[];
    employees: Employee[];
  }>();
  
  const emit = defineEmits<{
    'close': [];
    'create-task': [task: NewTaskData];
  }>();
  
  const taskData = reactive<NewTaskData>({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    priority: 'medium',
    dueDate: '',
  });
  
  function closeModal() {
    // Reset form data
    Object.assign(taskData, {
      title: '',
      description: '',
      projectId: '',
      assigneeId: '',
      priority: 'medium',
      dueDate: '',
    });
    emit('close');
  }
  
  function createTask() {
    if (taskData.title && taskData.projectId && taskData.assigneeId && taskData.dueDate) {
      emit('create-task', {...taskData});
      closeModal();
    }
  }
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
    padding-right: 2.5rem;
  }
  </style>