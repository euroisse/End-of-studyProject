<template>
  <div>
    <header class="bg-white shadow-sm fixed top-0 left-64 right-0 z-10">
      <div class="flex items-center justify-between px-8 py-4">
        <div class="flex items-center space-x-4"></div>

        <div class="flex items-center space-x-4 relative">
          <div class="flex items-center space-x-3">
            <div
              v-if="user?.photoURL"
              class="w-10 h-10 rounded-full overflow-hidden"
            >
              <img
                :src="user.photoURL"
                alt="Photo de profil"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <i class="ri-user-line text-indigo-600 text-xl"></i>
            </div>
            <span class="font-medium">{{ userName }}</span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
const { userName } = useIsRole();

const user = ref(null);

onMounted(() => {
  const userString = localStorage.getItem("user");
  try {
    user.value = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    user.value = null;
  }
});
</script>

<style scoped></style>
