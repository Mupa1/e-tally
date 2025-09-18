<template>
  <!-- Top Navigation Bar -->
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
