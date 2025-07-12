<template>
  <div
    class="container pt-20 px-4 md:px-20 min-h-screen flex items-center justify-center"
  >
    <div class="container py-10">
      <h1 class="text-5xl font-bold mb-6 text-indigo-700 text-center">
        Contactez-nous
      </h1>
      <form
        @submit.prevent="handleSubmit"
        class="bg-white container p-10 rounded-lg shadow-md border"
      >
        <div class="mb-5">
          <label class="block mb-1 font-semibold text-gray-700"
            >Nom <span class="text-red-500">*</span></label
          >
          <input
            v-model="form.name"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div class="mb-5">
          <label class="block mb-1 font-semibold text-gray-700"
            >Email <span class="text-red-500">*</span></label
          >
          <input
            v-model="form.email"
            type="email"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div class="mb-5">
          <label class="block mb-1 font-semibold text-gray-700">Sujet</label>
          <input
            v-model="form.subject"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div class="mb-5">
          <label class="block mb-1 font-semibold text-gray-700"
            >Message <span class="text-red-500">*</span></label
          >
          <textarea
            v-model="form.message"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 w-full"
        >
          {{ loading ? "Envoi en cours..." : "Envoyer" }}
        </button>
        <div
          v-if="success"
          class="mt-4 text-green-600 font-semibold text-center"
        >
          Votre message a bien été envoyé !
        </div>
        <div v-if="error" class="mt-4 text-red-600 font-semibold text-center">
          Erreur lors de l'envoi. Veuillez réessayer.
        </div>
      </form>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Footer from "~/components/iu/Footer.vue";

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});
const success = ref(false);
const error = ref(false);
const loading = ref(false);

async function handleSubmit() {
  success.value = false;
  error.value = false;
  loading.value = true;
  try {
    await $fetch("/api/messages", {
      method: "POST",
      body: { ...form.value },
    });
    success.value = true;
    form.value = { name: "", email: "", subject: "", message: "" };
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Ajoute ici tes styles personnalisés si besoin */
</style>
