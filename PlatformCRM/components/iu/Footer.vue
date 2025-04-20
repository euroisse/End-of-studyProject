<template>
  <div>
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-auto">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <h3 class="text-xl font-bold mb-4">OpenCRM</h3>
            <p class="text-gray-400 mb-6">
              La plateforme CRM idéale pour les agences digitales innovantes.
            </p>
            <div class="flex space-x-4">
              <NuxtLink
                href="#"
                class="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <i class="ri-facebook-fill"></i>
              </NuxtLink>
              <NuxtLink
                href="#"
                class="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <i class="ri-twitter-fill"></i>
              </NuxtLink>
              <NuxtLink
                href="#"
                class="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <i class="ri-linkedin-box-fill"></i>
              </NuxtLink>
              <NuxtLink
                href="#"
                class="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <i class="ri-instagram-line"></i>
              </NuxtLink>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-center">
                <i class="ri-map-pin-fill mr-3 text-indigo-400"></i>
                <span>Yaoundé, Entrée Simbock</span>
              </li>
              <li class="flex items-center">
                <i class="ri-phone-fill mr-3 text-indigo-400"></i>
                <span>+237 656 488 879</span>
              </li>
              <li class="flex items-center">
                <i class="ri-mail-line mr-3 text-indigo-400"></i>
                <span>contact@openintech.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Liens utiles</h3>
            <ul class="space-y-2 text-gray-400">
              <li>
                <a
                  href="#"
                  class="hover:text-white transition-colors cursor-pointer"
                  >Conditions générales d'utilisation</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="hover:text-white transition-colors cursor-pointer"
                  >Politique de confidentialité</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="hover:text-white transition-colors cursor-pointer"
                  >FAQ</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="hover:text-white transition-colors cursor-pointer"
                  >Support</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500"
        >
          <p>&copy; 2025 OpenCRM. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
