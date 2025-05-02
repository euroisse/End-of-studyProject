import { computed } from 'vue';

export const useIsRole = () => {
  const userString = ref<string|null>(null);

  onMounted(()=> {
    userString.value = localStorage.getItem('user');
  })

  const user = computed(() => {
    try {
      if(userString.value){
        return userString ? JSON.parse(userString.value) : null;
      }
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