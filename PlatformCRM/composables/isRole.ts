import { computed } from 'vue';

export const useIsRole = () => {
  const userString = localStorage.getItem('user');

  const user = computed(() => {
    try {
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Erreur lors de la recuperation des informations utilisateur depuis le localStorage:", error);
      return null;
    }
  });

  const isEmploye = computed(() => {
    return user.value?.roles?.includes('employe') ?? false;
  });

  const isClient = computed(() => {
    return user.value?.roles?.includes('client') ?? false;
  });

  const userName = computed(() => {
    return user.value?.name ?? null;
  });

  return {
    isEmploye,
    isClient,
    userName,
  };
};