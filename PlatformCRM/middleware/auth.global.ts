export default defineNuxtRouteMiddleware((to, from)=>{
    // skip middleware on server
    if (import.meta.server) return
    const userInfos = localStorage.getItem('user');
    if (!userInfos) {
        // Autoriser l'accès à la page d'initialisation admin même sans connexion
        if (to.path !== '/' && to.path !== '/admin/seed') {
            return navigateTo('/')
        }
    }
    
})