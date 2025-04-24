<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h4 class="text-base font-medium text-gray-900">{{ task.title }}</h4>
        <p class="text-sm text-gray-500 mt-1">{{ task.description }}</p>
      </div>
      <div :class="['px-2 py-1 rounded text-xs font-medium',
        task.priority === 'high' ? 'bg-red-100 text-red-800' :
        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800']">
        {{ getPriorityLabel(task.priority) }}
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center">
        <img :src="task.assignee.avatar" :alt="task.assignee.name"
          class="w-6 h-6 rounded-full object-cover"/>
        <span class="text-sm text-gray-500 ml-2">{{ task.assignee.name }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-500">
          <i class="mr-1 ri-calendar-line " />
          {{ formatDate(task.dueDate) }}
        </span>
        <select
          v-model="currentStatus"
          :class="['text-sm border-none cursor-pointer whitespace-nowrap  !rounded-button px-2 py-1',
            currentStatus === 'todo' ? 'bg-gray-100 text-gray-700' :
            currentStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800']"
          @change="handleStatusChange"
        >
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminé</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { format, parseISO } from 'date-fns';

interface Employee {
  id: number;
  name: string;
  avatar?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  assignee: Employee;
  status: string;
  priority: string;
  dueDate: string;
}

const props = defineProps<{
  task: Task
}>();

const emit = defineEmits<{
  'update:status': [id: number, status: string];
}>();

const currentStatus = ref(props.task.status);

watch(() => props.task.status, (newStatus) => {
  currentStatus.value = newStatus;
});

function handleStatusChange() {
  emit('update:status', props.task.id, currentStatus.value);
}

function getPriorityLabel(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute'
  };
  return priorityMap[priority] || priority;
}

function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy'); // Format the date as dd/MM/yyyy
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return the original string if formatting fails
  }
}
</script>

<style scoped>
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