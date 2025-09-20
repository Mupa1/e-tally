<template>
  <div>
    <!-- Mobile Sidebar -->
    <MobileSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Desktop Sidebar -->
    <DesktopSidebar />

    <!-- Main content area -->
    <div class="lg:pl-72">
      <!-- Mobile Top Bar -->
      <MobileTopBar
        :page-title="props.pageTitle"
        :page-subtitle="props.pageSubtitle"
        @open-sidebar="sidebarOpen = true"
      />

      <!-- Desktop Top Bar -->
      <DesktopTopBar
        :page-title="props.pageTitle"
        :page-subtitle="props.pageSubtitle"
      />

      <!-- Page Content -->
      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <!-- Page Content Slot -->
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MobileSidebar, DesktopSidebar } from './sidebar';
import { MobileTopBar, DesktopTopBar } from './topbar';

// Props for page header
const props = defineProps<{
  pageTitle: string;
  pageSubtitle: string;
}>();

const sidebarOpen = ref(false);
</script>
