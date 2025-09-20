<template>
  <div class="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
    <div class="p-6 flex-1 flex flex-col">
      <h6
        class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4"
      >
        Navigation
      </h6>
      <nav class="flex-1">
        <ul class="space-y-1">
          <!-- Dashboard Section -->
          <li>
            <router-link
              to="/dashboard"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="
                $route.name === 'Dashboard'
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              "
            >
              <i
                class="fas fa-tachometer-alt mr-3 text-gray-400 group-hover:text-gray-500"
              ></i>
              Dashboard
            </router-link>
          </li>

          <!-- User Management -->
          <li>
            <router-link
              to="/users"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="
                $route.name === 'UserManagement'
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              "
            >
              <i
                class="fas fa-users mr-3 text-gray-400 group-hover:text-gray-500"
              ></i>
              User Management
            </router-link>
          </li>

          <!-- Polling Station Management Dropdown -->
          <li class="relative">
            <button
              class="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
              @click="toggleElectionDropdown"
            >
              <div class="flex items-center">
                <i
                  class="fas fa-poll mr-3 text-gray-400 group-hover:text-gray-500"
                ></i>
                Polling Station Management
              </div>
              <i
                class="fas fa-chevron-down text-xs transition-transform duration-200"
                :class="{ 'rotate-180': electionDropdownOpen }"
              ></i>
            </button>

            <!-- Dropdown Menu -->
            <div v-show="electionDropdownOpen" class="mt-1 ml-8 space-y-1">
              <router-link
                to="/pollingstation"
                class="group flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
              >
                <i
                  class="fas fa-home mr-3 text-gray-400 group-hover:text-gray-500"
                ></i>
                Overview
              </router-link>
              <div class="border-t border-gray-200 my-1"></div>
              <router-link
                to="/counties"
                class="group flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200"
                :class="
                  $route.name === 'CountyManagement'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                "
              >
                <i
                  class="fas fa-map-marker-alt mr-3 text-gray-400 group-hover:text-gray-500"
                ></i>
                Counties
              </router-link>
              <router-link
                to="/constituencies"
                class="group flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200"
                :class="
                  $route.name === 'ConstituencyManagement'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                "
              >
                <i
                  class="fas fa-map mr-3 text-gray-400 group-hover:text-gray-500"
                ></i>
                Constituencies
              </router-link>
              <a
                href="#"
                class="group flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
                :class="{
                  'bg-primary-100 text-primary-700':
                    $route.name === 'CAWManagement',
                }"
              >
                <i
                  class="fas fa-building mr-3 text-gray-400 group-hover:text-gray-500"
                ></i>
                Wards
              </a>
              <router-link
                to="/pollingstation"
                class="group flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
                :class="{
                  'bg-primary-100 text-primary-700':
                    $route.name === 'PollingStationManagement',
                }"
                @click="handlePollingStationClick"
              >
                <i
                  class="fas fa-poll mr-3 text-gray-400 group-hover:text-gray-500"
                ></i>
                Polling Stations
              </router-link>
            </div>
          </li>

          <!-- Candidates -->
          <li>
            <a
              href="#"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
              :class="{
                'bg-primary-100 text-primary-700 border-r-2 border-primary-500':
                  $route.name === 'CandidateManagement',
              }"
            >
              <i
                class="fas fa-user-tie mr-3 text-gray-400 group-hover:text-gray-500"
              ></i>
              Candidates
            </a>
          </li>

          <!-- Election Results -->
          <li>
            <a
              href="#"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
              :class="{
                'bg-primary-100 text-primary-700 border-r-2 border-primary-500':
                  $route.name === 'ElectionResults',
              }"
            >
              <i
                class="fas fa-chart-line mr-3 text-gray-400 group-hover:text-gray-500"
              ></i>
              Election Results
            </a>
          </li>

          <!-- Incidents -->
          <li>
            <a
              href="#"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
              :class="{
                'bg-primary-100 text-primary-700 border-r-2 border-primary-500':
                  $route.name === 'IncidentManagement',
              }"
            >
              <i
                class="fas fa-exclamation-triangle mr-3 text-gray-400 group-hover:text-gray-500"
              ></i>
              Incidents
            </a>
          </li>

          <!-- Audit Logs -->
          <li>
            <a
              href="#"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
              :class="{
                'bg-primary-100 text-primary-700 border-r-2 border-primary-500':
                  $route.name === 'AuditLogs',
              }"
            >
              <i
                class="fas fa-clipboard-list mr-3 text-gray-400 group-hover:text-gray-500"
              ></i>
              Audit Logs
            </a>
          </li>
        </ul>
      </nav>

      <!-- User Profile Section -->
      <div class="mt-auto pt-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-user-circle text-gray-600 text-xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">
                {{ user?.firstName }} {{ user?.lastName }}
              </div>
              <div class="text-xs text-gray-500 truncate">{{ user?.role }}</div>
            </div>
          </div>
          <button
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
            @click="handleLogout"
            title="Logout"
          >
            <i class="fas fa-sign-out-alt text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Reactive data
const electionDropdownOpen = ref(false);

// Computed
const user = computed(() => authStore.user);

// Methods
const toggleElectionDropdown = () => {
  electionDropdownOpen.value = !electionDropdownOpen.value;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const handlePollingStationClick = () => {
  // Click handler for polling station navigation
};
</script>

<style scoped>
/* Sidebar styles are now globally available via main.ts */
</style>
