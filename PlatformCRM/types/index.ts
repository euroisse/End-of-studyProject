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
    };
  }[];
  updatedAt: Date;
}

export type ProjectWithProjectStages = Prisma.ProjectGetPayload<{
  include: { customer: true ; projectStages: true };
}>;