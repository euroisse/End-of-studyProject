<template>
     <div class="min-h-screen flex flex-col">
        <Header/>
        <slot/>
    </div>
</template>

<script setup lang="ts">
import Header from '~/components/iu/Header.vue';
</script>

<style scoped>

</style>