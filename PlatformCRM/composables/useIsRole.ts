import { computed, ref, onMounted } from 'vue';

export const useIsRole = () => {
  const userString = ref<string | null>(null);

  onMounted(() => {
    userString.value = localStorage.getItem('user');
  });

  const user = computed(() => {
    try {
      if (userString.value) {
        return userString.value ? JSON.parse(userString.value) : null;
      }
      return null;
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

  const isAdmin = computed(() => {
    return user.value?.roles?.includes('admin') ?? false;
  });

  const userName = computed(() => {
    return user.value?.name ?? null;
  });

  return {
    isEmploye,
    isClient,
    isAdmin,
    userName,
  };
};