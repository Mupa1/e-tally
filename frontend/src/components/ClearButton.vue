<template>
  <button
    v-if="show"
    type="button"
    class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
    @click="handleClick"
    :title="title"
  >
    <i class="fas fa-times text-sm"></i>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue';

interface Props {
  show?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  title: 'Clear all filters',
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
