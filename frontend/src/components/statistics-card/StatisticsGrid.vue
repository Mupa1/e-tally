<template>
  <div class="statistics-grid" :class="gridClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface StatisticsGridProps {
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<StatisticsGridProps>(), {
  columns: 3,
  gap: 'md',
  padding: 'md',
});

const gridClasses = computed(() => {
  const classes = [];

  // Column classes
  const columnMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };
  classes.push(columnMap[props.columns]);

  // Gap classes
  const gapMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };
  classes.push(gapMap[props.gap]);

  // Padding classes
  const paddingMap = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  if (paddingMap[props.padding]) {
    classes.push(paddingMap[props.padding]);
  }

  return classes.join(' ');
});
</script>

<style scoped>
.statistics-grid {
  @apply grid;
}
</style>
