// project
 export type Project ={
    title: string;
    id: number;
    description: string | null;
    endDate: Date | null;
    customerId: number;
    startDate: Date;
}
//tasks
export type Tasks = {
    id: number;
    projectId: number;
    employeeId: number;
    title: string;
    description: string;
    effort: number | null;
    projectStageId: number;
    priority: $Enums.TaskPriority;
    status: $Enums.TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    endDate: Date | null;
}

//user
export type User = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    password: string;
    poste: string | null;
    department: string | null;
    profilePicture: string | null;
    adresse: string | null;
    company: string | null;
    industry: string | null;
    contacts: string | null;
}

//role
export type Role = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

// userRole
export type UserRole = {
    userId: number;
    roleId: number;
    assignedAt: Date;
}

//emploeeOnProject
export type EmployeeOnProjects = {
    projectId: number;
    employeeId: number;
}

//projectStage
export type ProjectStage = {
  id: number;
  title: string;
  description: string | null;
  endDate: Date | null;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
  status: string; 
  order: number;
};

//quote
export type Quote = {
    number: string;
    id: number;
    projectId: number;
    status: $Enums.quoteStatus;
    createdAt: Date;
    updatedAt: Date;
    customerId: number;
    totalPrice: number;
    newTotalPrice: number | null;
}

//cout-stage
 export type cout_stage = {
    projectStageId: number;
    quoteId: number;
    prix: number;
}

//invoice
export type Invoice = {
    id: number;
    createdAt: Date;
    invoiceNumber: string;
    quoteId: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    invoiceDate: Date;
    userId: number;
    paymentMethod: $Enums.paymentMethod;
}

//notification
export type Notification = {
    id: number;
    projectId: number | null;
    createdAt: Date;
    message: string;
    type: string;
    read: boolean;
    userId: number;
    quoteId: number | null;
    invoiceId: number | null;
    taskId: number | null;
}
/**
 * Enums
 */
export namespace $Enums {
  export enum TaskStatus {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  CANCELLED = 'CANCELLED'
}

export enum TaskPriority {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE'
}

export enum quoteStatus {
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  EN_ATTENTE = 'EN_ATTENTE'
}

export enum paymentMethod {
  OrangeMoney = 'OrangeMoney',
  MTNMoney = 'MTNMoney',
  BankTransfer = 'BankTransfer',
  Cash = 'Cash'
};};





