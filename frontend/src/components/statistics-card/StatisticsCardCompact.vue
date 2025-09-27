<template>
  <div class="statistics-card-compact" :class="cardClasses">
    <div class="card-content">
      <!-- Icon -->
      <div v-if="icon" class="icon-container" :class="iconClasses">
        <i :class="icon"></i>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="name">{{ name }}</div>
        <div class="value" :class="valueClasses">
          <template v-if="loading">
            <div class="loading-skeleton"></div>
          </template>
          <template v-else>
            {{ formattedValue }}
          </template>
        </div>
        <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface StatisticsCardCompactProps {
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

const props = withDefaults(defineProps<StatisticsCardCompactProps>(), {
  color: 'blue',
  format: 'text',
  loading: false,
});

const cardClasses = computed(() => {
  const baseClasses =
    'bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md';
  return baseClasses;
});

const iconClasses = computed(() => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    pink: 'text-pink-600 bg-pink-50',
    orange: 'text-orange-600 bg-orange-50',
  };
  return `w-10 h-10 rounded-lg flex items-center justify-center ${
    colorMap[props.color]
  }`;
});

const valueClasses = computed(() => {
  const colorMap = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    red: 'text-red-900',
    yellow: 'text-yellow-900',
    purple: 'text-purple-900',
    indigo: 'text-indigo-900',
    pink: 'text-pink-900',
    orange: 'text-orange-900',
  };
  return `text-2xl font-bold ${colorMap[props.color]}`;
});

const formattedValue = computed(() => {
  if (props.loading) return '';

  const val = props.value;

  switch (props.format) {
    case 'number':
      return typeof val === 'number' ? val.toLocaleString() : val;
    case 'currency':
      return typeof val === 'number' ? `$${val.toLocaleString()}` : val;
    case 'percentage':
      return typeof val === 'number' ? `${val}%` : val;
    default:
      return val;
  }
});
</script>

<style scoped>
.statistics-card-compact {
  min-height: 120px;
}

.card-content {
  display: flex;
  align-items: flex-start;
  height: 100%;
  gap: 0.75rem;
}

.content {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.value {
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}

.loading-skeleton {
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  height: 1.5rem;
  width: 4rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.icon-container i {
  font-size: 1.125rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
