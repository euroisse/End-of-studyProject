<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      Créez un compte client
    </h2>

    <div>
      <label
        for="register-name"
        class="block text-sm font-medium text-gray-700 mb-1 capitalize"
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

    <div class="space-y-4">
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
            placeholder="Adresse"
          />
        </div>
      </div>
      <div>
        <label
          for="register-contacts"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Contacts</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="ri-phone-line text-gray-400"></i>
          </div>
          <input
            id="register-contacts"
            v-model="clientDetails.contacts"
            type="text"
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
      :disabled="!acceptTerms || isLoading || !customerRoleId"
      :class="{
        'opacity-50 cursor-not-allowed':
          !acceptTerms || isLoading || !customerRoleId,
      }"
    >
      {{ isLoading ? "Création du compte..." : "Créer un compte" }}
    </button>

    <div v-if="errorMessage" class="text-red-600 text-sm mt-3">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="text-green-600 text-sm mt-3">
      {{ successMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";

const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const customerRoleId = ref<number | null>(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const clientDetails = ref({
  address: "",
  contacts: "",
});

// Définir les événements que ce composant peut émettre
const emit = defineEmits(["client-registered"]);

// Calcul de la force du mot de passe
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

// Récupération de l'ID du rôle 'customer' au montage du composant
onMounted(async () => {
  try {
    const { data, error } = await useFetch("/api/roles/customer", {
      method: "GET",
    });

    if (error.value) {
      console.error(
        "Erreur lors de la récupération du rôle customer:",
        error.value
      );
      errorMessage.value =
        "Impossible de charger les informations de rôle. Veuillez réessayer ou contacter le support.";
    } else if (data.value) {
      customerRoleId.value = data.value.id;
      console.log("ID du rôle customer récupéré:", customerRoleId.value);
    } else {
      errorMessage.value =
        "Le rôle 'customer' n'a pas été trouvé via l'API. Veuillez vérifier la configuration côté serveur.";
    }
  } catch (err) {
    console.error(
      "Erreur réseau lors de la récupération du rôle customer:",
      err
    );
    errorMessage.value =
      "Erreur réseau. Impossible de communiquer avec le serveur pour récupérer le rôle client.";
  }
});

// --- Fonction d'inscription ---
const register = async () => {
  // Réinitialiser les messages
  errorMessage.value = null;
  successMessage.value = null;
  isLoading.value = true;

  // Vérifications côté client
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas.";
    isLoading.value = false;
    return;
  }
  if (!fullName.value || !email.value || !password.value) {
    errorMessage.value = "Veuillez remplir tous les champs obligatoires.";
    isLoading.value = false;
    return;
  }
  if (!acceptTerms.value) {
    errorMessage.value = "Vous devez accepter les conditions d'utilisation.";
    isLoading.value = false;
    return;
  }
  // S'assurer que l'ID du rôle customer a bien été récupéré
  if (customerRoleId.value === null) {
    errorMessage.value =
      "Le rôle client n'a pas pu être déterminé. Veuillez patienter ou rafraîchir la page.";
    isLoading.value = false;
    return;
  }

  // Préparation des données pour l'API
  const userData = {
    nom: fullName.value,
    email: email.value,
    password: password.value,
    roleId: customerRoleId.value,
    adresse: clientDetails.value.address || null,
    contact: clientDetails.value.contacts || null,
  };

  try {
    const { data, error } = await useFetch("/api/auth/customer", {
      method: "POST",
      body: userData,
    });

    if (error.value) {
      console.error("Erreur d'inscription:", error.value);

      errorMessage.value =
        error.value.data?.message ||
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
    } else {
      console.log("Inscription réussie!", data.value);
      successMessage.value = "Le compte client a été créé avec succès ! ";
      // Émettre l'événement après l'enregistrement réussi
      emit("client-registered");
      // Réinitialiser les champs du formulaire après succès
      fullName.value = "";
      email.value = "";
      password.value = "";
      confirmPassword.value = "";
      acceptTerms.value = false;
      clientDetails.value.address = "";
      clientDetails.value.contacts = "";
    }
  } catch (err) {
    console.error("Erreur réseau lors de l'inscription:", err);
    errorMessage.value =
      "Erreur réseau. Veuillez vérifier votre connexion Internet.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
