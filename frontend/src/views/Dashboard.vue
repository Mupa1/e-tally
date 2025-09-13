<template>
  <div class="dashboard-page">
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
              <a class="nav-link active" href="#">
                <i class="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link">
                <i class="fas fa-users me-1"></i>
                Users
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
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
            <h6 class="sidebar-title">Navigation</h6>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  <i class="fas fa-tachometer-alt me-2"></i>
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <router-link to="/users" class="nav-link">
                  <i class="fas fa-users me-2"></i>
                  User Management
                </router-link>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fas fa-vote-yea me-2"></i>
                  Election Management
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <router-link
                      to="/election-management"
                      class="dropdown-item"
                    >
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
                  <i class="fas fa-user-tie me-2"></i>
                  Candidates
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <i class="fas fa-chart-line me-2"></i>
                  Election Results
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Incidents
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <i class="fas fa-clipboard-list me-2"></i>
                  Audit Logs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-md-9 col-lg-10 main-content">
          <div class="content-wrapper">
            <!-- Page Header -->
            <div class="page-header">
              <h1 class="page-title">Dashboard</h1>
              <p class="page-subtitle">Welcome back, {{ user?.firstName }}!</p>
            </div>

            <!-- Stats Cards -->
            <div class="row mb-4">
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.users }}</h3>
                    <p>Active Users</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.counties }}</h3>
                    <p>Counties</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-poll"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.pollingStations }}</h3>
                    <p>Polling Stations</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.uptime }}%</h3>
                    <p>System Uptime</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="row">
              <div class="col-lg-8">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="fas fa-clock me-2"></i>
                      Recent Activity
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="activity-list">
                      <div class="activity-item">
                        <div class="activity-icon">
                          <i class="fas fa-map-marker-alt text-primary"></i>
                        </div>
                        <div class="activity-content">
                          <p class="mb-1">County management system activated</p>
                          <small class="text-muted">Just now</small>
                        </div>
                      </div>
                      <div class="activity-item">
                        <div class="activity-icon">
                          <i class="fas fa-user-plus text-success"></i>
                        </div>
                        <div class="activity-content">
                          <p class="mb-1">User management system operational</p>
                          <small class="text-muted">5 minutes ago</small>
                        </div>
                      </div>
                      <div class="activity-item">
                        <div class="activity-icon">
                          <i class="fas fa-shield-alt text-info"></i>
                        </div>
                        <div class="activity-content">
                          <p class="mb-1">
                            Authentication system secured and running
                          </p>
                          <small class="text-muted">10 minutes ago</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="fas fa-info-circle me-2"></i>
                      System Status
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="status-list">
                      <div class="status-item">
                        <span class="status-indicator status-online"></span>
                        <span>Database</span>
                        <span class="status-value">Online</span>
                      </div>
                      <div class="status-item">
                        <span class="status-indicator status-online"></span>
                        <span>API Server</span>
                        <span class="status-value">Online</span>
                      </div>
                      <div class="status-item">
                        <span class="status-indicator status-online"></span>
                        <span>Mobile App</span>
                        <span class="status-value">Online</span>
                      </div>
                      <div class="status-item">
                        <span class="status-indicator status-warning"></span>
                        <span>Backup System</span>
                        <span class="status-value">Syncing</span>
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
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserManagementStore } from '@/stores/userManagement';
import { useCountyManagementStore } from '@/stores/countyManagement';

const router = useRouter();
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

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

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

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  background-color: white;
  min-height: calc(100vh - 76px);
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.sidebar-content {
  padding: 2rem 1rem;
}

.sidebar-title {
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}

.sidebar .nav-link {
  color: #495057;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.sidebar .nav-link:hover {
  background-color: #e9ecef;
  color: var(--primary-color);
}

.sidebar .nav-link.active {
  background-color: var(--primary-color);
  color: white;
}

.main-content {
  padding: 0;
}

.content-wrapper {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
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
}

.stat-card:nth-child(1) .stat-icon {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--secondary-color);
}

.stat-card:nth-child(2) .stat-icon {
  background-color: rgba(39, 174, 96, 0.1);
  color: var(--success-color);
}

.stat-card:nth-child(3) .stat-icon {
  background-color: rgba(241, 196, 15, 0.1);
  color: var(--warning-color);
}

.stat-card:nth-child(4) .stat-icon {
  background-color: rgba(231, 76, 60, 0.1);
  color: var(--danger-color);
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--primary-color);
}

.stat-content p {
  color: #6c757d;
  margin-bottom: 0;
  font-weight: 500;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1rem;
}

.activity-content p {
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: var(--primary-color);
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
  background-color: var(--success-color);
}

.status-warning {
  background-color: var(--warning-color);
}

.status-offline {
  background-color: var(--danger-color);
}

.status-value {
  font-weight: 600;
  color: var(--primary-color);
}

/* Dropdown Menu Styles */
.sidebar .dropdown-menu {
  position: static;
  float: none;
  width: 100%;
  margin-top: 0;
  background-color: #f8f9fa;
  border: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}

.sidebar .dropdown-item {
  padding: 0.5rem 1rem 0.5rem 3rem;
  color: #6c757d;
  font-size: 0.9rem;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.sidebar .dropdown-item:hover {
  background-color: #e9ecef;
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.sidebar .dropdown-item.router-link-active {
  background-color: var(--primary-color);
  color: white;
  border-left-color: var(--primary-color);
}

.sidebar .dropdown-toggle::after {
  margin-left: auto;
  vertical-align: middle;
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
