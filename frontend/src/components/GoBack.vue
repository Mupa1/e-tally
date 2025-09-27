<template>
  <router-link
    :to="to"
    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
  >
    <i class="fas fa-arrow-left mr-2"></i>
    {{ text }}
  </router-link>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  to: string;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Go Back',
});
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
