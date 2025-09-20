<template>
  <!-- Static sidebar for desktop -->
  <div
    class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r border-gray-200 shadow-sm"
  >
    <!-- Sidebar component -->
    <SidebarContent title="e-Tally Dashboard" />
  </div>
</template>

<script setup lang="ts">
import SidebarContent from './SidebarContent.vue';
</script>
