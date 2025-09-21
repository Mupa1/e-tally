<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Optional title and description -->
      <div v-if="title || description" class="text-center mb-16">
        <h2
          v-if="title"
          class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          {{ title }}
        </h2>
        <p v-if="description" class="mt-4 text-lg leading-8 text-gray-600">
          {{ description }}
        </p>
      </div>

      <!-- Statistics grid -->
      <dl :class="gridClasses">
        <div
          v-for="stat in stats"
          :key="stat.id"
          class="mx-auto flex max-w-xs flex-col gap-y-4"
        >
          <dt class="text-base/7 text-gray-600">{{ stat.name }}</dt>
          <dd
            :class="[
              'order-first text-3xl font-semibold tracking-tight sm:text-5xl',
              stat.color ? `text-${stat.color}-600` : 'text-gray-900',
            ]"
          >
            {{ formattedValue(stat) }}
          </dd>
          <!-- Optional subtitle -->
          <dd v-if="stat.subtitle" class="text-sm text-gray-500">
            {{ stat.subtitle }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

// Define the props interface
interface StatItem {
  id: string | number;
  name: string;
  value: string | number;
  subtitle?: string;
  color?:
    | 'blue'
    | 'green'
    | 'red'
    | 'yellow'
    | 'purple'
    | 'indigo'
    | 'pink'
    | 'gray';
  format?: 'number' | 'currency' | 'percentage' | 'text';
}

interface Props {
  stats: StatItem[];
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  loading?: boolean;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  loading: false,
});

// Computed grid classes based on columns
const gridClasses = computed(() => {
  const columnMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-2',
    3: 'grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3',
    4: 'grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-2 xl:grid-cols-4',
    5: 'grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-2 xl:grid-cols-5',
    6: 'grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-2 xl:grid-cols-6',
  };
  return columnMap[props.columns];
});

// Format value based on type
const formattedValue = (stat: StatItem) => {
  if (props.loading) {
    return '...';
  }

  if (stat.format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(stat.value));
  }

  if (stat.format === 'percentage') {
    return `${stat.value}%`;
  }

  if (stat.format === 'number') {
    return new Intl.NumberFormat('en-US').format(Number(stat.value));
  }

  return stat.value;
};
</script>
