<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Créez votre compte</h2>

    <div class="relative">
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >Type d'utilisateur</label
      >
      <div class="relative">
        <select
          v-model="userType"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="">Sélectionnez votre profil</option>
          <option value="1">Employé</option>
          <option value="2">Client</option>
          <option value="3">admin</option>
        </select>
        <div
          class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
        >
          <i class="ri-arrow-down-s-line text-gray-400"></i>
        </div>
      </div>
    </div>

    <div>
      <label
        for="register-name"
        class="block text-sm font-medium text-gray-700 mb-1"
        >Nom complet</label
      >
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="ri-user-line text-gray-400"></i>
        </div>
        <input
          id="register-name"
          v-model="fullName"
          type="text"
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Prénom Nom"
        />
      </div>
    </div>

    <div>
      <label
        for="register-email"
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
          id="register-email"
          v-model="email"
          type="email"
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="votre-email@exemple.com"
        />
      </div>
    </div>

    <div>
      <label
        for="register-password"
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
          id="register-password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Créez un mot de passe"
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

      <div class="mt-1">
        <div class="w-full bg-gray-200 rounded-full h-1.5">
          <div
            :class="[
              'h-1.5 rounded-full',
              passwordStrength === 'weak'
                ? 'w-1/4 bg-red-500'
                : passwordStrength === 'medium'
                ? 'w-2/4 bg-yellow-500'
                : passwordStrength === 'strong'
                ? 'w-3/4 bg-green-500'
                : passwordStrength === 'very-strong'
                ? 'w-full bg-green-600'
                : '',
            ]"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{
            passwordStrength === "weak"
              ? "Faible"
              : passwordStrength === "medium"
              ? "Moyen"
              : passwordStrength === "strong"
              ? "Fort"
              : passwordStrength === "very-strong"
              ? "Très fort"
              : "Entrez un mot de passe"
          }}
        </p>
      </div>
    </div>

    <div>
      <label
        for="register-confirm-password"
        class="block text-sm font-medium text-gray-700 mb-1"
        >Confirmer le mot de passe</label
      >
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="ri-lock-line text-gray-400"></i>
        </div>
        <input
          id="register-confirm-password"
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Confirmez votre mot de passe"
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <i
            @click="showConfirmPassword = !showConfirmPassword"
            :class="[
              'ri',
              showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line',
              'text-gray-400 cursor-pointer',
            ]"
          ></i>
        </div>
      </div>
    </div>

    <div v-if="userType === '1'" class="space-y-4">
      <div>
        <label
          for="register-poste"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Poste</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-briefcase-line text-gray-400"></i>
          </div>
          <input
            id="register-poste"
            v-model="employeeDetails.poste"
            type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Votre poste"
          />
        </div>
      </div>
      <div>
        <label
          for="register-department"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Département</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-building-line text-gray-400"></i>
          </div>
          <input
            id="register-department"
            v-model="employeeDetails.department"
            type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Votre département"
          />
        </div>
      </div>
    </div>

    <div v-if="userType === '2'" class="space-y-4">
      <div>
        <label
          for="register-company"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Entreprise</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-building-line text-gray-400"></i>
          </div>
          <input
            id="register-company"
            v-model="clientDetails.company"
            type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Nom de votre entreprise"
          />
        </div>
      </div>
      <div>
        <label
          for="register-industry"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Secteur d'activité</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-settings-line text-gray-400"></i>
          </div>
          <input
            id="register-industry"
            v-model="clientDetails.industry"
            type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Votre secteur d'activité"
          />
        </div>
      </div>
      <div>
        <label
          for="register-address"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Adresse</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-map-pin-line text-gray-400"></i>
          </div>
          <input
            id="register-address"
            v-model="clientDetails.address"
            type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Adresse de l'entreprise"
          />
        </div>
      </div>
      <div>
        <label
          for="register-address"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Contacts</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-map-pin-line text-gray-400"></i>
          </div>
          <input
            id="register-address"
            v-model="clientDetails.contacts"
            type="number"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="000-000-000"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center">
      <input
        id="terms"
        v-model="acceptTerms"
        type="checkbox"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="terms" class="ml-2 block text-sm text-gray-700">
        J'accepte les
        <a href="#" class="text-blue-600 hover:underline"
          >conditions d'utilisation</a
        >
        et la
        <a href="#" class="text-blue-600 hover:underline"
          >politique de confidentialité</a
        >
      </label>
    </div>

    <button
      @click="register"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition whitespace-nowrap cursor-pointer"
      :disabled="!acceptTerms"
      :class="{ 'opacity-50 cursor-not-allowed': !acceptTerms }"
    >
      Créer un compte
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const userType = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);

const employeeDetails = ref({
  poste: "",
  department: "",
});

const clientDetails = ref({
  company: "",
  industry: "",
  address: "",
  contacts: "",
});

const passwordStrength = computed(() => {
  const pwd = password.value;
  if (!pwd) return "";

  const hasLowerCase = /[a-z]/.test(pwd);
  const hasUpperCase = /[A-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
  const isLongEnough = pwd.length >= 8;

  const score = [
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    isLongEnough,
  ].filter(Boolean).length;

  if (score <= 2) return "weak";
  if (score === 3) return "medium";
  if (score === 4) return "strong";
  return "very-strong";
});

const register = async () => {
  const userData = {
    name: fullName.value,
    email: email.value,
    password: password.value,
    roleId: userType.value,
    ...(userType.value === "1"
      ? {
          poste: employeeDetails.value.poste,
          department: employeeDetails.value.department,
        }
      : {
          company: clientDetails.value.company,
          industry: clientDetails.value.industry,
          address: clientDetails.value.address,
          contacts: clientDetails.value.contacts,
        }),
  };
  await useFetch("/api/users/create", {
    method: "POST",
    body: userData,
  });

  console.log("Register attempt", userData);

  //vide les champs
  fullName.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  acceptTerms.value = false;
  employeeDetails.value.poste = "";
  employeeDetails.value.department = "";
  clientDetails.value.company = "";
  clientDetails.value.industry = "";
  clientDetails.value.address = "";
  clientDetails.value.contacts = "";
};

defineEmits(["register"]);
</script>

<style scoped></style>
