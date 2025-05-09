<template>
  <div class="min-h-screen transition-colors duration-300 bg-gray-50">
    <div class="p-4 transition-spacing duration-300">
      <div class="flex justify-between items-center mb-8">
        <div>
          <div class="flex items-center space-x-2 text-sm">
            <span class="text-gray-500 pb-2">Projects /</span>
            <h2 class="text-2xl font-bold text-gray-800">Gestion des Tâches</h2>
          </div>
        </div>
        <div>
          <button @click="addTask">Ajouter une tâche</button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 my-8">
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-lg bg-blue-500/10">
            <i class="ri-file-text-line text-gray-800"></i>
          </div>
          <span class="text-sm text-gray-500">statuts confondues</span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Toutes les taches confondues</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">5</p>
        </div>
      </div>
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-lg bg-gray-500/10">
            <i class="ri-time-line w-6 h-6 text-gray-700"></i>
          </div>
          <span class="text-sm text-gray-500"> statut(A_FAIRE) </span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Taches A faire</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">2</p>
        </div>
      </div>
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-lg bg-yellow-500/10">
            <i class="ri-hourglass-fill text-yellow-800"></i>
          </div>
          <span class="text-sm text-gray-500"> statut(En cours) </span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Taches En cours</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">2</p>
        </div>
      </div>
      <div
        class="p-4 rounded-xl border bg-white border-gray-200 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-lg bg-green-500/10">
            <i class="w-6 h-6 ri-check-line text-green-800"></i>
          </div>
          <span class="text-sm text-gray-500"> statut(Terminé) </span>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Taches TERMINE</p>
          <p class="text-2xl font-bold mt-1 text-gray-800">2</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tasks = ref([
  { id: 1, title: "Développer le modèle de données", status: "Terminé" },
  { id: 2, title: "Créer l'API", status: "En cours" },
  { id: 3, title: "Intégrer l'interface utilisateur", status: "À faire" },
]);

const addTask = () => {
  console.log("Ajouter une nouvelle tâche");
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

button:hover {
  background-color: #3730a3;
}
</style>
