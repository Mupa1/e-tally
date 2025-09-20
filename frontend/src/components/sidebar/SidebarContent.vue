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
              <!-- Parent menu item -->
              <div>
                <router-link
                  v-if="!item.children"
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

                <!-- Parent menu with children -->
                <div v-else>
                  <button
                    @click="toggleExpanded(item.name)"
                    :class="[
                      'group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold items-center justify-between',
                      item.current || item.expanded
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                    ]"
                  >
                    <div class="flex gap-x-3 items-center">
                      <i
                        :class="[
                          'shrink-0 w-6 flex items-center justify-center',
                          item.current || item.expanded
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600',
                          item.icon,
                        ]"
                        aria-hidden="true"
                      ></i>
                      {{ item.name }}
                    </div>
                    <i
                      :class="[
                        'fas fa-chevron-down text-xs transition-transform duration-200',
                        expandedItems[item.name] ? 'rotate-180' : '',
                      ]"
                    ></i>
                  </button>

                  <!-- Submenu items -->
                  <div
                    v-if="expandedItems[item.name]"
                    class="ml-6 mt-1 space-y-1"
                  >
                    <router-link
                      v-for="child in item.children"
                      :key="child.name"
                      :to="child.href"
                      :class="[
                        'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                        child.current
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                      ]"
                    >
                      <i
                        :class="[
                          'shrink-0 w-4 flex items-center justify-center',
                          child.current
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600',
                          child.icon,
                        ]"
                        aria-hidden="true"
                      ></i>
                      {{ child.name }}
                    </router-link>
                  </div>
                </div>
              </div>
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
import { ref, reactive, watch } from 'vue';
import { useNavigation } from '@/composables/useNavigation';

defineProps<{
  title: string;
}>();

const { navigation } = useNavigation();

// Track expanded state for each menu item
const expandedItems = reactive<Record<string, boolean>>({});

// Initialize expanded state based on current route
const initializeExpandedState = () => {
  navigation.value.forEach((item) => {
    if (item.children) {
      expandedItems[item.name] = item.expanded || false;
    }
  });
};

// Watch for navigation changes and update expanded state
watch(navigation, initializeExpandedState, { immediate: true });

const toggleExpanded = (itemName: string) => {
  expandedItems[itemName] = !expandedItems[itemName];
};
</script>
