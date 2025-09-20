<template>
  <!-- Mobile top bar -->
  <div class="sticky top-0 z-40 lg:hidden">
    <TopBarContent
      :page-title="pageTitle"
      :page-subtitle="pageSubtitle"
      :show-hamburger="true"
      @open-sidebar="$emit('open-sidebar')"
    />
  </div>
</template>

<script setup lang="ts">
import TopBarContent from './TopBarContent.vue';

defineProps<{
  pageTitle: string;
  pageSubtitle: string;
}>();

defineEmits<{
  'open-sidebar': [];
}>();
</script>
