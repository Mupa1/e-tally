<template>
  <MainLayout
    :page-title="caw ? `${caw.name} Details` : 'CAW Details'"
    :page-subtitle="
      caw ? `Viewing details for ${caw.name}` : 'Loading CAW details...'
    "
  >
    <!-- Loading State -->
    <div v-if="loading" class="text-center p-8">
      <div
        class="inline-flex items-center justify-center w-8 h-8 text-indigo-600"
      >
        <i class="fas fa-spinner fa-spin text-2xl"></i>
      </div>
      <p class="mt-2 text-gray-600">Loading CAW details...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-600 mr-3"></i>
        <span class="text-red-800 font-medium">{{ error }}</span>
        <button
          type="button"
          @click="goBack"
          class="ml-auto text-red-400 hover:text-red-600 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>

    <!-- CAW Details -->
    <div v-else-if="caw" class="space-y-6">
      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
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
              <p class="text-sm font-medium text-gray-500">
                Total Registered Voters
              </p>
              <p class="text-2xl font-semibold text-gray-900">
                {{
                  cawManagementStore.stats?.voterStats?.totalRegisteredVoters ||
                  0
                }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-poll text-green-600 text-xl"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Polling Stations</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ caw._count?.pollingStations || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">
                Avg Voters per Station
              </p>
              <p class="text-2xl font-semibold text-gray-900">
                {{
                  Math.round(
                    cawManagementStore.stats?.voterStats
                      ?.averageRegisteredVoters || 0
                  )
                }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-building text-orange-600 text-xl"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">CAW Code</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ caw.code }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Back to CAWs
          </button>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="canEditCAW"
            @click="editCAW"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <i class="fas fa-edit mr-2"></i>
            Edit CAW
          </button>
        </div>
      </div>

      <!-- CAW Information Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-building mr-2 text-indigo-600"></i>
            CAW Information
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Code -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                CAW Code
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {{ caw.code }}
                </span>
              </p>
            </div>

            <!-- Name -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                CAW Name
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                {{ caw.name }}
              </p>
            </div>

            <!-- Constituency -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Constituency
              </h6>
              <div class="text-sm text-gray-900">
                <div class="font-medium">{{ caw.constituency?.code }}</div>
                <div class="text-gray-500">{{ caw.constituency?.name }}</div>
              </div>
            </div>

            <!-- County -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                County
              </h6>
              <div class="text-sm text-gray-900">
                <div class="font-medium">
                  {{ caw.constituency?.county?.code }}
                </div>
                <div class="text-gray-500">
                  {{ caw.constituency?.county?.name }}
                </div>
              </div>
            </div>

            <!-- Polling Stations Count -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Polling Stations
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {{ caw._count?.pollingStations || 0 }}
                </span>
              </p>
            </div>

            <!-- Updated Date -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Last Updated
              </h6>
              <p class="text-sm text-gray-600">
                {{ formatDate(caw.updatedAt) }}
              </p>
            </div>

            <!-- Status -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Status
              </h6>
              <p class="text-sm">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <i class="fas fa-check-circle mr-1"></i>
                  Active
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Polling Stations Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-poll mr-2 text-green-600"></i>
              Polling Stations
            </h3>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {{ caw._count?.pollingStations || 0 }} total
            </span>
          </div>
        </div>
        <div class="p-6">
          <div v-if="pollingStations.length === 0" class="text-center py-8">
            <i class="fas fa-poll text-4xl text-gray-300 mb-4"></i>
            <h4 class="text-lg font-medium text-gray-900 mb-2">
              No Polling Stations
            </h4>
            <p class="text-gray-600 mb-4">
              This CAW doesn't have any polling stations yet.
            </p>
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              @click="navigateToPollingStations"
            >
              <i class="fas fa-plus mr-2"></i>
              Add Polling Station
            </button>
          </div>
          <div v-else>
            <p class="text-gray-600 mb-4">
              This CAW has
              {{ caw._count?.pollingStations || 0 }} polling station(s). Click
              the button below to manage them.
            </p>
            <button
              @click="navigateToPollingStations"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <i class="fas fa-poll mr-2"></i>
              Manage Polling Stations
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-bolt mr-2 text-gray-600"></i>
            Quick Actions
          </h3>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-if="canEditCAW"
            @click="editCAW"
            class="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-edit text-yellow-600"></i>
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Edit CAW</h4>
              <p class="text-sm text-gray-500">Modify CAW details</p>
            </div>
          </button>

          <button
            @click="navigateToPollingStations"
            class="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-poll text-green-600"></i>
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">
                Manage Polling Stations
              </h4>
              <p class="text-sm text-gray-500">
                View and manage polling stations
              </p>
            </div>
          </button>

          <button
            @click="navigateToConstituency"
            class="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-landmark text-blue-600"></i>
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">
                View Constituency
              </h4>
              <p class="text-sm text-gray-500">
                View parent constituency details
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCAWManagementStore } from '@/stores/cawManagement';
import { useAuthStore } from '@/stores/auth';
import type { CAW } from '@/services/cawService';
import MainLayout from '@/components/MainLayout.vue';

const route = useRoute();
const router = useRouter();
const cawManagementStore = useCAWManagementStore();
const authStore = useAuthStore();

// State
const caw = ref<CAW | null>(null);
const pollingStations = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Computed
const canEditCAW = computed(() => {
  return authStore.user?.role === 'SUPER_ADMIN';
});

// Methods
const loadCAW = async () => {
  try {
    loading.value = true;
    error.value = null;

    const cawId = route.params.id as string;
    if (!cawId) {
      error.value = 'CAW ID is required';
      return;
    }

    // Fetch CAW details and stats
    await Promise.all([
      cawManagementStore.fetchCAWById(cawId),
      cawManagementStore.fetchCAWStats(cawId),
      loadPollingStations(cawId),
    ]);

    caw.value = cawManagementStore.currentCAW;

    if (!caw.value) {
      error.value = 'CAW not found';
      return;
    }

    // Debug CAW statistics
    console.log('CAW stats from store:', cawManagementStore.stats);
    console.log('CAW data:', caw.value);
  } catch (err) {
    error.value = 'Failed to load CAW details';
    console.error('Error loading CAW:', err);
  } finally {
    loading.value = false;
  }
};

const loadPollingStations = async (cawId: string) => {
  try {
    // For now, we'll use a mock API call since we don't have a polling stations service yet
    // In a real implementation, you would call a polling stations API endpoint
    const response = await fetch(`/api/pollingstations?cawId=${cawId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      pollingStations.value = data.data?.pollingStations || [];
    } else {
      console.error('Failed to fetch polling stations');
      pollingStations.value = [];
    }
  } catch (err) {
    console.error('Error loading polling stations:', err);
    pollingStations.value = [];
  }
};

const goBack = () => {
  router.push('/caws');
};

const editCAW = () => {
  if (caw.value) {
    router.push(`/caws/${caw.value.id}/edit`);
  }
};

const navigateToPollingStations = () => {
  router.push('/pollingstation');
};

const navigateToConstituency = () => {
  if (caw.value?.constituencyId) {
    router.push(`/constituencies/${caw.value.constituencyId}`);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Lifecycle
onMounted(() => {
  loadCAW();
});
</script>
