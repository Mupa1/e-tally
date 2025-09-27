<template>
  <div class="form-section">
    <h4 v-if="title" class="text-md font-medium text-gray-900 mb-4">
      {{ title }}
    </h4>
    <div :class="gridClasses">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';

interface Props {
  title?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  columns: 2,
  gap: 'md',
});

const gridClasses = computed(() => {
  const baseClasses = 'grid grid-cols-1';

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return [
    baseClasses,
    columnClasses[props.columns],
    gapClasses[props.gap],
  ].join(' ');
});
</script>

<style scoped>
.form-section {
  /* Add any specific styles here if needed */
}
</style>
