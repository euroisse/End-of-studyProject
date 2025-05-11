import type { Prisma, User } from "~/generated/prisma";


// types/index.ts
export interface Conversation {
    id: number;
    name: string;
    avatar?: string;
    lastMessage: string;
    timestamp: number;  
    online: boolean;
    active: boolean;
    messages: Array<Message> | []
}
  
export interface Message {
    id: number;
    content: string;
    timestamp: number;  
    sent: boolean;
    file?: {
      name: string;
      size: string;
    };
   
}
export interface Invoice {
    numero: string;
    projet: string;
    date: string;
    montant: string;
    statut: string;
  }

 export interface LoginResponse {
    user?: {
      id: number;
      name: string;
      email: string;
      roles?: string[];
      poste?: string;
      department?: string;
      adresse?: string;
      company?: string;
      industry?: string;
      
};}

export interface Project {
  id: number;
  title: string;
  status: "EN_COURS" | "A_VENIR" | "TERMINE" | "EN_ATTENTE";
  customerId: number;
  customer?: {
    name: string;
  };
  projectStages: {
    id: number;
    name: string;
    status: string;
  }[];
  users: {
    employee: {
      id: number;
      name: string;
      email: string
    };
  }[];
  updatedAt: Date;
}

export type ProjectWithProjectStages = Prisma.ProjectGetPayload<{
  include: { customer: true ; projectStages: true; };
}>;

export type Task = {
   id: number;
  title: string;
  description?: string | null;
  projectId: number;
  employeeId?: number | null;
  priority: 'BASSE' | 'MOYENNE' | 'HAUTE';
  status: 'A_FAIRE' | 'EN_COURS' | 'TERMINE';
  effort?: number | null;
  employee?: { id: number; name: string } | null; 
  project?: { id: number; name: string } | null; }

  export interface Employee {
  id: number
  name: string
  email: string
}
export interface State {
  tasks: Task[];
  selectedTaskIds: number[];
  selectedProjectId: number | null; 
  assignedEmployeeId: number | null;
  taskStatuses: { label: string; value: Task['status'] }[];
  taskPriorities: { label: string; value: Task['priority'] }[];
 
}