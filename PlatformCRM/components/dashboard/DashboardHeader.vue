<template>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Tableau de bord</h1>
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-primary">
          <i class="ri-folder-add-line mr-2"></i>Nouveau projet
        </button>
        <button class="btn btn-success">
          <i class="ri-file-add-line mr-2"></i>Nouveau devis
        </button>
      </div>
    </div>
  </template>
  <script setup>

</script>
  <style scoped>
  .btn {
    @apply flex items-center px-4 py-2 rounded-lg shadow-md text-white whitespace-nowrap transition-all;
  }
  .btn-primary {
    @apply bg-indigo-500 hover:bg-indigo-700;
  }
  .btn-success {
    @apply bg-green-500 hover:bg-green-700;
  }
  </style>
  