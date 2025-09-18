<template>
  <div class="dashboard-page">
    <!-- Navigation -->
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
import { useAuthStore } from '@/stores/auth';
import { useUserManagementStore } from '@/stores/userManagement';
import { useCountyManagementStore } from '@/stores/countyManagement';
import AppSidebar from '@/components/AppSidebar.vue';
import TopBar from '@/components/TopBar.vue';
import '@/assets/css/views.css';

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
