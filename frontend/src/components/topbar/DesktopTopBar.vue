<template>
  <!-- Desktop top bar -->
  <div class="sticky top-0 z-30 bg-white shadow-sm hidden lg:block">
    <TopBarContent
      :page-title="pageTitle"
      :page-subtitle="pageSubtitle"
      :show-hamburger="false"
    />
  </div>
</template>

<script setup lang="ts">
import TopBarContent from './TopBarContent.vue';

defineProps<{
  pageTitle: string;
  pageSubtitle: string;
}>();
</script>
