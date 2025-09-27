<template>
  <MainLayout
    page-title="Dashboard"
    :page-subtitle="`Welcome back, ${user?.firstName || 'User'}!`"
  >
    <!-- Stats Cards -->
    <StatisticsGrid :columns="4" gap="lg" padding="none" class="mb-8">
      <StatisticsCardCompact
        name="Active Users"
        :value="stats.users"
        format="number"
        icon="fas fa-users"
        color="blue"
      />
      <StatisticsCardCompact
        name="Counties"
        :value="stats.counties"
        format="number"
        icon="fas fa-map-marker-alt"
        color="green"
      />
      <StatisticsCardCompact
        name="Polling Stations"
        :value="stats.pollingStations"
        format="number"
        icon="fas fa-poll"
        color="purple"
      />
      <StatisticsCardCompact
        name="System Uptime"
        :value="`${stats.uptime}%`"
        format="text"
        icon="fas fa-chart-line"
        color="orange"
      />
    </StatisticsGrid>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h5 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-clock text-blue-600 mr-2"></i>
              Recent Activity
            </h5>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-map-marker-alt text-blue-600 text-sm"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-gray-900 font-medium">
                    County management system activated
                  </p>
                  <p class="text-sm text-gray-500">Just now</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-user-plus text-green-600 text-sm"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-gray-900 font-medium">
                    User management system operational
                  </p>
                  <p class="text-sm text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-shield-alt text-blue-600 text-sm"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-gray-900 font-medium">
                    Authentication system secured and running
                  </p>
                  <p class="text-sm text-gray-500">10 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h5 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-info-circle text-blue-600 mr-2"></i>
              System Status
            </h5>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-gray-700">Database</span>
                </div>
                <span class="text-sm font-medium text-green-600">Online</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-gray-700">API Server</span>
                </div>
                <span class="text-sm font-medium text-green-600">Online</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-gray-700">Mobile App</span>
                </div>
                <span class="text-sm font-medium text-green-600">Online</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span class="text-gray-700">Backup System</span>
                </div>
                <span class="text-sm font-medium text-yellow-600">Syncing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserManagementStore } from '@/stores/userManagement';
import { useCountyManagementStore } from '@/stores/countyManagement';
import MainLayout from '@/components/MainLayout.vue';
import {
  StatisticsGrid,
  StatisticsCardCompact,
} from '@/components/statistics-card';

const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();
const countyManagementStore = useCountyManagementStore();

const user = computed(() => authStore.user);

// Stats data
const stats = ref({
  users: 0,
  counties: 0,
  pollingStations: 0,
  uptime: 99.9,
});

// Fetch dashboard stats
const fetchStats = async () => {
  try {
    // Fetch users count
    await userManagementStore.fetchUsers({ page: 1, limit: 1 });
    stats.value.users = userManagementStore.pagination.total;

    // Fetch counties count
    await countyManagementStore.fetchCounties({ page: 1, limit: 1 });
    stats.value.counties = countyManagementStore.pagination.total;

    // Mock data for other stats
    stats.value.pollingStations = 40883;
    stats.value.uptime = 99.9;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Set fallback values
    stats.value = {
      users: 4,
      counties: 2,
      pollingStations: 40883,
      uptime: 99.9,
    };
  }
};

onMounted(() => {
  fetchStats();
});
</script>
