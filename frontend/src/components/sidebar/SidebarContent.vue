<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
    <div class="flex h-16 shrink-0 items-center">
      <i class="fas fa-vote-yea text-2xl text-blue-600 mr-2"></i>
      <span class="text-xl font-bold text-gray-900">{{ title }}</span>
    </div>
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <router-link
                :to="item.href"
                :class="[
                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold items-center',
                  item.current
                    ? 'bg-gray-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                ]"
              >
                <i
                  :class="[
                    'shrink-0 w-6 flex items-center justify-center',
                    item.current
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-indigo-600',
                    item.icon,
                  ]"
                  aria-hidden="true"
                ></i>
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <li class="mt-auto">
          <a
            href="#"
            class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 items-center"
          >
            <i
              class="fas fa-cog text-gray-400 group-hover:text-indigo-600 shrink-0 w-6 flex items-center justify-center"
              aria-hidden="true"
            />
            Settings
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation';

defineProps<{
  title: string;
}>();

const { navigation } = useNavigation();
</script>
