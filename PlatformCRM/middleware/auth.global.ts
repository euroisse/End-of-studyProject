export default defineNuxtRouteMiddleware((to, from)=>{
    // skip middleware on server
    if (import.meta.server) return
    const userInfos = localStorage.getItem('user');
    if (!userInfos){
        if(to.path !== '/'){
            return navigateTo('/')
        }
    }
    
})