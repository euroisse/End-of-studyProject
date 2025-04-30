import { ref, onMounted } from 'vue';

export function useIsLogin() {
  const isLoggedIn = ref(false);
  const userInfos = localStorage.getItem('user');
console.log('composable', isLoggedIn, userInfos)
  onMounted(() => {
  
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