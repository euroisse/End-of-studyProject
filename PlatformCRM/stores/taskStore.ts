import { defineStore } from 'pinia';
import type { Task, State, TaskUpdatePayload } from '~/types/';

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
    taskToEditId: null,
    taskBeingEdited: null,
    
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
    setTaskToEditId(taskId: number | null) {
      this.taskToEditId = taskId;
      this.taskBeingEdited = this.tasks.find(task => task.id === taskId) || null;
    },
 
    async createTask(taskData: Omit<Task, 'id' | 'employee' | 'project'> & { projectId?: number; employeeId?: number }) {
      const response = await $fetch<Task>('/api/Tasks/tasks', {
        method: 'POST',
        body: taskData,
      });
      this.tasks.push(response);
    },
    async updateTask(taskId: number, payload: TaskUpdatePayload): Promise<Task | null> {
      try {
        const response = await $fetch<Task>(`/api/Tasks/${taskId}`, {
          method: 'PATCH',
          body: payload
        });
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...response };
        }
        return response;
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche", error);
        return null;
      }
    },
     async deleteTask(taskId: number): Promise<void> {
      try {
      await $fetch(`/api/Tasks/${taskId}`, {
          method: 'DELETE',
        });
        this.tasks = this.tasks.filter(task => task.id !== taskId);
       
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche", error);
      }
    },

     async updateTaskStatus(taskId: number, newStatus: Task['status']) {
      try {
        const response = await $fetch<Task>(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].status = newStatus;
        }
        return response
      } catch (error: any) {
        console.error('Erreur lors de la mise à jour du statut de la tâche:', error.message);
        throw error; 
      }
    },}
});