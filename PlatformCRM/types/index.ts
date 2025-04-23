export interface Project {
    id: number;
    name: string;
    avatar: string;
  }
  
 export interface Employee {
    id: number;
    name: string;
    avatar: string;
  }
  
 export interface Task {
    id: number;
    title: string;
    description: string;
    projectId: number;
    assignee: Employee;
    status: string;
    priority: string;
    dueDate: string;
  }
  
export  interface NewTaskData {
    title: string;
    description: string;
    projectId: number | '';
    assigneeId: number | '';
    priority: string;
    dueDate: string;
  }
  