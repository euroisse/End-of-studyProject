<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div v-if="loading">Création ou vérification de l'admin...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="success" class="text-green-600">
      {{ success }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const loading = ref(true);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;

  const adminData = {
    nom: "Admin",
    email: "admin@opencrm.com",
    password: "Admin@1234",
  };

  try {
    const { data, error: apiError } = await useFetch("/api/auth/seed-admin", {
      method: "POST",
      body: adminData,
    });

    if (apiError.value) {
      error.value =
        apiError.value.data?.message ||
        "Erreur lors de la création de l'admin.";
      loading.value = false;
      return;
    }

    if (data.value?.alreadyExists) {
      error.value = "Un compte admin existe déjà. Veuillez vous connecter.";
      success.value = null;
    } else {
      success.value =
        "Admin créé avec succès. Cliquez sur 'Se connecter' pour accéder à votre compte.";
      error.value = null;
    }
    // navigateTo("/dashboard");
  } catch (e) {
    error.value = "Erreur réseau ou serveur.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
