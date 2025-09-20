<template>
  <MainLayout
    page-title="Polling Station Management"
    page-subtitle="Manage polling stations and their information"
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
            <i class="fas fa-bolt mr-2"></i>
            Quick Actions
          </h5>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <router-link
              to="/counties"
              class="btn-outline-primary w-full text-center"
            >
              <i class="fas fa-map-marker-alt mr-2"></i>
              Manage Counties
            </router-link>
            <router-link
              to="/constituencies"
              class="btn-outline-success w-full text-center"
            >
              <i class="fas fa-map mr-2"></i>
              Manage Constituencies
            </router-link>
            <a href="#" class="btn-outline-info w-full text-center">
              <i class="fas fa-building mr-2"></i>
              Manage Wards
            </a>
            <a href="#" class="btn-outline-warning w-full text-center">
              <i class="fas fa-poll mr-2"></i>
              Manage Polling Stations
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Counties -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-map-marker-alt mr-2"></i>
            Recent Counties
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
            No counties found
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="county in recentCounties"
              :key="county.id"
              class="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <h6 class="text-sm font-semibold mb-1">{{ county.name }}</h6>
                <small class="text-gray-500">Code: {{ county.code }}</small>
              </div>
              <span
                class="badge bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
              >
                {{ county.constituenciesCount }} constituencies
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-server mr-2"></i>
            System Status
          </h5>
        </div>
        <div class="card-body">
          <div class="space-y-3">
            <div class="status-item">
              <div class="flex items-center">
                <div class="status-indicator status-online"></div>
                <span>Database Connection</span>
              </div>
              <span class="status-value">Online</span>
            </div>
            <div class="status-item">
              <div class="flex items-center">
                <div class="status-indicator status-online"></div>
                <span>API Services</span>
              </div>
              <span class="status-value">Running</span>
            </div>
            <div class="status-item">
              <div class="flex items-center">
                <div class="status-indicator status-warning"></div>
                <span>Data Sync</span>
              </div>
              <span class="status-value">Pending</span>
            </div>
            <div class="status-item">
              <div class="flex items-center">
                <div class="status-indicator status-online"></div>
                <span>Backup System</span>
              </div>
              <span class="status-value">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Management Tools -->
    <div class="mt-6">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-tools mr-2"></i>
            Data Management Tools
          </h5>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button class="btn-primary w-full" @click="openBulkUpload">
              <i class="fas fa-upload mr-2"></i>
              Bulk Upload Data
            </button>
            <button class="btn-success w-full" @click="exportData">
              <i class="fas fa-download mr-2"></i>
              Export All Data
            </button>
            <button class="btn-warning w-full" @click="validateData">
              <i class="fas fa-check-circle mr-2"></i>
              Validate Data
            </button>
            <button class="btn-info w-full" @click="refreshData">
              <i class="fas fa-sync-alt mr-2"></i>
              Refresh Stats
            </button>
          </div>

          <!-- Upload Instructions -->
          <div class="mt-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h6 class="text-blue-800 font-semibold mb-2">
                <i class="fas fa-info-circle mr-2"></i>
                Bulk Upload Instructions
              </h6>
              <p class="text-blue-700 mb-2">
                Use the <strong>Bulk Upload Data</strong> button to upload
                election data from a CSV file. The system supports hierarchical
                uploads that will automatically create:
              </p>
              <ul class="text-blue-700 space-y-1">
                <li><strong>Counties</strong> - Administrative regions</li>
                <li>
                  <strong>Constituencies</strong> - Electoral areas within
                  counties
                </li>
                <li>
                  <strong>Wards (CAWs)</strong> - Smaller administrative units
                </li>
                <li>
                  <strong>Polling Stations</strong> - Individual voting
                  locations
                </li>
              </ul>
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
  // Reset modal state when opening
  if (bulkUploadModalRef.value) {
    bulkUploadModalRef.value.resetModal();
  }
};

const handleUploadSuccess = (result: any) => {
  console.log('Upload successful:', result);
  // Refresh stats after successful upload
  fetchStats();

  // Show success notification
  // You can add a toast notification here
  alert(
    `Upload completed successfully! Created ${result.data.pollingStations.created} polling stations.`
  );
};

const exportData = () => {
  // TODO: Implement data export functionality
  console.log('Export data clicked');
};

const validateData = () => {
  // TODO: Implement data validation functionality
  console.log('Validate data clicked');
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
</style>
