<template>
  <form @submit.prevent="login" class="p-6">
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        Connectez-vous à votre compte
      </h2>

      <div>
        <label
          for="login-email"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-mail-line text-gray-400"></i>
          </div>
          <input
            id="login-email"
            v-model="email"
            type="email"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="votre-email@exemple.com"
          />
        </div>
      </div>

      <div>
        <label
          for="login-password"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Mot de passe</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-lock-line text-gray-400"></i>
          </div>
          <input
            id="login-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Votre mot de passe"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <i
              @click="showPassword = !showPassword"
              :class="[
                'ri',
                showPassword ? 'ri-eye-off-line' : 'ri-eye-line',
                'text-gray-400 cursor-pointer',
              ]"
            ></i>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <a href="#" class="text-sm text-blue-600 hover:underline"
          >Mot de passe oublié ?</a
        >
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition whitespace-nowrap cursor-pointer"
        :disabled="isLoading"
      >
        {{ isLoading ? "Connexion en cours..." : "Se connecter" }}
      </button>

      <div class="relative flex items-center py-2">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button
          type="button"
          class="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition whitespace-nowrap cursor-pointer"
        >
          <i class="ri-google-fill text-red-500"></i>
          <span>Google</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition whitespace-nowrap cursor-pointer"
        >
          <i class="ri-linkedin-fill text-blue-700"></i>
          <span>LinkedIn</span>
        </button>
      </div>

      <div v-if="loginError" class="text-red-600 text-sm mt-3">
        {{ loginError }}
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { LoginResponse } from "~/types";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const router = useRouter();
const loginError = ref("");
const isLoading = ref(false);

const login = async () => {
  loginError.value = "";
  isLoading.value = true;

  if (!email.value || !password.value) {
    loginError.value = "Veuillez entrer votre email et votre mot de passe.";
    isLoading.value = false;
    return;
  }

  try {
    const response = (await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    })) as LoginResponse;

    if (response && response?.user) {
      const user = response.user;

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user?.roles ? user.roles[0] : undefined,
        ...(user.poste && { poste: user.poste }),
        ...(user.department && { department: user.department }),
        ...(user.adresse && { adresse: user.adresse }),
        ...(user.contacts && { contacts: user.contacts }),
        ...(user.company && { company: user.company }),
        ...(user.industry && { industry: user.industry }),
      };
      localStorage.setItem("user", JSON.stringify(userData));

      const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : "";

      if (userRole === "customer") {
        router.push("/dashboard");
      } else if (userRole === "employee") {
        router.push("/dashboard");
      } else if (userRole === "admin") {
        router.push("/dashboard");
      } else {
        console.warn(
          "User role not recognized or missing. Redirecting to a default dashboard."
        );
      }

      // Clear form fields
      email.value = "";
      password.value = "";
    } else {
      loginError.value = "Email ou mot de passe incorrect.";
    }
  } catch (error: any) {
    console.error("Error during login request:", error);
    if (error?.statusCode === 401 || error?.statusCode === 400) {
      loginError.value = "Email ou mot de passe incorrect.";
    } else {
      loginError.value =
        "Une erreur inattendue est survenue. Veuillez réessayer.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
