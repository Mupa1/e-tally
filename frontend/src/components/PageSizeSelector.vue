<template>
  <div class="flex items-center space-x-3">
    <div class="flex border border-gray-300 rounded-lg overflow-hidden">
      <button
        v-for="size in pageSizes"
        :key="size"
        class="px-3 py-2 text-sm font-medium border-r border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 transition-colors duration-200 last:border-r-0"
        @click="handlePageSizeChange(size)"
        :class="{
          'bg-indigo-600 text-white hover:bg-indigo-700':
            currentPageSize === size,
          'bg-white text-gray-700': currentPageSize !== size,
        }"
      >
        {{ size }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue';

interface Props {
  currentPageSize: number;
  pageSizes?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50],
});

const emit = defineEmits<{
  'page-size-change': [size: number];
}>();

const handlePageSizeChange = (size: number) => {
  emit('page-size-change', size);
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
