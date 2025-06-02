<template>
  <div class="flex-1 p-4 md:p-8 lg:p-12 xl:p-16">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
    <DashboardHeader v-if="isAdmin" />
    <DashboardSummary v-if="isEmploye || isClient" />

    <div v-if="isEmploye">
      <ProjectProgress :projects="projectProgress" class="mb-6" />
    </div>

    <div v-else>
      <ClientProjectProgress class="mb-6" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InvoiceList :invoices="invoices" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from "~/components/dashboard/DashboardHeader.vue";
import DashboardSummary from "~/components/dashboard/DashboardSummary.vue";
import ProjectProgress from "~/components/dashboard/ProjectProgress.vue";
import InvoiceList from "~/components/dashboard/InvoiceList.vue";
import ClientProjectProgress from "~/components/dashboard/ClientProjectProgress.vue";

definePageMeta({ layout: "admin" });
const { isEmploye, isAdmin, isClient } = useIsRole();

const invoices = ref<
  {
    id: number;
    invoiceNumber: string;
    invoiceDate: string | Date;
    totalAmount: number;
  }[]
>([]);

// Données pour l'employé
const projectProgress = [
  {
    name: "Projet E-commerce",
    status: "En cours",
    statusClass: "bg-blue-100 text-blue-600",
    steps: [
      {
        name: "Analyse",
        icon: "search-line",
        completed: true,
        date: "01/04/2025",
      },
      {
        name: "Design",
        icon: "pencil-ruler-line",
        completed: true,
        date: "05/04/2025",
      },
      {
        name: "Développement",
        icon: "code-line",
        completed: true,
        date: "10/04/2025",
      },
      {
        name: "Tests",
        icon: "flask-line",
        completed: false,
        date: "15/04/2025",
      },
      {
        name: "Livraison",
        icon: "rocket-line",
        completed: false,
        date: "20/04/2025",
      },
    ],
  },
  {
    name: "Projet Marketing Digital",
    status: "En attente",
    statusClass: "bg-yellow-100 text-yellow-600",
    steps: [
      {
        name: "Analyse",
        icon: "search-line",
        completed: true,
        date: "05/04/2025",
      },
      {
        name: "Design",
        icon: "pencil-ruler-line",
        completed: false,
        date: "10/04/2025",
      },
      {
        name: "Développement",
        icon: "code-line",
        completed: false,
        date: "15/04/2025",
      },
      {
        name: "Tests",
        icon: "flask-line",
        completed: false,
        date: "20/04/2025",
      },
      {
        name: "Livraison",
        icon: "rocket-line",
        completed: false,
        date: "25/04/2025",
      },
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

const employeeInvoices = [
  {
    number: "Facture #2025-04",
    dueDate: "25/04/2025",
    status: "Payée",
    statusClass: "bg-green-100 text-green-600",
    amount: "2 500 €",
  },
  {
    number: "Facture #2025-03",
    dueDate: "11/04/2025",
    status: "En attente",
    statusClass: "bg-yellow-100 text-yellow-600",
    amount: "1 800 €",
  },
];

const MessageClient = [
  {
    sender: "Sophie Martin",
    content:
      "Les maquettes sont prêtes pour validation. Pouvez-vous les examiner",
    time: "Il y a 2h",
  },
  {
    sender: "Thomas Dubois",
    content: "Point d'étape sur le développement prévu demain à 14h.",
    time: "Hier",
  },
];
const clientInvoices = [
  {
    number: "Devis #2025-042",
    date: "15 Avr 2025",
    amount: "3,500",
    paid: true,
  },
  {
    number: "Devis #2025-041",
    date: "08 Avr 2025",
    amount: "2,800",
    paid: true,
  },
  {
    number: "Devis #2025-040",
    date: "01 Avr 2025",
    amount: "4,200",
    paid: false,
  },
];
</script>

<style scoped></style>
