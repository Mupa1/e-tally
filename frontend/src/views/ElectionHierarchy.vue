<template>
  <MainLayout
    page-title="Election Hierarchy Overview"
    page-subtitle="Comprehensive view of the entire election structure and data"
  >
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div class="stat-card">
        <div class="stat-icon counties">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.counties }}</h3>
          <p>Counties</p>
          <small class="text-gray-500"
            >{{ stats.countiesWithData }} with data</small
          >
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon constituencies">
          <i class="fas fa-map"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.constituencies }}</h3>
          <p>Constituencies</p>
          <small class="text-gray-500"
            >{{ stats.constituenciesWithData }} with data</small
          >
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon wards">
          <i class="fas fa-building"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.wards }}</h3>
          <p>Wards (CAWs)</p>
          <small class="text-gray-500"
            >{{ stats.wardsWithData }} with data</small
          >
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon polling-stations">
          <i class="fas fa-poll"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.pollingStations }}</h3>
          <p>Polling Stations</p>
          <small class="text-gray-500"
            >{{ stats.pollingStationsWithData }} with data</small
          >
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-sitemap mr-2"></i>
            Election Hierarchy Management
          </h5>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              to="/counties"
              class="btn-outline-primary w-full text-center"
            >
              <i class="fas fa-map-marker-alt mr-2"></i>
              Counties
            </router-link>
            <router-link
              to="/constituencies"
              class="btn-outline-success w-full text-center"
            >
              <i class="fas fa-landmark mr-2"></i>
              Constituencies
            </router-link>
            <a href="#" class="btn-outline-info w-full text-center">
              <i class="fas fa-building mr-2"></i>
              Wards (CAW)
            </a>
            <a href="#" class="btn-outline-warning w-full text-center">
              <i class="fas fa-poll mr-2"></i>
              Polling Stations
            </a>
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
          <div v-if="loading.counties" class="text-center py-3">
            <div class="spinner" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <div
            v-else-if="recentCounties.length === 0"
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

    <!-- Election Hierarchy Tools -->
    <div class="mt-6">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-cogs mr-2"></i>
            Election Hierarchy Tools
          </h5>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button class="btn-primary w-full" @click="openBulkUpload">
              <i class="fas fa-upload mr-2"></i>
              Bulk Upload Data
            </button>
            <button class="btn-success w-full" @click="exportData">
              <i class="fas fa-download mr-2"></i>
              Export Hierarchy
            </button>
            <button class="btn-warning w-full" @click="validateData">
              <i class="fas fa-check-circle mr-2"></i>
              Validate Structure
            </button>
            <button class="btn-info w-full" @click="refreshData">
              <i class="fas fa-sync-alt mr-2"></i>
              Refresh Overview
            </button>
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
import { useCountyManagementStore } from '@/stores/countyManagement';
import BulkUploadModal from '@/components/pages/users/BulkUploadModal.vue';
import MainLayout from '@/components/MainLayout.vue';

const authStore = useAuthStore();
const countyManagementStore = useCountyManagementStore();

// Reactive data
const loading = ref({
  counties: false,
  constituencies: false,
  wards: false,
  pollingStations: false,
});

const stats = ref({
  counties: 0,
  countiesWithData: 0,
  constituencies: 0,
  constituenciesWithData: 0,
  wards: 0,
  wardsWithData: 0,
  pollingStations: 0,
  pollingStationsWithData: 0,
});

const recentCounties = ref<any[]>([]);
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
    loading.value.counties = true;

    // Fetch counties data
    await countyManagementStore.fetchCounties({ page: 1, limit: 1 });
    stats.value.counties = countyManagementStore.pagination.total;
    stats.value.countiesWithData = countyManagementStore.pagination.total;

    // Fetch recent counties
    await countyManagementStore.fetchCounties({ page: 1, limit: 5 });
    recentCounties.value = countyManagementStore.counties;

    // Mock data for other components (replace with actual API calls)
    stats.value.constituencies = 290;
    stats.value.constituenciesWithData = 290;
    stats.value.wards = 1450;
    stats.value.wardsWithData = 1450;
    stats.value.pollingStations = 40883;
    stats.value.pollingStationsWithData = 40883;
  } catch (error) {
    console.error('Error fetching polling station stats:', error);
  } finally {
    loading.value.counties = false;
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
  // TODO: Implement election hierarchy data export functionality
  console.log('Export election hierarchy data clicked');
  // This could export the entire election structure as CSV/Excel
  alert(
    'Export functionality will be implemented to download the complete election hierarchy data.'
  );
};

const validateData = () => {
  // TODO: Implement election hierarchy data validation functionality
  console.log('Validate election hierarchy data clicked');
  // This could validate the integrity of the election structure
  alert(
    'Validation functionality will be implemented to check the election hierarchy data integrity.'
  );
};

// Lifecycle
onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.counties {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.constituencies {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.wards {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.polling-stations {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

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
