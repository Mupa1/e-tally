<template>
  <div class="text-center p-8">
    <div
      class="inline-flex items-center justify-center w-8 h-8 text-indigo-600"
    >
      <i class="fas fa-spinner fa-spin text-2xl"></i>
    </div>
    <p class="mt-2 text-gray-600">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
});
</script>
