<template>
  <MainLayout
    page-title="Polling Station Details"
    page-subtitle="View and manage polling station information"
  >
    <!-- Error Alert -->
    <ErrorAlert
      :show="!!pollingStationManagementStore.error"
      :message="pollingStationManagementStore.error || ''"
      @dismiss="pollingStationManagementStore.clearError()"
    />

    <!-- Loading State -->
    <LoadingState
      v-if="pollingStationManagementStore.loading"
      message="Loading polling station details..."
    />

    <!-- Polling Station Details -->
    <div v-else-if="pollingStation" class="space-y-6">
      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticsCardCompact
          title="Total Registered Voters"
          :value="stats?.voterStats?.totalRegisteredVoters || 0"
          icon="fas fa-users"
          color="blue"
          :loading="pollingStationManagementStore.loading"
        />
        <StatisticsCardCompact
          title="Average Voters"
          :value="stats?.voterStats?.averageRegisteredVoters || 0"
          icon="fas fa-chart-line"
          color="green"
          :loading="pollingStationManagementStore.loading"
          format="number"
        />
        <StatisticsCardCompact
          title="Status"
          :value="pollingStation.isActive ? 'Active' : 'Inactive'"
          icon="fas fa-check-circle"
          :color="pollingStation.isActive ? 'green' : 'red'"
          :loading="false"
        />
      </div>

      <!-- Polling Station Information -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-poll mr-2 text-indigo-600"></i>
            Polling Station Information
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Code</label
              >
              <div
                class="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg"
              >
                {{ pollingStation.code }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Name</label
              >
              <div class="text-sm text-gray-900">
                {{ pollingStation.name }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Constituency</label
              >
              <div class="text-sm text-gray-900">
                <div class="font-medium">
                  {{ pollingStation.constituency?.code }} -
                  {{ pollingStation.constituency?.name }}
                </div>
                <div class="text-gray-500">
                  {{ pollingStation.constituency?.county?.name }} County
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >CAW</label
              >
              <div class="text-sm text-gray-900">
                <div class="font-medium">
                  {{ pollingStation.caw?.code }} -
                  {{ pollingStation.caw?.name }}
                </div>
              </div>
            </div>
            <div v-if="pollingStation.address">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Address</label
              >
              <div class="text-sm text-gray-900">
                {{ pollingStation.address }}
              </div>
            </div>
            <div v-if="pollingStation.latitude && pollingStation.longitude">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Coordinates</label
              >
              <div class="text-sm text-gray-900 font-mono">
                {{ pollingStation.latitude }}, {{ pollingStation.longitude }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Last Updated</label
              >
              <div class="text-sm text-gray-900">
                {{ formatDate(pollingStation.updatedAt) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Status</label
              >
              <div class="text-sm">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    pollingStation.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  <i
                    :class="[
                      'fas mr-1',
                      pollingStation.isActive
                        ? 'fa-check-circle'
                        : 'fa-times-circle',
                    ]"
                  ></i>
                  {{ pollingStation.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-bolt mr-2 text-indigo-600"></i>
            Quick Actions
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-if="user?.role === 'SUPER_ADMIN'"
              @click="editPollingStation"
              class="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <i class="fas fa-edit mr-3 text-indigo-600"></i>
              <div class="text-left">
                <div class="font-medium">Edit Polling Station</div>
                <div class="text-xs text-gray-500">
                  Update polling station details
                </div>
              </div>
            </button>
            <button
              @click="viewParentCAW"
              class="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <i class="fas fa-building mr-3 text-indigo-600"></i>
              <div class="text-left">
                <div class="font-medium">View Parent CAW</div>
                <div class="text-xs text-gray-500">Go to CAW details</div>
              </div>
            </button>
            <button
              @click="viewParentConstituency"
              class="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <i class="fas fa-landmark mr-3 text-indigo-600"></i>
              <div class="text-left">
                <div class="font-medium">View Parent Constituency</div>
                <div class="text-xs text-gray-500">
                  Go to constituency details
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center p-8">
      <i class="fas fa-poll fa-3x text-gray-300 mb-4"></i>
      <h4 class="text-lg font-medium text-gray-900 mb-2">
        Polling Station Not Found
      </h4>
      <p class="text-gray-600 mb-4">
        The polling station you're looking for doesn't exist or has been
        removed.
      </p>
      <button
        @click="goBack"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Go Back
      </button>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePollingStationManagementStore } from '@/stores/pollingStationManagement';
import MainLayout from '@/components/MainLayout.vue';
import { ErrorAlert, StatisticsCardCompact, LoadingState } from '@/components';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const pollingStationManagementStore = usePollingStationManagementStore();

// Reactive data
const pollingStation = ref<any>(null);
const stats = ref<any>(null);

// Computed properties
const user = computed(() => authStore.user);

// Methods
const loadPollingStation = async () => {
  const pollingStationId = route.params.id as string;
  if (!pollingStationId) return;

  try {
    // Fetch polling station details
    const pollingStationData =
      await pollingStationManagementStore.fetchPollingStationById(
        pollingStationId
      );
    pollingStation.value = pollingStationData;

    // Fetch polling station statistics
    const statsData =
      await pollingStationManagementStore.fetchPollingStationStats(
        pollingStationId
      );
    stats.value = statsData;
  } catch (error) {
    console.error('Error loading polling station:', error);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const editPollingStation = () => {
  // TODO: Implement edit functionality
  console.log('Edit polling station:', pollingStation.value?.id);
};

const viewParentCAW = () => {
  if (pollingStation.value?.caw?.id) {
    router.push(`/caws/${pollingStation.value.caw.id}`);
  }
};

const viewParentConstituency = () => {
  if (pollingStation.value?.constituency?.id) {
    router.push(`/constituencies/${pollingStation.value.constituency.id}`);
  }
};

const goBack = () => {
  router.back();
};

// Lifecycle
onMounted(() => {
  loadPollingStation();
});
</script>
