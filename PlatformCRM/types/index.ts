import type { Prisma, User } from "~/generated/prisma";


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

export type ProjectStatus = "EN_COURS" | "A_VENIR" | "TERMINE" | "EN_ATTENTE";

export interface Project {
  id: number;
  title: string;
  status: ProjectStatus;
  customerId: number;
  customer?: {
    name: string;
  };
  projectStages: {
    id: number;
    name: string;
    status: string;
    order: number;
  }[];
  users: {
    employee: {
      id: number;
      name: string;
      email: string;
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
  status: 'A_FAIRE' | 'EN_COURS' | 'TERMINE'| 'ANNULE'| 'EN_ATTENTE';
  effort?: number | null;
  employee?: { id: number; name: string } | null; 
  project?: { id: number; name: string; title:string } | null; }

  export interface Employee {
  id: number
  name: string
  email: string
}

export interface SelectOptions {
  value: string | number
  label: string
}
export interface State {
  tasks: Task[];
  selectedTaskIds: number[];
  selectedProjectId: number | null; 
  assignedEmployeeId: number | null;
  taskStatuses: { label: string; value: Task['status'] }[];
  taskPriorities: { label: string; value: Task['priority'] }[];
  taskToEditId: number | null;
  taskBeingEdited: Task | null | undefined;
  
}

export interface TaskUpdatePayload extends Omit<Partial<Task>, 'id' | 'employee' | 'project'> {}
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'CANCELLED'

export interface QuoteStageInput {
  projectStageId: number;
  prix: number;
}

 export interface quote {
   id: number;
   number: string;
   status: stageStatus;
   customerId: number;
   projectId: number;
   project:{
    title:string;
   }
   stages: {
     quoteId: number;
     projectStageId: number;
    prix:number;
     projectStage: {
       id: number;
       title: string;
       description: string | null;
     };
   }[];
   customer: {
     id: number;
     name: string;
     email: string;
     company:string;
   };
    projectName: string;
  totalPrice: number;
  newTotalPrice?: number;
  dateLivraison?:string
   createdAt: string;
   updatedAt: string;
 }
 export type stageStatus = 
'ACCEPTE'|'REFUSE'|'EN_ATTENTE'

 export interface ProjectStageRaw {
  id: number;
  title: string;
  description?: string;
  
}
export interface CreateUpdateQuotePayload {
  projectId: number;
  stagesWithPrices: QuoteStageInput[]; 
  dateLivraison?: string | null;
  status?: string;
}