<template>
  <div
    class="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
  >
    <!-- Mobile Hamburger Menu -->
    <button
      v-if="showHamburger"
      type="button"
      class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
      @click="$emit('open-sidebar')"
    >
      <span class="sr-only">Open sidebar</span>
      <i class="fas fa-bars size-6" aria-hidden="true" />
    </button>

    <!-- Separator (Mobile only) -->
    <div
      v-if="showHamburger"
      class="h-6 w-px bg-gray-200 lg:hidden"
      aria-hidden="true"
    />

    <!-- Page Title and Subtitle -->
    <div class="flex flex-col justify-center min-w-0 flex-1 lg:flex-none">
      <h1 class="text-lg font-semibold text-gray-900 truncate">
        {{ pageTitle }}
      </h1>
      <p class="text-sm text-gray-500 truncate">{{ pageSubtitle }}</p>
    </div>

    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <!-- Search Bar -->
      <form class="flex flex-1" action="#" method="GET">
        <label for="search-field" class="sr-only">Search</label>
        <div class="relative w-full">
          <i
            class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </div>
      </form>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-x-4 lg:gap-x-6">
        <!-- Notifications -->
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">View notifications</span>
          <i class="fas fa-bell size-6" aria-hidden="true" />
        </button>

        <!-- Separator (Desktop only) -->
        <div
          class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
          aria-hidden="true"
        />

        <!-- Profile dropdown -->
        <div class="relative">
          <button type="button" class="relative flex items-center">
            <span class="absolute -inset-1.5" />
            <span class="sr-only">Open user menu</span>
            <div
              class="size-8 rounded-full bg-gray-50 flex items-center justify-center"
            >
              <i class="fas fa-user text-gray-600"></i>
            </div>
            <span class="hidden lg:flex lg:items-center">
              <span
                class="ml-4 text-sm/6 font-semibold text-gray-900"
                aria-hidden="true"
                >{{ user?.firstName || 'User' }}</span
              >
              <i
                class="fas fa-chevron-down ml-2 size-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

defineProps<{
  pageTitle: string;
  pageSubtitle: string;
  showHamburger?: boolean;
}>();

defineEmits<{
  'open-sidebar': [];
}>();

const authStore = useAuthStore();
const user = authStore.user;
</script>
