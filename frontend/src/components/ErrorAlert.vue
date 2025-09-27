<template>
  <div
    v-if="show"
    class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
  >
    <div class="flex items-center">
      <i class="fas fa-exclamation-circle text-red-600 mr-3"></i>
      <span class="text-red-800 font-medium">{{ message }}</span>
      <button
        v-if="dismissible"
        type="button"
        @click="handleDismiss"
        class="ml-auto text-red-400 hover:text-red-600 transition-colors duration-200"
        :title="dismissTitle"
      >
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue';

interface Props {
  show: boolean;
  message: string;
  dismissible?: boolean;
  dismissTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
  dismissTitle: 'Dismiss alert',
});

const emit = defineEmits<{
  dismiss: [];
}>();

const handleDismiss = () => {
  emit('dismiss');
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
