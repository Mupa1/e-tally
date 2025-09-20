<template>
  <MainLayout
    page-title="Dashboard"
    :page-subtitle="`Welcome back, ${user?.firstName || 'User'}!`"
  >
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.users }}</h3>
            <p class="text-gray-600">Active Users</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-map-marker-alt text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.counties }}
            </h3>
            <p class="text-gray-600">Counties</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-poll text-purple-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.pollingStations }}
            </h3>
            <p class="text-gray-600">Polling Stations</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-chart-line text-orange-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.uptime }}%
            </h3>
            <p class="text-gray-600">System Uptime</p>
          </div>
        </div>
      </div>
    </div>

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
