
import { ref } from "vue";

export interface Project {
  id: number;
  title: string;
  customerId: string;
  customer?:{
    name:string
  };
  progress: number;
  lastUpdate: Date;
  startDate: Date | null;
  endDate: Date | null;
  description: String;
}

export const projects = ref<Project[]>([]);
