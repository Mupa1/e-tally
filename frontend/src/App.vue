<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initializeAuth();
});
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
