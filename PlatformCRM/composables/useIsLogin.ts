import { ref, onMounted } from 'vue';

export function useIsLogin() {
  const isLoggedIn = ref(false);
  onMounted(() => {
    const userInfos = localStorage.getItem('user');
    
    if (userInfos) {
      isLoggedIn.value = true;
    }
  });

  
  const updateLoginStatus = () => {
    isLoggedIn.value = !!localStorage.getItem('user');
  };

  return {
    isLoggedIn,
    updateLoginStatus,
  };
}