<template>
  <div class="election-management-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link to="/dashboard" class="navbar-brand">
          <i class="fas fa-vote-yea me-2"></i>
          e-Tally Dashboard
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link">
                <i class="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link">
                <i class="fas fa-users me-1"></i>
                Users
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle active"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fas fa-vote-yea me-1"></i>
                Election Management
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/election-management" class="dropdown-item">
                    <i class="fas fa-home me-2"></i>
                    Overview
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <router-link to="/counties" class="dropdown-item">
                    <i class="fas fa-map-marker-alt me-2"></i>
                    Counties
                  </router-link>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-map me-2"></i>
                    Constituencies
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-building me-2"></i>
                    Wards
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-poll me-2"></i>
                    Polling Stations
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="fas fa-chart-bar me-1"></i>
                Results
              </a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-user-circle me-1"></i>
                {{ user?.firstName }} {{ user?.lastName }}
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-user me-2"></i>
                    Profile
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-cog me-2"></i>
                    Settings
                  </a>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click="handleLogout">
                    <i class="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 sidebar">
          <div class="sidebar-content">
            <h6 class="sidebar-title">Election Management</h6>
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link to="/election-management" class="nav-link active">
                  <i class="fas fa-home me-2"></i>
                  Overview
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/counties" class="nav-link">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  Counties
                </router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <i class="fas fa-map me-2"></i>
                  Constituencies
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <i class="fas fa-building me-2"></i>
                  Wards
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <i class="fas fa-poll me-2"></i>
                  Polling Stations
                </a>
              </li>
            </ul>

            <h6 class="sidebar-title mt-4">Quick Actions</h6>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link" href="#" @click="refreshData">
                  <i class="fas fa-sync-alt me-2"></i>
                  Refresh Data
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" @click="exportData">
                  <i class="fas fa-download me-2"></i>
                  Export Data
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-md-9 col-lg-10 content-wrapper">
          <!-- Page Header -->
          <div class="page-header">
            <h1 class="page-title">
              <i class="fas fa-vote-yea me-2"></i>
              Election Management
            </h1>
            <p class="page-subtitle">
              Manage counties, constituencies, wards, and polling stations
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
                    <div class="col-md-4 mb-3">
                      <div class="d-grid">
                        <button class="btn btn-primary" @click="importData">
                          <i class="fas fa-upload me-2"></i>
                          Import Election Data
                        </button>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="d-grid">
                        <button class="btn btn-success" @click="exportData">
                          <i class="fas fa-download me-2"></i>
                          Export All Data
                        </button>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="d-grid">
                        <button class="btn btn-warning" @click="validateData">
                          <i class="fas fa-check-circle me-2"></i>
                          Validate Data Integrity
                        </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCountyManagementStore } from '@/stores/countyManagement';

const router = useRouter();
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

// Computed properties
const user = computed(() => authStore.user);

// Methods
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

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
    console.error('Error fetching election stats:', error);
  } finally {
    loading.value.counties = false;
  }
};

const importData = () => {
  // TODO: Implement data import functionality
  console.log('Import data clicked');
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
.election-management-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar {
  background-color: #fff;
  min-height: calc(100vh - 56px);
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.sidebar-content {
  padding: 1.5rem 1rem;
}

.sidebar-title {
  color: #6c757d;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.sidebar .nav-link {
  color: #6c757d;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar .nav-link:hover {
  background-color: #f8f9fa;
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.sidebar .nav-link.active {
  background-color: var(--primary-color);
  color: white;
  border-left-color: var(--primary-color);
}

.content-wrapper {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 0;
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

.status-list {
  space-y: 1rem;
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
  .sidebar {
    min-height: auto;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .stat-card {
    margin-bottom: 1rem;
  }
}
</style>
