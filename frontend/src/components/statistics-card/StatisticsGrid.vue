<template>
  <div :class="containerClasses">
    <!-- Optional header -->
    <div v-if="title || description" class="mb-8">
      <h2 v-if="title" class="text-2xl font-bold text-gray-900 mb-2">
        {{ title }}
      </h2>
      <p v-if="description" class="text-gray-600">{{ description }}</p>
    </div>

    <!-- Statistics grid -->
    <div :class="gridClasses">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

interface Props {
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  gap: 'lg',
  padding: 'lg',
});

// Container classes
const containerClasses = computed(() => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };
  return paddingMap[props.padding];
});

// Grid classes
const gridClasses = computed(() => {
  const columnMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gapMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  return `grid ${columnMap[props.columns]} ${gapMap[props.gap]}`;
});
</script>
