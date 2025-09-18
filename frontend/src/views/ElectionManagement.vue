<template>
  <div class="polling-station-management-page">
    <!-- Top Navigation Bar -->
    <TopBar />

    <!-- Main Content -->
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <AppSidebar />

        <!-- Main Content Area -->
        <div class="col-md-9 col-lg-10 main-content">
          <div class="content-wrapper">
            <!-- Page Header -->
            <div class="page-header">
              <h1 class="page-title">Election Management</h1>
              <p class="page-subtitle">
                Manage elections and their information
              </p>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
              <div class="col-xl-3 col-md-6 mb-4">
                <div class="stat-card">
                  <div class="stat-icon counties">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.counties }}</h3>
                    <p>Counties</p>
                    <small class="text-muted"
                      >{{ stats.countiesWithData }} with data</small
                    >
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="stat-card">
                  <div class="stat-icon constituencies">
                    <i class="fas fa-map"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.constituencies }}</h3>
                    <p>Constituencies</p>
                    <small class="text-muted"
                      >{{ stats.constituenciesWithData }} with data</small
                    >
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="stat-card">
                  <div class="stat-icon wards">
                    <i class="fas fa-building"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.wards }}</h3>
                    <p>Wards (CAWs)</p>
                    <small class="text-muted"
                      >{{ stats.wardsWithData }} with data</small
                    >
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="stat-card">
                  <div class="stat-icon polling-stations">
                    <i class="fas fa-poll"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.pollingStations }}</h3>
                    <p>Polling Stations</p>
                    <small class="text-muted"
                      >{{ stats.pollingStationsWithData }} with data</small
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="fas fa-bolt me-2"></i>
                      Quick Actions
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3 mb-3">
                        <router-link
                          to="/counties"
                          class="btn btn-outline-primary w-100"
                        >
                          <i class="fas fa-map-marker-alt me-2"></i>
                          Manage Counties
                        </router-link>
                      </div>
                      <div class="col-md-3 mb-3">
                        <a href="#" class="btn btn-outline-success w-100">
                          <i class="fas fa-map me-2"></i>
                          Manage Constituencies
                        </a>
                      </div>
                      <div class="col-md-3 mb-3">
                        <a href="#" class="btn btn-outline-info w-100">
                          <i class="fas fa-building me-2"></i>
                          Manage Wards
                        </a>
                      </div>
                      <div class="col-md-3 mb-3">
                        <a href="#" class="btn btn-outline-warning w-100">
                          <i class="fas fa-poll me-2"></i>
                          Manage Polling Stations
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Overview -->
            <div class="row">
              <!-- Recent Counties -->
              <div class="col-lg-6 mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="fas fa-map-marker-alt me-2"></i>
                      Recent Counties
                    </h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading.counties" class="text-center py-3">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div
                      v-else-if="recentCounties.length === 0"
                      class="text-center py-3 text-muted"
                    >
                      No counties found
                    </div>
                    <div v-else class="list-group list-group-flush">
                      <div
                        v-for="county in recentCounties"
                        :key="county.id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6 class="mb-1">{{ county.name }}</h6>
                          <small class="text-muted"
                            >Code: {{ county.code }}</small
                          >
                        </div>
                        <span class="badge bg-primary rounded-pill">
                          {{ county.constituenciesCount }} constituencies
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- System Status -->
              <div class="col-lg-6 mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="fas fa-server me-2"></i>
                      System Status
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="status-list">
                      <div class="status-item">
                        <div class="d-flex align-items-center">
                          <div class="status-indicator status-online"></div>
                          <span>Database Connection</span>
                        </div>
                        <span class="status-value">Online</span>
                      </div>
                      <div class="status-item">
                        <div class="d-flex align-items-center">
                          <div class="status-indicator status-online"></div>
                          <span>API Services</span>
                        </div>
                        <span class="status-value">Running</span>
                      </div>
                      <div class="status-item">
                        <div class="d-flex align-items-center">
                          <div class="status-indicator status-warning"></div>
                          <span>Data Sync</span>
                        </div>
                        <span class="status-value">Pending</span>
                      </div>
                      <div class="status-item">
                        <div class="d-flex align-items-center">
                          <div class="status-indicator status-online"></div>
                          <span>Backup System</span>
                        </div>
                        <span class="status-value">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Management Tools -->
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="fas fa-tools me-2"></i>
                      Data Management Tools
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3 mb-3">
                        <div class="d-grid">
                          <button
                            class="btn btn-primary"
                            @click="openBulkUpload"
                            data-bs-toggle="modal"
                            data-bs-target="#bulkUploadModal"
                          >
                            <i class="fas fa-upload me-2"></i>
                            Bulk Upload Data
                          </button>
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="d-grid">
                          <button class="btn btn-success" @click="exportData">
                            <i class="fas fa-download me-2"></i>
                            Export All Data
                          </button>
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="d-grid">
                          <button class="btn btn-warning" @click="validateData">
                            <i class="fas fa-check-circle me-2"></i>
                            Validate Data
                          </button>
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="d-grid">
                          <button class="btn btn-info" @click="refreshData">
                            <i class="fas fa-sync-alt me-2"></i>
                            Refresh Stats
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Upload Instructions -->
                    <div class="mt-4">
                      <div class="alert alert-info">
                        <h6 class="alert-heading">
                          <i class="fas fa-info-circle me-2"></i>
                          Bulk Upload Instructions
                        </h6>
                        <p class="mb-2">
                          Use the <strong>Bulk Upload Data</strong> button to
                          upload election data from a CSV file. The system
                          supports hierarchical uploads that will automatically
                          create:
                        </p>
                        <ul class="mb-0">
                          <li>
                            <strong>Counties</strong> - Administrative regions
                          </li>
                          <li>
                            <strong>Constituencies</strong> - Electoral areas
                            within counties
                          </li>
                          <li>
                            <strong>Wards (CAWs)</strong> - Smaller
                            administrative units
                          </li>
                          <li>
                            <strong>Polling Stations</strong> - Individual
                            voting locations
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCountyManagementStore } from '@/stores/countyManagement';
import BulkUploadModal from '@/components/BulkUploadModal.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import TopBar from '@/components/TopBar.vue';

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
.polling-station-management-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content-wrapper {
  padding: 2rem;
}

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
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: #6c757d;
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
  border-bottom: 1px solid #e9ecef;
  border-radius: 0.75rem 0.75rem 0 0 !important;
  padding: 1rem 1.5rem;
}

.card-title {
  color: var(--primary-color);
  font-weight: 600;
  margin: 0;
}

.list-group-item {
  border: none;
  padding: 1rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.list-group-item:last-child {
  border-bottom: none;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
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
  background-color: #28a745;
}

.status-warning {
  background-color: #ffc107;
}

.status-offline {
  background-color: #dc3545;
}

.status-value {
  font-weight: 600;
  color: var(--primary-color);
}

.btn {
  border-radius: 0.5rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .stat-card {
    margin-bottom: 1rem;
  }
}
</style>
