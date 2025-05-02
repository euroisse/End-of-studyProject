<template>
  <div class="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
    <h2 class="text-lg font-semibold mb-4">Avancement des projets</h2>
    <div class="space-y-8 min-w-[600px]">
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="border-b pb-6 last:border-b-0 last:pb-0 md:items-center"
      >
        <div class="mb-2 md:mb-0 md:flex-1">
          <div class="flex items-center mb-1 md:block md:mb-2">
            <div class="flex justify-between">
              <h3 class="font-medium text-gray-800">{{ project.name }}</h3>
              <span
                :class="`px-2 py-1 rounded-full text-xs ${project.statusClass}`"
                >{{ project.status }}</span
              >
            </div>
          </div>
          <div class="flex items-center space-x-2 md:space-x-4">
            <div
              v-for="(step, stepIndex) in project.steps"
              :key="stepIndex"
              class="flex-1 relative"
            >
              <div class="flex items-center">
                <div
                  :class="`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`"
                >
                  <i
                    :class="`ri-${step.icon} ${
                      step.completed ? 'text-white' : 'text-gray-500'
                    } text-sm md:text-base`"
                  ></i>
                </div>
                <div
                  v-if="stepIndex < project.steps.length - 1"
                  :class="`flex-1 h-0.5 md:h-1 mx-1 md:mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`"
                ></div>
              </div>
              <div
                class="absolute -bottom-5 left-0 text-xs text-gray-500 md:static md:text-sm md:mt-2"
              >
                <div>{{ step.name }}</div>
                <div class="whitespace-nowrap">{{ step.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  projects: {
    name: string;
    status: string;
    statusClass: string;
    steps: {
      name: string;
      icon: string;
      completed: boolean;
      date: string;
    }[];
  }[];
}>();
</script>

<style scoped></style>
