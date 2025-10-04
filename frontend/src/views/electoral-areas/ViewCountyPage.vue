<template>
  <MainLayout
    :page-title="county ? `${county.name} Details` : 'County Details'"
    :page-subtitle="
      county
        ? `Viewing details for ${county.name}`
        : 'Loading county details...'
    "
  >
    <!-- Loading State -->
    <LoadingState v-if="loading" message="Loading county details..." />

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

    <!-- County Details -->
    <div v-else-if="county" class="space-y-6">
      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Counties
          </button>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="canEditCounty"
            @click="editCounty"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <i class="fas fa-edit mr-2"></i>
            Edit County
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <StatisticsGrid :columns="4" :gap="'lg'" :padding="'none'">
        <StatisticsCardCompact
          name="Total Constituencies"
          :value="county._count?.constituencies || 0"
          icon="fas fa-landmark"
          color="blue"
          format="number"
        />
        <StatisticsCardCompact
          name="Total Wards"
          :value="totalWards"
          icon="fas fa-building"
          color="green"
          format="number"
          :loading="statsLoading"
        />
        <StatisticsCardCompact
          name="Polling Stations"
          :value="totalPollingStations"
          icon="fas fa-poll"
          color="purple"
          format="number"
          :loading="statsLoading"
        />
        <StatisticsCardCompact
          name="Registered Voters"
          :value="totalRegisteredVoters"
          icon="fas fa-users"
          color="orange"
          format="number"
          :loading="statsLoading"
        />

        <!-- Debug info -->
        <div
          class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm"
        >
          <h4 class="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
          <p>Stats Loading: {{ statsLoading }}</p>
          <p>Total Wards: {{ totalWards }}</p>
          <p>Total Polling Stations: {{ totalPollingStations }}</p>
          <p>Total Registered Voters: {{ totalRegisteredVoters }}</p>
        </div>
      </StatisticsGrid>

      <!-- County Information Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-map-marker-alt mr-2 text-indigo-600"></i>
            County Information
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Code -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                County Code
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {{ county.code }}
                </span>
              </p>
            </div>

            <!-- Name -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                County Name
              </h6>
              <div v-if="!isEditingName" class="flex items-center space-x-2">
                <p class="text-lg font-semibold text-gray-900">
                  {{ county.name }}
                </p>
                <button
                  v-if="canEditCounty"
                  @click="startEditingName"
                  class="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                  title="Edit county name"
                >
                  <i class="fas fa-edit text-sm"></i>
                </button>
              </div>
              <div v-else class="flex items-center space-x-2">
                <input
                  v-model="editingName"
                  @keyup.enter="saveName"
                  @keyup.escape="cancelEditingName"
                  class="text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  ref="nameInput"
                />
                <button
                  @click="saveName"
                  class="p-1 text-green-600 hover:text-green-700 transition-colors duration-200"
                  title="Save changes"
                >
                  <i class="fas fa-check text-sm"></i>
                </button>
                <button
                  @click="cancelEditingName"
                  class="p-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                  title="Cancel editing"
                >
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Constituencies Count -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Constituencies
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {{ county._count?.constituencies || 0 }}
                </span>
              </p>
            </div>

            <!-- Created Date -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Created Date
              </h6>
              <p class="text-sm text-gray-600">
                {{ formatDate(county.createdAt) }}
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
                {{ formatDate(county.updatedAt) }}
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

      <!-- Constituencies Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-landmark mr-2 text-indigo-600"></i>
              Constituencies
            </h3>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ county._count?.constituencies || 0 }} total
            </span>
          </div>
        </div>
        <div class="p-6">
          <div
            v-if="(county._count?.constituencies || 0) === 0"
            class="text-center py-8"
          >
            <i class="fas fa-landmark text-4xl text-gray-300 mb-4"></i>
            <h4 class="text-lg font-medium text-gray-900 mb-2">
              No Constituencies
            </h4>
            <p class="text-gray-600 mb-4">
              This county doesn't have any constituencies yet.
            </p>
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              @click="navigateToConstituencies"
            >
              <i class="fas fa-plus mr-2"></i>
              Add Constituencies
            </button>
          </div>
          <div v-else>
            <p class="text-gray-600 mb-4">
              This county has
              {{ county._count?.constituencies || 0 }} constituency(ies). Click
              the button below to manage them.
            </p>
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              @click="navigateToConstituencies"
            >
              <i class="fas fa-external-link-alt mr-2"></i>
              View Constituencies
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
            <i class="fas fa-bolt mr-2 text-indigo-600"></i>
            Quick Actions
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-if="canEditCounty"
              @click="editCounty"
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
                <h4 class="text-sm font-medium text-gray-900">Edit County</h4>
                <p class="text-sm text-gray-500">Update county information</p>
              </div>
            </button>

            <button
              @click="navigateToConstituencies"
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
                  Manage Constituencies
                </h4>
                <p class="text-sm text-gray-500">
                  View and manage constituencies
                </p>
              </div>
            </button>

            <button
              @click="deleteCounty"
              :disabled="(county._count?.constituencies ?? 0) > 0"
              class="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-trash text-red-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Delete County</h4>
                <p class="text-sm text-gray-500">
                  {{
                    (county._count?.constituencies ?? 0) > 0
                      ? 'Cannot delete - has constituencies'
                      : 'Remove this county'
                  }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCountyManagementStore } from '@/stores/countyManagement';
import { useAuthStore } from '@/stores/auth';
import type { County } from '@/services/countyService';
import MainLayout from '@/components/MainLayout.vue';
import { LoadingState } from '@/components';
import {
  StatisticsGrid,
  StatisticsCardCompact,
} from '@/components/statistics-card';

const route = useRoute();
const router = useRouter();
const countyManagementStore = useCountyManagementStore();
const authStore = useAuthStore();

// State
const county = ref<County | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isEditingName = ref(false);
const editingName = ref('');
const nameInput = ref<HTMLInputElement | null>(null);

// Statistics data
const totalWards = ref(0);
const totalPollingStations = ref(0);
const totalRegisteredVoters = ref(0);
const statsLoading = ref(false);

// Computed
const canEditCounty = computed(() => {
  return authStore.user?.role === 'SUPER_ADMIN';
});

// Methods
const loadCounty = async () => {
  try {
    loading.value = true;
    error.value = null;

    const countyId = route.params.id as string;
    if (!countyId) {
      error.value = 'County ID is required';
      return;
    }

    // Fetch county details using the individual county API
    const response = await countyManagementStore.fetchCounty(countyId);
    county.value = response;
    console.log('Loaded county data:', county.value);

    // Load statistics after county is loaded
    await loadCountyStatistics(countyId);
  } catch (err) {
    error.value = 'Failed to load county details';
    console.error('Error loading county:', err);
  } finally {
    loading.value = false;
  }
};

const loadCountyStatistics = async (countyId: string) => {
  try {
    statsLoading.value = true;

    console.log('Loading statistics for county:', countyId);
    console.log('Auth token:', authStore.token ? 'exists' : 'null');

    // Fetch county-specific statistics
    const response = await fetch(`/api/counties/${countyId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    console.log('Statistics response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('County statistics data:', data);

      // Test data structure
      console.log('Data structure test:');
      console.log('data.data exists:', !!data.data);
      console.log('data.data.byCAW exists:', !!data.data?.byCAW);
      console.log(
        'data.data.pollingStationStats exists:',
        !!data.data?.pollingStationStats
      );
      console.log('data.data.voterStats exists:', !!data.data?.voterStats);

      // Calculate total wards from byCAW array
      console.log('byCAW array:', data.data?.byCAW);
      const totalWardsCount =
        data.data?.byCAW?.reduce((sum: number, item: any) => {
          console.log('Processing CAW item:', item, 'current sum:', sum);
          return sum + (item._count?.id || 0);
        }, 0) || 0;
      console.log('Calculated total wards:', totalWardsCount);

      // Manual verification
      const manualWardsCount =
        6 + 5 + 4 + 5 + 6 + 5 + 5 + 5 + 5 + 5 + 5 + 4 + 5 + 5 + 4 + 5 + 5;
      console.log('Manual calculation of wards:', manualWardsCount);
      console.log('Expected polling stations: 3015');
      console.log('Expected registered voters: 2005165');

      totalWards.value = totalWardsCount;

      // Get polling stations count
      console.log('pollingStationStats:', data.data?.pollingStationStats);
      const pollingStationsCount =
        data.data?.pollingStationStats?._count?.id || 0;
      console.log('Polling stations count:', pollingStationsCount);
      totalPollingStations.value = pollingStationsCount;

      // Get registered voters count
      console.log('voterStats:', data.data?.voterStats);
      const registeredVotersCount =
        data.data?.voterStats?._sum?.registeredVoters || 0;
      console.log('Registered voters count:', registeredVotersCount);
      totalRegisteredVoters.value = registeredVotersCount;

      console.log('Parsed statistics:', {
        totalWards: totalWards.value,
        totalPollingStations: totalPollingStations.value,
        totalRegisteredVoters: totalRegisteredVoters.value,
      });

      console.log('Stats loading state:', statsLoading.value);

      // Force reactivity update
      totalWards.value = totalWards.value;
      totalPollingStations.value = totalPollingStations.value;
      totalRegisteredVoters.value = totalRegisteredVoters.value;

      // Force DOM update
      await nextTick();
      console.log('After nextTick - Stats values:', {
        totalWards: totalWards.value,
        totalPollingStations: totalPollingStations.value,
        totalRegisteredVoters: totalRegisteredVoters.value,
      });

      // Additional debugging
      console.log('Reactive variables after assignment:');
      console.log(
        'totalWards.value:',
        totalWards.value,
        'type:',
        typeof totalWards.value
      );
      console.log(
        'totalPollingStations.value:',
        totalPollingStations.value,
        'type:',
        typeof totalPollingStations.value
      );
      console.log(
        'totalRegisteredVoters.value:',
        totalRegisteredVoters.value,
        'type:',
        typeof totalRegisteredVoters.value
      );
    } else {
      console.warn('Failed to load county statistics, using default values');
      // Set default values if stats endpoint doesn't exist yet
      totalWards.value = 0;
      totalPollingStations.value = 0;
      totalRegisteredVoters.value = 0;
    }
  } catch (err) {
    console.warn('Error loading county statistics:', err);
    // Set default values on error
    totalWards.value = 0;
    totalPollingStations.value = 0;
    totalRegisteredVoters.value = 0;
  } finally {
    statsLoading.value = false;
  }
};

const goBack = () => {
  router.push('/counties');
};

const editCounty = () => {
  if (county.value) {
    router.push(`/counties/${county.value.id}/edit`);
  }
};

const startEditingName = async () => {
  if (!county.value) return;

  isEditingName.value = true;
  editingName.value = county.value.name;

  await nextTick();
  if (nameInput.value) {
    nameInput.value.focus();
    nameInput.value.select();
  }
};

const saveName = async () => {
  if (!county.value || !editingName.value.trim()) {
    cancelEditingName();
    return;
  }

  if (editingName.value.trim() === county.value.name) {
    cancelEditingName();
    return;
  }

  try {
    await countyManagementStore.updateCounty(county.value.id, {
      code: county.value.code,
      name: editingName.value.trim(),
    });

    // Update local county data
    county.value.name = editingName.value.trim();
    county.value.updatedAt = new Date().toISOString();

    isEditingName.value = false;
    editingName.value = '';
  } catch (err) {
    console.error('Error updating county name:', err);
    // Error is handled by the store
  }
};

const cancelEditingName = () => {
  isEditingName.value = false;
  editingName.value = '';
};

const navigateToConstituencies = () => {
  router.push('/constituencies');
};

const deleteCounty = async () => {
  if (!county.value) return;

  const constituencyCount = county.value._count?.constituencies ?? 0;
  let confirmMessage = `Are you sure you want to delete ${county.value.name}?`;

  if (constituencyCount > 0) {
    confirmMessage += `\n\n⚠️ This county has ${constituencyCount} constituency(ies) associated with it. Deleting this county will not be possible until all constituencies are removed first.`;
  }

  if (confirm(confirmMessage)) {
    try {
      await countyManagementStore.deleteCounty(county.value.id);
      router.push('/counties');
    } catch (err) {
      // Error is handled by the store
    }
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
  loadCounty();
});
</script>
