// stores/projects.ts
import { defineStore, } from "pinia";
import type { ProjectStage, Project } from "~/generated/prisma"; 
import type { ProjectWithProjectStages } from "~/types"; 
import { ref } from 'vue'; 

export const useProjectStore = defineStore('projects', {
  state: () => ({
    selectedProject: ref<ProjectWithProjectStages | null>(null),
    projectStages: ref<ProjectStage[]>([]),
    projects: ref<ProjectWithProjectStages[]>([]), 
    projectToEdit: ref<ProjectWithProjectStages | null>(null),
    selectedProjectStage: ref<ProjectStage | null>(null),
  }),
  actions: {
    setSelectedProjectStage(stage: ProjectStage | null) {
      this.selectedProjectStage = stage;
    },
    setSelectedProjectToEdit(project: ProjectWithProjectStages | null) {
      this.projectToEdit = project;
    },

    async fetchProjects() {
      try {
        const response = await $fetch<ProjectWithProjectStages[]>('/api/Projects/projects');
        this.projects = response;
      } catch (error) {
        console.error("Erreur lors de la récupération de tous les projets:", error);
        this.projects = [];
      }
    },

    async fetchProject(id: number) {
      const response = await $fetch<ProjectWithProjectStages>(`/api/Projects/${id}`);
      this.selectedProject = response;
    },

    async updateProjectStage(stageId: number, stageData: Partial<ProjectStage>) {
      const response = await $fetch<ProjectStage>(`/api/projectStage/${stageId}`, {
        method: 'PUT',
        body: stageData,
      });
      const updatedStage = response;
      if (this.selectedProject && this.selectedProject.projectStages) {
        const index = this.selectedProject.projectStages.findIndex(stage => stage.id === stageId);
        if (index !== -1) {
          this.selectedProject.projectStages[index] = updatedStage;
        }
      }
    },

    async fetchUserProjects(userId: number) {
      try {
     
        const response = await $fetch<ProjectWithProjectStages[]>(`/api/Projects/user/${userId}`);
        this.projects = response; 
      } catch (error) {
        console.error(`Erreur lors de la récupération des projets de l'utilisateur ${userId}:`, error);
        this.projects = [];
      }
    },
    async deleteProjectStage(stageId: number) {
      await $fetch(`/api/projectStage/${stageId}`, {
        method: 'DELETE',
      });
      if (this.selectedProject && this.selectedProject.projectStages) {
        this.selectedProject.projectStages = this.selectedProject.projectStages.filter(stage => stage.id !== stageId);
      }
    },
    async updateProject(projectId: number, projectData: Partial<Project>) {
      const response = await $fetch<ProjectWithProjectStages>(`/api/Projects/${projectId}`, {
        method: 'PUT',
        body: projectData,
      });
      const updatedProject = response;
      this.selectedProject = updatedProject;
      this.projectToEdit = updatedProject;
      return updatedProject;
    },
  },
});