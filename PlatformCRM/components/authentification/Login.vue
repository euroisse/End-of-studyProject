<template>
  <form @submit.prevent="login">
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        Connectez-vous à votre compte
      </h2>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Type d'utilisateur</label
        >
        <div class="relative">
          <button
            @click="showUserTypeDropdown = !showUserTypeDropdown"
            class="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap cursor-pointer"
          >
            {{ userType || "Sélectionnez votre profil" }}
            <i class="ri-arrow-down-s-line text-gray-400"></i>
          </button>
          <div
            v-if="showUserTypeDropdown"
            class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto"
          >
            <div
              @click="
                selectUserType('Membre de l\'agence');
                showUserTypeDropdown = false;
              "
              class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              Membre de l'agence
            </div>
            <div
              @click="
                selectUserType('Client');
                showUserTypeDropdown = false;
              "
              class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              Client
            </div>
          </div>
        </div>
      </div>

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
      >
        Se connecter
      </button>

      <div class="relative flex items-center py-2">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button
          class="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition whitespace-nowrap cursor-pointer"
        >
          <i class="ri-google-fill text-red-500"></i>
          <span>Google</span>
        </button>
        <button
          class="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition whitespace-nowrap cursor-pointer"
        >
          <i class="ri-linkedin-fill text-blue-700"></i>
          <span>LinkedIn</span>
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const userType = ref("");
const showPassword = ref(false);
const showUserTypeDropdown = ref(false);

const selectUserType = (type: string) => {
  userType.value = type;
};

const login = () => {
  console.log("Login en cours", {
    email: email.value,
    password: password.value,
    userType: userType.value,
  });

  //vide les champs
  email.value = "";
  password.value = "";
};

defineEmits(["login"]);
</script>

<style scoped></style>
