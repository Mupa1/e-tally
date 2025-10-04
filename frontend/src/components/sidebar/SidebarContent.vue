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
          <div>
            <button
              @click="toggleExpanded('Settings')"
              :class="[
                'group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold items-center justify-between',
                expandedItems['Settings']
                  ? 'bg-gray-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
              ]"
            >
              <div class="flex gap-x-3 items-center">
                <i
                  :class="[
                    'shrink-0 w-6 flex items-center justify-center',
                    expandedItems['Settings']
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-indigo-600',
                    'fas fa-cog',
                  ]"
                  aria-hidden="true"
                ></i>
                Settings
              </div>
              <i
                :class="[
                  'fas fa-chevron-down text-xs transition-transform duration-200',
                  expandedItems['Settings'] ? 'rotate-180' : '',
                ]"
              ></i>
            </button>

            <!-- Settings submenu items -->
            <div v-if="expandedItems['Settings']" class="ml-6 mt-1 space-y-1">
              <!-- Electoral Areas submenu -->
              <div>
                <button
                  @click="toggleExpanded('Electoral Areas')"
                  :class="[
                    'group flex w-full gap-x-3 rounded-md p-2 text-sm font-medium items-center justify-between',
                    expandedItems['Electoral Areas']
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                  ]"
                >
                  <div class="flex gap-x-3 items-center">
                    <i
                      :class="[
                        'shrink-0 w-4 flex items-center justify-center',
                        expandedItems['Electoral Areas']
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'fas fa-sitemap',
                      ]"
                      aria-hidden="true"
                    ></i>
                    Electoral Areas
                  </div>
                  <i
                    :class="[
                      'fas fa-chevron-down text-xs transition-transform duration-200',
                      expandedItems['Electoral Areas'] ? 'rotate-180' : '',
                    ]"
                  ></i>
                </button>

                <!-- Electoral Areas submenu items -->
                <div
                  v-if="expandedItems['Electoral Areas']"
                  class="ml-6 mt-1 space-y-1"
                >
                  <router-link
                    to="/election-overview"
                    :class="[
                      'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                      $route.name === 'ElectionHierarchyOverview'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                    ]"
                  >
                    <i
                      :class="[
                        'shrink-0 w-4 flex items-center justify-center',
                        $route.name === 'ElectionHierarchyOverview'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'fas fa-chart-pie',
                      ]"
                      aria-hidden="true"
                    ></i>
                    Overview
                  </router-link>
                  <router-link
                    to="/counties"
                    :class="[
                      'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                      $route.name === 'CountyManagement'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                    ]"
                  >
                    <i
                      :class="[
                        'shrink-0 w-4 flex items-center justify-center',
                        $route.name === 'CountyManagement'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'fas fa-map-marker-alt',
                      ]"
                      aria-hidden="true"
                    ></i>
                    Counties
                  </router-link>
                  <router-link
                    to="/constituencies"
                    :class="[
                      'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                      $route.name === 'ConstituencyManagement'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                    ]"
                  >
                    <i
                      :class="[
                        'shrink-0 w-4 flex items-center justify-center',
                        $route.name === 'ConstituencyManagement'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'fas fa-landmark',
                      ]"
                      aria-hidden="true"
                    ></i>
                    Constituency
                  </router-link>
                  <router-link
                    to="/caws"
                    :class="[
                      'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                      $route.name === 'CAWManagement'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                    ]"
                  >
                    <i
                      :class="[
                        'shrink-0 w-4 flex items-center justify-center',
                        $route.name === 'CAWManagement'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'fas fa-building',
                      ]"
                      aria-hidden="true"
                    ></i>
                    County Assembly Wards
                  </router-link>
                  <router-link
                    to="/pollingstation"
                    :class="[
                      'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                      $route.name === 'PollingStationManagement'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                    ]"
                  >
                    <i
                      :class="[
                        'shrink-0 w-4 flex items-center justify-center',
                        $route.name === 'PollingStationManagement'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'fas fa-poll',
                      ]"
                      aria-hidden="true"
                    ></i>
                    Polling Stations
                  </router-link>
                </div>
              </div>

              <!-- Data Management -->
              <router-link
                to="/data-management"
                :class="[
                  'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                  $route.name === 'DataManagement'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                ]"
              >
                <i
                  :class="[
                    'shrink-0 w-4 flex items-center justify-center',
                    $route.name === 'DataManagement'
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-indigo-600',
                    'fas fa-database',
                  ]"
                  aria-hidden="true"
                ></i>
                Data Management
              </router-link>

              <!-- User Management -->
              <router-link
                to="/users"
                :class="[
                  'group flex gap-x-3 rounded-md p-2 text-sm font-medium items-center',
                  $route.name === 'UserManagement'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600',
                ]"
              >
                <i
                  :class="[
                    'shrink-0 w-4 flex items-center justify-center',
                    $route.name === 'UserManagement'
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-indigo-600',
                    'fas fa-users',
                  ]"
                  aria-hidden="true"
                ></i>
                User Management
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigation } from '@/composables/useNavigation';

defineProps<{
  title: string;
}>();

const { navigation } = useNavigation();
const route = useRoute();

// Track expanded state for each menu item
const expandedItems = reactive<Record<string, boolean>>({});

// Initialize expanded state based on current route
const initializeExpandedState = () => {
  navigation.value.forEach((item) => {
    if (item.children) {
      expandedItems[item.name] = item.expanded || false;
    }
  });

  // Check if any Electoral Areas page is active to expand Settings and Electoral Areas
  const electoralAreasRoutes = [
    'ElectionHierarchyOverview',
    'CountyManagement',
    'ConstituencyManagement',
    'CAWManagement',
    'PollingStationManagement',
  ];

  // Check if any Settings submenu page is active to expand Settings
  const settingsRoutes = [
    'DataManagement',
    'UserManagement',
    ...electoralAreasRoutes,
  ];

  if (electoralAreasRoutes.includes(route.name as string)) {
    expandedItems['Settings'] = true;
    expandedItems['Electoral Areas'] = true;
  } else if (settingsRoutes.includes(route.name as string)) {
    expandedItems['Settings'] = true;
  }
};

// Watch for navigation changes and update expanded state
watch(navigation, initializeExpandedState, { immediate: true });

const toggleExpanded = (itemName: string) => {
  expandedItems[itemName] = !expandedItems[itemName];
};
</script>
