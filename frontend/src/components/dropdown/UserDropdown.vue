<template>
  <Dropdown
    :items="userMenuItems"
    :button-class="buttonClass"
    position="right"
    @item-click="handleItemClick"
  >
    <template #button>
      <div class="flex items-center">
        <div
          class="size-8 rounded-full bg-gray-50 flex items-center justify-center"
        >
          <i class="fas fa-user text-gray-600"></i>
        </div>
        <span class="hidden lg:flex lg:items-center ml-3">
          <span
            class="text-sm/6 font-semibold text-gray-900"
            aria-hidden="true"
            >{{ user?.firstName || 'User' }}</span
          >
          <ChevronDownIcon
            class="ml-2 size-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import Dropdown, { type DropdownItem } from './Dropdown.vue';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;

defineProps<{
  buttonClass?: string;
}>();

const emit = defineEmits<{
  'item-click': [item: DropdownItem];
}>();

const userMenuItems = computed((): DropdownItem[][] => [
  [
    {
      id: 'profile',
      label: 'Your Profile',
      icon: 'fas fa-user',
      action: () => {
        // Navigate to profile page
        console.log('Navigate to profile');
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'fas fa-cog',
      action: () => {
        // Navigate to settings page
        console.log('Navigate to settings');
      },
    },
  ],
  [
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'fas fa-question-circle',
      action: () => {
        // Navigate to help page
        console.log('Navigate to help');
      },
    },
  ],
  [
    {
      id: 'logout',
      label: 'Sign out',
      icon: 'fas fa-sign-out-alt',
      action: async () => {
        await authStore.logout();
        router.push('/login');
      },
    },
  ],
]);

const handleItemClick = (item: DropdownItem) => {
  emit('item-click', item);
};
</script>
