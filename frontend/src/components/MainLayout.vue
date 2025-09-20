<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute top-0 left-full flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <i
                      class="fas fa-times size-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>

              <!-- Mobile Sidebar Content -->
              <div
                class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <i class="fas fa-vote-yea text-2xl text-blue-600 mr-2"></i>
                  <span class="text-xl font-bold text-gray-900">e-Tally</span>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link
                            :to="item.href"
                            class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            :class="
                              item.current
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                            "
                          >
                            <i
                              :class="[
                                item.current
                                  ? 'text-indigo-600'
                                  : 'text-gray-400 group-hover:text-indigo-600',
                                'size-6 shrink-0',
                                item.icon,
                              ]"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto">
                      <a
                        href="#"
                        class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <i
                          class="fas fa-cog size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <!-- Sidebar component -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center">
          <i class="fas fa-vote-yea text-2xl text-blue-600 mr-2"></i>
          <span class="text-xl font-bold text-gray-900">e-Tally Dashboard</span>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                    :class="
                      item.current
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                    "
                  >
                    <i
                      :class="[
                        item.current
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'size-6 shrink-0',
                        item.icon,
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <a
                href="#"
                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                <i
                  class="fas fa-cog size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                  aria-hidden="true"
                />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main content area -->
    <div class="lg:pl-72">
      <!-- Top Navigation Bar -->
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
      >
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <i class="fas fa-bars size-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <!-- Page Title and Subtitle -->
          <div class="flex items-center">
            <div>
              <h1 class="text-xl font-semibold text-gray-900">
                {{ pageTitle }}
              </h1>
              <p class="text-sm text-gray-500">{{ pageSubtitle }}</p>
            </div>
          </div>

          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">View notifications</span>
              <i class="fas fa-bell size-6" aria-hidden="true" />
            </button>

            <!-- Separator -->
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

      <!-- Page Content -->
      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

// Props for page header
defineProps<{
  pageTitle: string;
  pageSubtitle: string;
}>();

const authStore = useAuthStore();
const route = useRoute();
const user = authStore.user;
const sidebarOpen = ref(false);

// Navigation items
const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'fas fa-tachometer-alt',
    current: computed(() => route.name === 'Dashboard'),
  },
  {
    name: 'User Management',
    href: '/users',
    icon: 'fas fa-users',
    current: computed(() => route.name === 'UserManagement'),
  },
  {
    name: 'County Management',
    href: '/counties',
    icon: 'fas fa-map-marker-alt',
    current: computed(() => route.name === 'CountyManagement'),
  },
  {
    name: 'Constituency Management',
    href: '/constituencies',
    icon: 'fas fa-landmark',
    current: computed(() => route.name === 'ConstituencyManagement'),
  },
  {
    name: 'Polling Station Management',
    href: '/pollingstation',
    icon: 'fas fa-poll',
    current: computed(() => route.name === 'PollingStationManagement'),
  },
];
</script>
