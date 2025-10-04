<template>
  <MainLayout
    page-title="Electoral Areas Overview"
    page-subtitle="Comprehensive view of the entire electoral structure and data"
  >
    <!-- Error Alert -->
    <ErrorAlert
      :show="!!statsStore.error"
      :message="statsStore.error || ''"
      @dismiss="statsStore.clearError()"
    />

    <!-- Quick Actions -->
    <div class="mb-6">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-sitemap mr-2"></i>
            Electoral Areas Management
          </h5>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              to="/counties"
              text="Counties"
              icon="fa-map-marker-alt"
              variant="primary"
            />
            <QuickActionButton
              to="/constituencies"
              text="Constituencies"
              icon="fa-landmark"
              variant="success"
            />
            <QuickActionButton
              to="/caws"
              text="Wards"
              icon="fa-building"
              variant="secondary"
            />
            <QuickActionButton
              to="/pollingstation"
              text="Polling Stations"
              icon="fa-poll"
              variant="warning"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Data Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Hierarchy Structure -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-sitemap mr-2"></i>
            Hierarchy Structure
          </h5>
        </div>
        <div class="card-body">
          <div v-if="statsStore.loading" class="text-center py-3">
            <div class="spinner" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <div
            v-else-if="!statsStore.hierarchyStats"
            class="text-center py-3 text-gray-500"
          >
            No data available
          </div>
          <div v-else class="space-y-4">
            <div class="hierarchy-level">
              <div class="flex items-center mb-2">
                <i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                <span class="font-semibold text-gray-700">Counties</span>
                <span
                  class="ml-auto badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {{ stats.counties }}
                </span>
              </div>
              <div class="ml-6 space-y-2">
                <div class="hierarchy-item">
                  <i class="fas fa-landmark text-green-500 mr-2"></i>
                  <span class="text-sm text-gray-600">Constituencies</span>
                  <span class="ml-auto text-xs text-gray-500">{{
                    stats.constituencies
                  }}</span>
                </div>
                <div class="hierarchy-item">
                  <i class="fas fa-building text-purple-500 mr-2"></i>
                  <span class="text-sm text-gray-600">Wards (CAW)</span>
                  <span class="ml-auto text-xs text-gray-500">{{
                    stats.wards
                  }}</span>
                </div>
                <div class="hierarchy-item">
                  <i class="fas fa-poll text-orange-500 mr-2"></i>
                  <span class="text-sm text-gray-600">Polling Stations</span>
                  <span class="ml-auto text-xs text-gray-500">{{
                    stats.pollingStations
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Completeness -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-chart-pie mr-2"></i>
            Data Completeness
          </h5>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div class="completeness-item">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Counties</span>
                <span class="text-sm text-gray-500"
                  >{{ stats.countiesWithData }}/{{ stats.counties }}</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full"
                  :style="{
                    width: `${
                      (stats.countiesWithData / stats.counties) * 100
                    }%`,
                  }"
                ></div>
              </div>
            </div>
            <div class="completeness-item">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700"
                  >Constituencies</span
                >
                <span class="text-sm text-gray-500"
                  >{{ stats.constituenciesWithData }}/{{
                    stats.constituencies
                  }}</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  :style="{
                    width: `${
                      (stats.constituenciesWithData / stats.constituencies) *
                      100
                    }%`,
                  }"
                ></div>
              </div>
            </div>
            <div class="completeness-item">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700"
                  >Wards (CAW)</span
                >
                <span class="text-sm text-gray-500"
                  >{{ stats.wardsWithData }}/{{ stats.wards }}</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-purple-500 h-2 rounded-full"
                  :style="{
                    width: `${(stats.wardsWithData / stats.wards) * 100}%`,
                  }"
                ></div>
              </div>
            </div>
            <div class="completeness-item">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700"
                  >Polling Stations</span
                >
                <span class="text-sm text-gray-500"
                  >{{ stats.pollingStationsWithData }}/{{
                    stats.pollingStations
                  }}</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-orange-500 h-2 rounded-full"
                  :style="{
                    width: `${
                      (stats.pollingStationsWithData / stats.pollingStations) *
                      100
                    }%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Upload Modal -->
    <BulkUploadModal
      ref="bulkUploadModalRef"
      @upload-success="handleUploadSuccess"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useStatsStore } from '@/stores/stats';
import BulkUploadModal from '@/components/pages/election-hirarchy/BulkUploadModal.vue';
import MainLayout from '@/components/MainLayout.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import QuickActionButton from '@/components/QuickActionButton.vue';

const authStore = useAuthStore();
const statsStore = useStatsStore();

// Reactive data
const stats = ref({
  counties: 0,
  countiesWithData: 0,
  constituencies: 0,
  constituenciesWithData: 0,
  wards: 0,
  wardsWithData: 0,
  pollingStations: 0,
  pollingStationsWithData: 0,
  totalRegisteredVoters: 0,
});
const bulkUploadModalRef = ref<InstanceType<typeof BulkUploadModal> | null>(
  null
);

// Computed properties
const user = computed(() => authStore.user);

// Methods
const refreshData = async () => {
  await fetchStats();
};

const fetchStats = async () => {
  try {
    // Fetch hierarchy statistics from the new endpoint
    const hierarchyStats = await statsStore.fetchHierarchyStats();

    // Update stats with real data from the API
    stats.value.counties = hierarchyStats.totalCounties;
    stats.value.countiesWithData = hierarchyStats.totalCounties; // Assuming all counties have data
    stats.value.constituencies = hierarchyStats.totalConstituencies;
    stats.value.constituenciesWithData = hierarchyStats.totalConstituencies; // Assuming all constituencies have data
    stats.value.wards = hierarchyStats.totalWards;
    stats.value.wardsWithData = hierarchyStats.totalWards; // Assuming all wards have data
    stats.value.pollingStations = hierarchyStats.totalPollingStations;
    stats.value.pollingStationsWithData = hierarchyStats.totalPollingStations; // Assuming all polling stations have data
    stats.value.totalRegisteredVoters = hierarchyStats.totalRegisteredVoters;
  } catch (error) {
    console.error('Error fetching hierarchy statistics:', error);
  }
};

const openBulkUpload = () => {
  // Open the bulk upload modal
  if (bulkUploadModalRef.value) {
    bulkUploadModalRef.value.openModal();
  }
};

const handleUploadSuccess = (result: any) => {
  console.log('Upload successful:', result);
  // Refresh stats after successful upload
  fetchStats();

  // Show success notification
  // You can add a toast notification here
  const message = result.data
    ? `Upload completed successfully! Created ${
        result.data.pollingStations?.created || 0
      } polling stations, ${result.data.wards?.created || 0} wards, ${
        result.data.constituencies?.created || 0
      } constituencies, and ${result.data.counties?.created || 0} counties.`
    : 'Upload completed successfully!';

  alert(message);
};

const exportData = () => {
  // TODO: Implement electoral areas data export functionality
  console.log('Export electoral areas data clicked');
  // This could export the entire electoral structure as CSV/Excel
  alert(
    'Export functionality will be implemented to download the complete electoral areas data.'
  );
};

const validateData = () => {
  // TODO: Implement electoral areas data validation functionality
  console.log('Validate electoral areas data clicked');
  // This could validate the integrity of the electoral structure
  alert(
    'Validation functionality will be implemented to check the electoral areas data integrity.'
  );
};

// Lifecycle
onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0.75rem 0.75rem 0 0 !important;
  padding: 1rem 1.5rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.status-item:last-child {
  border-bottom: none;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.status-online {
  background-color: #10b981;
}

.status-warning {
  background-color: #f59e0b;
}

.status-offline {
  background-color: #ef4444;
}

.status-value {
  font-weight: 600;
  color: #2c3e50;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hierarchy-level {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
}

.hierarchy-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.hierarchy-item:last-child {
  border-bottom: none;
}

.completeness-item {
  margin-bottom: 1rem;
}

.completeness-item:last-child {
  margin-bottom: 0;
}
</style>
