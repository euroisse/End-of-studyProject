// ~/types.ts
import type { Prisma, User, ProjectStage as PrismaProjectStage, Tasks as PrismaTasks } from "~/generated/prisma"; // Import Prisma types explicitly

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
  id: number;
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
    contacts?: string;
  };
}

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
    title: string; 
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
  startDate: Date;
}


export interface ProjectStageWithTasks extends PrismaProjectStage {
  tasks: PrismaTasks[]; 
}


export type ProjectWithProjectStages = Prisma.ProjectGetPayload<{
  include: { customer: true; projectStages: { include: { tasks: true } } }; 
}>;


export type Task = {
  id: number;
  title: string;
  description?: string | null;
  projectId: number;
  employeeId?: number | null;
  priority: 'BASSE' | 'MOYENNE' | 'HAUTE';
  endDate?: Date | null;
  status: 'A_FAIRE' | 'EN_COURS' | 'TERMINE' | 'ANNULE' | 'EN_ATTENTE';
  effort?: number | null;
  employee?: { id: number; name: string } | null;
  project?: { id: number; name: string; title: string } | null;
}

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

export interface TaskUpdatePayload extends Omit<Partial<Task>, 'id' | 'employee' | 'project'> { }


export type TaskStatus = 'A_FAIRE' | 'EN_COURS' | 'TERMINE' | 'ANNULE' | 'EN_ATTENTE';

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
  project: {
    title: string;
  }
  stages: {
    quoteId: number;
    projectStageId: number;
    prix: number;
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
    company: string;
  };
  totalPrice: number;
  newTotalPrice?: number;
  dateLivraison?: string
  createdAt: string;
  updatedAt: string;
  projectName: string,
}

export type stageStatus =
  'ACCEPTE' | 'REFUSE' | 'EN_ATTENTE'

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

export interface CreateInvoicePayload {
  quoteId: number;
  amountPaid: number;
  paymentMethod: string;
  invoiceDate: string;
  userId: number;
  projectId: number;
  stages: Array<{
    projectStageId: number;
    price: number;
  }>;
  newTotalPrice?: number
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  contacts?: string;
  company?: string;
  industry?: string;
  adresse?: string;
  poste?: string;
  department?: string;
  profilePicture?: string;
  UserRole: { role: { name: string } }[];
}

export interface ClientDisplayData {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  company?: string;
}

export interface EmployeeDisplayData {
  id: number;
  name: string;
  post?: string;
  project?: string;
}