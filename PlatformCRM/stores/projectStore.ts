import { defineStore,  } from "pinia";
import type { ProjectStage, Project} from "~/generated/prisma";
import type { ProjectWithProjectStages } from "~/types";

export const useProjectStore = defineStore('projects', {
  state: () => ({
    selectedProject: ref<ProjectWithProjectStages | null>(null),
    projectStages: ref<ProjectStage[]>([]),
    projects: ref<Project[]>([]),
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

    // async fetchProjects() {
    //   const response = await $fetch<Project[]>('/api/Projects/projects',{
    //     method: 'POST',
    //   });
    //   this.projects = response;
    // },

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