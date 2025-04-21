<template>
    <div>
  <!-- Project Progress -->
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 class="text-xl font-bold mb-6">Avancement du projet</h2>
            <div class="relative">
              <div class="flex justify-between mb-8">
                <div class="w-1/5 text-center">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i class="ri-check-line text-white"></i>
                  </div>
                  <p class="text-sm font-medium text-green-500">Analyse</p>
                </div>
                
                <div class="w-1/5 text-center">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i class="ri-check-line text-white"></i>
                  </div>
                  <p class="text-sm font-medium text-green-500">Design</p>
                </div>
                
                <div class="w-1/5 text-center">
                  <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i class="ri-code-s-slash-line text-white"></i>
                  </div>
                  <p class="text-sm font-medium text-indigo-500">Développement</p>
                </div>
                
                <div class="w-1/5 text-center">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i class="ri-test-tube-fill text-gray-400"></i>
                  </div>
                  <p class="text-sm font-medium text-gray-400">Tests</p>
                </div>
                
                <div class="w-1/5 text-center">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i class="ri-rocket-2-fill text-gray-400"></i>
                  </div>
                  <p class="text-sm font-medium text-gray-400">Livraison</p>
                </div>
              </div>
              
              <div class="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
                <div class="absolute left-0 h-0.5 bg-green-500" style="width: 50%"></div>
              </div>
            </div>
          </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>