<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div
          :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center',
            iconBgClass,
          ]"
        >
          <i :class="[iconClass, iconColorClass]"></i>
        </div>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-500">{{ name }}</p>
        <p class="text-2xl font-semibold text-gray-900">{{ formattedValue }}</p>
        <small v-if="subtitle" class="text-gray-500">{{ subtitle }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

interface Props {
  name: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?:
    | 'blue'
    | 'green'
    | 'red'
    | 'yellow'
    | 'purple'
    | 'indigo'
    | 'pink'
    | 'orange';
  format?: 'number' | 'currency' | 'percentage' | 'text';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  format: 'text',
  loading: false,
});

// Computed classes for icon styling
const iconBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    indigo: 'bg-indigo-100',
    pink: 'bg-pink-100',
    orange: 'bg-orange-100',
  };
  return colorMap[props.color];
});

const iconColorClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600',
    orange: 'text-orange-600',
  };
  return colorMap[props.color];
});

const iconClass = computed(() => {
  return props.icon || 'fas fa-chart-bar';
});

// Format value based on type
const formattedValue = computed(() => {
  if (props.loading) {
    return '...';
  }

  if (props.format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(props.value));
  }

  if (props.format === 'percentage') {
    return `${props.value}%`;
  }

  if (props.format === 'number') {
    return new Intl.NumberFormat('en-US').format(Number(props.value));
  }

  return props.value;
});
</script>
