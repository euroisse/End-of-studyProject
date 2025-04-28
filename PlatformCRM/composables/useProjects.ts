
import { ref } from "vue";

export interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  progress: number;
  lastUpdate: Date;
}

export const projects = ref<Project[]>([]);
