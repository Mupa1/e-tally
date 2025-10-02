<template>
  <MainLayout
    :page-title="
      constituency ? `${constituency.name} Details` : 'Constituency Details'
    "
    :page-subtitle="
      constituency
        ? `Viewing details for ${constituency.name}`
        : 'Loading constituency details...'
    "
  >
    <!-- Loading State -->
    <div v-if="loading" class="text-center p-8">
      <div
        class="inline-flex items-center justify-center w-8 h-8 text-indigo-600"
      >
        <i class="fas fa-spinner fa-spin text-2xl"></i>
      </div>
      <p class="mt-2 text-gray-600">Loading constituency details...</p>
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

    <!-- Constituency Details -->
    <div v-else-if="constituency" class="space-y-6">
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
                  constituencyManagementStore.stats?.voterStats?._sum
                    ?.registeredVoters || 0
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
                <i class="fas fa-building text-green-600 text-xl"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Wards</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ constituency._count?.caws || 0 }}
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
                <i class="fas fa-poll text-purple-600 text-xl"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Polling Stations</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ constituency._count?.pollingStations || 0 }}
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
                <i class="fas fa-users text-orange-600 text-xl"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avg Voters</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{
                  Math.round(
                    constituencyManagementStore.stats?.voterStats?._avg
                      ?.registeredVoters || 0
                  )
                }}
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
            Back to Constituencies
          </button>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="canEditConstituency"
            @click="editConstituency"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <i class="fas fa-edit mr-2"></i>
            Edit Constituency
          </button>
        </div>
      </div>

      <!-- Constituency Information Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-landmark mr-2 text-indigo-600"></i>
            Constituency Information
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Code -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Constituency Code
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {{ constituency.code }}
                </span>
              </p>
            </div>

            <!-- Name -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Constituency Name
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                {{ constituency.name }}
              </p>
            </div>

            <!-- County -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                County
              </h6>
              <div class="text-sm text-gray-900">
                <div class="font-medium">{{ constituency.county.code }}</div>
                <div class="text-gray-500">{{ constituency.county.name }}</div>
              </div>
            </div>

            <!-- Wards Count -->
            <div>
              <h6
                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2"
              >
                Wards
              </h6>
              <p class="text-lg font-semibold text-gray-900">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {{ constituency._count?.caws || 0 }}
                </span>
              </p>
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
                  {{ constituency._count?.pollingStations || 0 }}
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
                {{ formatDate(constituency.createdAt) }}
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
                {{ formatDate(constituency.updatedAt) }}
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

      <!-- Wards Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-building mr-2 text-blue-600"></i>
              Wards
            </h3>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ constituency._count?.caws || 0 }} total
            </span>
          </div>
        </div>
        <div class="p-6">
          <div v-if="wards.length === 0" class="text-center py-8">
            <i class="fas fa-building text-4xl text-gray-300 mb-4"></i>
            <h4 class="text-lg font-medium text-gray-900 mb-2">No Wards</h4>
            <p class="text-gray-600 mb-4">
              This constituency doesn't have any wards yet.
            </p>
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              @click="navigateToWards"
            >
              <i class="fas fa-plus mr-2"></i>
              Add Ward
            </button>
          </div>
          <div v-else>
            <!-- Wards List -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <div
                v-for="ward in wards"
                :key="ward.id"
                class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <div class="flex flex-col items-center text-center space-y-3">
                  <div
                    class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-building text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-1">
                      {{ ward.name }}
                    </h4>
                    <p class="text-xs text-gray-500 mb-2">
                      Code: {{ ward.code }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ ward._count?.pollingStations || 0 }} Polling Stations
                    </p>
                  </div>
                  <div class="flex items-center space-x-2 pt-2">
                    <button
                      @click="viewWard(ward)"
                      class="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                      title="View Ward Details"
                    >
                      <i class="fas fa-eye text-sm"></i>
                    </button>
                    <button
                      @click="editWard(ward)"
                      class="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                      title="Edit Ward"
                    >
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              class="flex justify-between items-center pt-4 border-t border-gray-200"
            >
              <p class="text-sm text-gray-600">
                Showing {{ wards.length }} of
                {{ constituency._count?.caws || 0 }} wards
              </p>
              <button
                @click="navigateToWards"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <i class="fas fa-building mr-2"></i>
                Manage All Wards
              </button>
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
              {{ constituency._count?.pollingStations || 0 }} total
            </span>
          </div>
        </div>
        <div class="p-6">
          <div
            v-if="(constituency._count?.pollingStations || 0) === 0"
            class="text-center py-8"
          >
            <i class="fas fa-poll text-4xl text-gray-300 mb-4"></i>
            <h4 class="text-lg font-medium text-gray-900 mb-2">
              No Polling Stations
            </h4>
            <p class="text-gray-600 mb-4">
              This constituency doesn't have any polling stations yet.
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
              This constituency has
              {{ constituency._count?.pollingStations || 0 }} polling
              station(s). Click the button below to manage them.
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
            v-if="canEditConstituency"
            @click="editConstituency"
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
              <h4 class="text-sm font-medium text-gray-900">
                Edit Constituency
              </h4>
              <p class="text-sm text-gray-500">Modify constituency details</p>
            </div>
          </button>

          <button
            @click="navigateToWards"
            class="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-building text-blue-600"></i>
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Manage Wards</h4>
              <p class="text-sm text-gray-500">View and manage wards</p>
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
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConstituencyManagementStore } from '@/stores/constituencyManagement';
import { useAuthStore } from '@/stores/auth';
import type { Constituency } from '@/services/constituencyService';
import MainLayout from '@/components/MainLayout.vue';

const route = useRoute();
const router = useRouter();
const constituencyManagementStore = useConstituencyManagementStore();
const authStore = useAuthStore();

// State
const constituency = ref<Constituency | null>(null);
const wards = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Computed
const canEditConstituency = computed(() => {
  return authStore.user?.role === 'SUPER_ADMIN';
});

// Methods
const loadConstituency = async () => {
  try {
    loading.value = true;
    error.value = null;

    const constituencyId = route.params.id as string;
    if (!constituencyId) {
      error.value = 'Constituency ID is required';
      return;
    }

    // Fetch constituency details, stats, and wards
    await Promise.all([
      constituencyManagementStore.fetchConstituencies(),
      constituencyManagementStore.fetchConstituencyStats(
        undefined,
        constituencyId
      ),
      loadWards(constituencyId),
    ]);

    const foundConstituency = constituencyManagementStore.constituencies.find(
      (c) => c.id === constituencyId
    );

    if (!foundConstituency) {
      error.value = 'Constituency not found';
      return;
    }

    constituency.value = foundConstituency;
  } catch (err) {
    error.value = 'Failed to load constituency details';
    console.error('Error loading constituency:', err);
  } finally {
    loading.value = false;
  }
};

const loadWards = async (constituencyId: string) => {
  try {
    // For now, we'll use a mock API call since we don't have a wards service yet
    // In a real implementation, you would call a wards API endpoint
    const response = await fetch(`/api/caws?constituencyId=${constituencyId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      wards.value = data.data?.caws || [];
    } else {
      console.error('Failed to fetch wards');
      wards.value = [];
    }
  } catch (err) {
    console.error('Error loading wards:', err);
    wards.value = [];
  }
};

const goBack = () => {
  router.push('/constituencies');
};

const editConstituency = () => {
  if (constituency.value) {
    router.push(`/constituencies/${constituency.value.id}/edit`);
  }
};

const navigateToWards = () => {
  router.push('/wards');
};

const navigateToPollingStations = () => {
  router.push('/pollingstation');
};

const viewWard = (ward: any) => {
  // TODO: Navigate to ward details page when implemented
  console.log('View ward:', ward);
  // router.push(`/wards/${ward.id}`);
};

const editWard = (ward: any) => {
  // TODO: Navigate to ward edit page when implemented
  console.log('Edit ward:', ward);
  // router.push(`/wards/${ward.id}/edit`);
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
  loadConstituency();
});
</script>
