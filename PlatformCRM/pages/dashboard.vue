<template>
    <div class="flex-1 p-4 md:p-8 lg:p-12 xl:p-16">
      <DashboardHeader />
      <DashboardSummary />
      <div class="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6 overflow-x-auto">
        <h2 class="text-lg font-semibold mb-4">Avancement des projets</h2>
        <div class="space-y-8 md:space-y-10 min-w-[600px] ">
          <div
            v-for="(project, index) in projectProgress"
            :key="index"
            class="border-b pb-6 last:border-b-0 last:pb-0 md:items-center"
          >
            <div class="mb-2 md:mb-0 md:flex-1">
              <div class="flex  items-center mb-1 md:block md:mb-2">
                <div class="flex justify-between">
                <h3 class="font-medium text-gray-800">{{ project.name }}</h3>
                <span
                  :class="`px-2 py-1 rounded-full text-xs ${project.statusClass}`"
                >{{ project.status }}</span>
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
                      :class="`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`"
                    >
                      <i
                        :class="`ri-${step.icon} ${step.completed ? 'text-white' : 'text-gray-500'} text-sm md:text-base`"
                      ></i>
                    </div>
                    <div
                      v-if="stepIndex < project.steps.length - 1"
                      :class="`flex-1 h-0.5 md:h-1 mx-1 md:mx-2 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`"
                    ></div>
                  </div>
                  <div class="absolute -bottom-5 left-0 text-xs text-gray-500 md:static md:text-sm md:mt-2">
                    <div>{{ step.name }}</div>
                    <div class="whitespace-nowrap">{{ step.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MessagesRecentMessage :messages="recentMessages" />
        <InvoicesInvoiceList :invoices="invoices" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: 'admin' });
  
  const projectProgress = [
    {
      name: "Projet E-commerce",
      status: "En cours",
      statusClass: "bg-blue-100 text-blue-600",
      steps: [
        { name: "Analyse", icon: "search-line", completed: true, date: "01/04/2025" },
        { name: "Design", icon: "pencil-ruler-line", completed: true, date: "05/04/2025" },
        { name: "Développement", icon: "code-line", completed: true, date: "10/04/2025" },
        { name: "Tests", icon: "flask-line", completed: false, date: "15/04/2025" },
        { name: "Livraison", icon: "rocket-line", completed: false, date: "20/04/2025" },
      ],
    },
    {
      name: "Projet Marketing Digital",
      status: "En attente",
      statusClass: "bg-yellow-100 text-yellow-600",
      steps: [
        { name: "Analyse", icon: "search-line", completed: true, date: "05/04/2025" },
        { name: "Design", icon: "pencil-ruler-line", completed: false, date: "10/04/2025" },
        { name: "Développement", icon: "code-line", completed: false, date: "15/04/2025" },
        { name: "Tests", icon: "flask-line", completed: false, date: "20/04/2025" },
        { name: "Livraison", icon: "rocket-line", completed: false, date: "25/04/2025" },
      ],
    },
  ];
  
  const recentMessages = [
    {
      sender: "Marie Dubois",
      content: "Les maquettes ont été validées par le client",
      time: "Il y a 2h",
    },
    {
      sender: "Thomas Martin",
      content: "Réunion de suivi prévue demain à 14h",
      time: "Il y a 5h",
    },
    {
      sender: "Julie Bernard",
      content: "Nouvelle version déployée sur le serveur de test",
      time: "Hier",
    },
  ];
  
  const invoices = [
    { number: "2025-042", date: "15 Avr 2025", amount: "3,500", paid: true },
    { number: "2025-041", date: "08 Avr 2025", amount: "2,800", paid: true },
    { number: "2025-040", date: "01 Avr 2025", amount: "4,200", paid: false },
  ];
  </script>