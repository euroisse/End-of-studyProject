import { defineStore } from 'pinia';
import type { Task, State } from '~/types/';

export const useTaskStore = defineStore('task', {
  state: (): State => ({
    tasks: [],
    selectedTaskIds: [],
    selectedProjectId: null, 
    assignedEmployeeId: null,
    taskStatuses: [
      { label: 'To Do', value: 'A_FAIRE' },
      { label: 'In Progress', value: 'EN_COURS' },
      { label: 'Completed', value: 'TERMINE' },
    ],
    taskPriorities: [
      { label: 'Low', value: 'BASSE' },
      { label: 'Medium', value: 'MOYENNE' },
      { label: 'High', value: 'HAUTE' },
    ],
    
   
  }),
  actions: {
    async fetchTasks() {
        const response = await $fetch<Task[]>('/api/Tasks/tasks');
        this.tasks = response;
      
    },
    setTasks(newTasks: Task[]) {
      this.tasks = newTasks;
    },
    toggleSelectedTask(taskId: number) {
      if (this.selectedTaskIds.includes(taskId)) {
        this.selectedTaskIds = this.selectedTaskIds.filter((id) => id !== taskId);
      } else {
        this.selectedTaskIds.push(taskId);
      }
    },
    setSelectedProject(projectId: number | null) {
      this.selectedProjectId = projectId;
    },
    setAssignedEmployee(employeeId: number | null) {
      this.assignedEmployeeId = employeeId;
    },
    
    async createTask(taskData: Omit<Task, 'id' | 'employee' | 'project'> & { projectId?: number; employeeId?: number }) {
      
      
        const response = await $fetch<Task>('/api/Tasks/tasks', {
          method: 'POST',
          body: taskData,
        });
         this.tasks.push(response)
     
    },
  },

});