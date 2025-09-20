<template>
  <div
    class="fixed inset-0 bg-black/50 transition-opacity"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
defineEmits<{
  close: [];
}>();
</script>
