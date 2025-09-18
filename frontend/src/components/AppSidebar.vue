<template>
  <div class="col-md-3 col-lg-2 sidebar">
    <div class="sidebar-content">
      <h6 class="sidebar-title">Navigation</h6>
      <ul class="nav flex-column">
        <!-- Dashboard Section -->
        <li class="nav-item">
          <router-link
            to="/dashboard"
            class="nav-link"
            :class="{ active: $route.name === 'Dashboard' }"
          >
            <i class="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </router-link>
        </li>

        <!-- User Management -->
        <li class="nav-item">
          <router-link
            to="/users"
            class="nav-link"
            :class="{ active: $route.name === 'UserManagement' }"
          >
            <i class="fas fa-users me-2"></i>
            User Management
          </router-link>
        </li>

        <!-- Election Management Dropdown -->
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
              <router-link to="/election-management" class="dropdown-item">
                <i class="fas fa-home me-2"></i>
                Overview
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link
                to="/counties"
                class="dropdown-item"
                :class="{ active: $route.name === 'CountyManagement' }"
              >
                <i class="fas fa-map-marker-alt me-2"></i>
                Counties
              </router-link>
            </li>
            <li>
              <router-link
                to="/constituencies"
                class="dropdown-item"
                :class="{ active: $route.name === 'ConstituencyManagement' }"
              >
                <i class="fas fa-map me-2"></i>
                Constituencies
              </router-link>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                :class="{ active: $route.name === 'CAWManagement' }"
              >
                <i class="fas fa-building me-2"></i>
                Wards
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                :class="{ active: $route.name === 'PollingStationManagement' }"
              >
                <i class="fas fa-poll me-2"></i>
                Polling Stations
              </a>
            </li>
          </ul>
        </li>

        <!-- Candidates -->
        <li class="nav-item">
          <a
            class="nav-link"
            href="#"
            :class="{ active: $route.name === 'CandidateManagement' }"
          >
            <i class="fas fa-user-tie me-2"></i>
            Candidates
          </a>
        </li>

        <!-- Election Results -->
        <li class="nav-item">
          <a
            class="nav-link"
            href="#"
            :class="{ active: $route.name === 'ElectionResults' }"
          >
            <i class="fas fa-chart-line me-2"></i>
            Election Results
          </a>
        </li>

        <!-- Incidents -->
        <li class="nav-item">
          <a
            class="nav-link"
            href="#"
            :class="{ active: $route.name === 'IncidentManagement' }"
          >
            <i class="fas fa-exclamation-triangle me-2"></i>
            Incidents
          </a>
        </li>

        <!-- Audit Logs -->
        <li class="nav-item">
          <a
            class="nav-link"
            href="#"
            :class="{ active: $route.name === 'AuditLogs' }"
          >
            <i class="fas fa-clipboard-list me-2"></i>
            Audit Logs
          </a>
        </li>
      </ul>

      <!-- User Profile Section -->
      <div class="sidebar-user-section">
        <hr class="my-3" />
        <div class="user-profile">
          <div class="user-info">
            <div class="user-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-details">
              <div class="user-name">
                {{ user?.firstName }} {{ user?.lastName }}
              </div>
              <div class="user-role">{{ user?.role }}</div>
            </div>
          </div>
          <div class="user-actions">
            <button
              class="btn btn-sm btn-outline-light"
              @click="handleLogout"
              title="Logout"
            >
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Computed
const user = computed(() => authStore.user);

// Methods
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Sidebar styles are now globally available via main.ts */
</style>
