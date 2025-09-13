<template>
  <div class="county-management-page">
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
            <li class="nav-item">
              <a class="nav-link active" href="#">
                <i class="fas fa-map-marker-alt me-1"></i>
                Counties
              </a>
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
                <router-link to="/dashboard" class="nav-link">
                  <i class="fas fa-tachometer-alt me-2"></i>
                  Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/users" class="nav-link">
                  <i class="fas fa-users me-2"></i>
                  User Management
                </router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  Counties
                </a>
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
              <h1 class="page-title">County Management</h1>
              <p class="page-subtitle">Manage counties and their information</p>
            </div>

            <!-- Error Alert -->
            <div
              v-if="countyManagementStore.error"
              class="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <i class="fas fa-exclamation-circle me-2"></i>
              {{ countyManagementStore.error }}
              <button
                type="button"
                class="btn-close"
                @click="countyManagementStore.clearError()"
              ></button>
            </div>

            <!-- Action Bar -->
            <div class="action-bar">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div class="search-box">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Search counties..."
                        v-model="searchQuery"
                        @input="handleSearch"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 text-end">
                  <button
                    class="btn btn-primary"
                    @click="showCreateModal = true"
                    :disabled="countyManagementStore.loading"
                  >
                    <i class="fas fa-plus me-2"></i>
                    Add County
                  </button>
                </div>
              </div>
            </div>

            <!-- Counties Table -->
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  Counties
                  <span class="badge bg-primary ms-2">{{
                    countyManagementStore.totalCounties
                  }}</span>
                </h5>
              </div>
              <div class="card-body p-0">
                <div
                  v-if="countyManagementStore.loading"
                  class="text-center p-4"
                >
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading counties...</p>
                </div>

                <div
                  v-else-if="!countyManagementStore.hasCounties"
                  class="text-center p-4"
                >
                  <i class="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                  <h5>No counties found</h5>
                  <p class="text-muted">
                    Get started by adding your first county.
                  </p>
                  <button
                    class="btn btn-primary"
                    @click="showCreateModal = true"
                  >
                    <i class="fas fa-plus me-2"></i>
                    Add County
                  </button>
                </div>

                <div v-else class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th @click="handleSort('code')" class="sortable">
                          Code
                          <i
                            class="fas fa-sort ms-1"
                            v-if="sortBy !== 'code'"
                          ></i>
                          <i
                            class="fas fa-sort-up ms-1"
                            v-else-if="sortOrder === 'asc'"
                          ></i>
                          <i class="fas fa-sort-down ms-1" v-else></i>
                        </th>
                        <th @click="handleSort('name')" class="sortable">
                          Name
                          <i
                            class="fas fa-sort ms-1"
                            v-if="sortBy !== 'name'"
                          ></i>
                          <i
                            class="fas fa-sort-up ms-1"
                            v-else-if="sortOrder === 'asc'"
                          ></i>
                          <i class="fas fa-sort-down ms-1" v-else></i>
                        </th>
                        <th>Constituencies</th>
                        <th @click="handleSort('createdAt')" class="sortable">
                          Created
                          <i
                            class="fas fa-sort ms-1"
                            v-if="sortBy !== 'createdAt'"
                          ></i>
                          <i
                            class="fas fa-sort-up ms-1"
                            v-else-if="sortOrder === 'asc'"
                          ></i>
                          <i class="fas fa-sort-down ms-1" v-else></i>
                        </th>
                        <th width="120">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="county in countyManagementStore.filteredCounties"
                        :key="county.id"
                      >
                        <td>
                          <span class="badge bg-secondary">{{
                            county.code
                          }}</span>
                        </td>
                        <td>
                          <strong>{{ county.name }}</strong>
                        </td>
                        <td>
                          <span class="badge bg-info">{{
                            county._count?.constituencies || 0
                          }}</span>
                        </td>
                        <td>
                          <small class="text-muted">
                            {{ formatDate(county.createdAt) }}
                          </small>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button
                              class="btn btn-outline-primary"
                              @click="viewCounty(county)"
                              title="View Details"
                            >
                              <i class="fas fa-eye"></i>
                            </button>
                            <button
                              class="btn btn-outline-warning"
                              @click="editCounty(county)"
                              title="Edit County"
                            >
                              <i class="fas fa-edit"></i>
                            </button>
                            <button
                              class="btn btn-outline-danger"
                              @click="deleteCounty(county)"
                              title="Delete County"
                            >
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Pagination -->
              <div
                v-if="countyManagementStore.pagination.totalPages > 1"
                class="card-footer"
              >
                <nav aria-label="Counties pagination">
                  <ul
                    class="pagination pagination-sm justify-content-center mb-0"
                  >
                    <li
                      class="page-item"
                      :class="{
                        disabled: countyManagementStore.pagination.page === 1,
                      }"
                    >
                      <button
                        class="page-link"
                        @click="
                          changePage(countyManagementStore.pagination.page - 1)
                        "
                        :disabled="countyManagementStore.pagination.page === 1"
                      >
                        Previous
                      </button>
                    </li>

                    <li
                      v-for="page in visiblePages"
                      :key="page"
                      class="page-item"
                      :class="{
                        active: page === countyManagementStore.pagination.page,
                      }"
                    >
                      <button class="page-link" @click="changePage(page)">
                        {{ page }}
                      </button>
                    </li>

                    <li
                      class="page-item"
                      :class="{
                        disabled:
                          countyManagementStore.pagination.page ===
                          countyManagementStore.pagination.totalPages,
                      }"
                    >
                      <button
                        class="page-link"
                        @click="
                          changePage(countyManagementStore.pagination.page + 1)
                        "
                        :disabled="
                          countyManagementStore.pagination.page ===
                          countyManagementStore.pagination.totalPages
                        "
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create County Modal -->
    <div
      class="modal fade"
      :class="{ show: showCreateModal, 'd-block': showCreateModal }"
      tabindex="-1"
      v-if="showCreateModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-plus me-2"></i>
              Add New County
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showCreateModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleCreateCounty">
              <div class="mb-3">
                <label for="countyCode" class="form-label">County Code *</label>
                <input
                  type="text"
                  class="form-control"
                  id="countyCode"
                  v-model="createForm.code"
                  placeholder="e.g., 001"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="countyName" class="form-label">County Name *</label>
                <input
                  type="text"
                  class="form-control"
                  id="countyName"
                  v-model="createForm.name"
                  placeholder="e.g., Nairobi County"
                  required
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleCreateCounty"
              :disabled="
                countyManagementStore.loading ||
                !createForm.code ||
                !createForm.name
              "
            >
              <i
                class="fas fa-spinner fa-spin me-2"
                v-if="countyManagementStore.loading"
              ></i>
              <i class="fas fa-plus me-2" v-else></i>
              Create County
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit County Modal -->
    <div
      class="modal fade"
      :class="{ show: showEditModal, 'd-block': showEditModal }"
      tabindex="-1"
      v-if="showEditModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>
              Edit County
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showEditModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleUpdateCounty">
              <div class="mb-3">
                <label for="editCountyCode" class="form-label"
                  >County Code *</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="editCountyCode"
                  v-model="editForm.code"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editCountyName" class="form-label"
                  >County Name *</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="editCountyName"
                  v-model="editForm.name"
                  required
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showEditModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleUpdateCounty"
              :disabled="
                countyManagementStore.loading ||
                !editForm.code ||
                !editForm.name
              "
            >
              <i
                class="fas fa-spinner fa-spin me-2"
                v-if="countyManagementStore.loading"
              ></i>
              <i class="fas fa-save me-2" v-else></i>
              Update County
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View County Modal -->
    <div
      class="modal fade"
      :class="{ show: showViewModal, 'd-block': showViewModal }"
      tabindex="-1"
      v-if="showViewModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-eye me-2"></i>
              County Details
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showViewModal = false"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedCounty">
            <div class="row">
              <div class="col-md-6">
                <h6>Code</h6>
                <p class="text-muted">{{ selectedCounty.code }}</p>
              </div>
              <div class="col-md-6">
                <h6>Name</h6>
                <p class="text-muted">{{ selectedCounty.name }}</p>
              </div>
              <div class="col-md-6">
                <h6>Constituencies</h6>
                <p class="text-muted">
                  {{ selectedCounty._count?.constituencies || 0 }}
                </p>
              </div>
              <div class="col-md-6">
                <h6>Created</h6>
                <p class="text-muted">
                  {{ formatDate(selectedCounty.createdAt) }}
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showViewModal = false"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="selectedCounty && editCounty(selectedCounty)"
            >
              <i class="fas fa-edit me-2"></i>
              Edit County
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div
      v-if="showCreateModal || showEditModal || showViewModal"
      class="modal-backdrop fade show"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCountyManagementStore } from '@/stores/countyManagement';
import type { County } from '@/services/countyService';

const router = useRouter();
const authStore = useAuthStore();
const countyManagementStore = useCountyManagementStore();

// State
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedCounty = ref<County | null>(null);
const searchQuery = ref('');
const sortBy = ref('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');

// Forms
const createForm = ref({
  code: '',
  name: '',
});

const editForm = ref({
  code: '',
  name: '',
});

// Computed
const user = computed(() => authStore.user);

const visiblePages = computed(() => {
  const current = countyManagementStore.pagination.page;
  const total = countyManagementStore.pagination.totalPages;
  const pages = [];

  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const handleSearch = () => {
  countyManagementStore.setSearchQuery(searchQuery.value);
  countyManagementStore.fetchCounties({ page: 1 });
};

const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }

  countyManagementStore.setSorting(sortBy.value, sortOrder.value);
  countyManagementStore.fetchCounties({ page: 1 });
};

const changePage = (page: number) => {
  countyManagementStore.changePage(page);
};

const viewCounty = (county: County) => {
  selectedCounty.value = county;
  showViewModal.value = true;
};

const editCounty = (county: County) => {
  selectedCounty.value = county;
  editForm.value = {
    code: county.code,
    name: county.name,
  };
  showEditModal.value = true;
  showViewModal.value = false;
};

const deleteCounty = async (county: County) => {
  if (confirm(`Are you sure you want to delete ${county.name}?`)) {
    try {
      await countyManagementStore.deleteCounty(county.id);
    } catch (error) {
      // Error is handled by the store
    }
  }
};

const handleCreateCounty = async () => {
  try {
    await countyManagementStore.createCounty(createForm.value);
    showCreateModal.value = false;
    createForm.value = { code: '', name: '' };
  } catch (error) {
    // Error is handled by the store
  }
};

const handleUpdateCounty = async () => {
  if (!selectedCounty.value) return;

  try {
    await countyManagementStore.updateCounty(
      selectedCounty.value.id,
      editForm.value
    );
    showEditModal.value = false;
    selectedCounty.value = null;
  } catch (error) {
    // Error is handled by the store
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Lifecycle
onMounted(() => {
  countyManagementStore.fetchCounties();
});

// Watch for search query changes
watch(searchQuery, () => {
  const timeoutId = setTimeout(() => {
    handleSearch();
  }, 500);

  return () => clearTimeout(timeoutId);
});
</script>

<style scoped>
.county-management-page {
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

.action-bar {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.search-box .input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.search-box .form-control {
  border-left: none;
}

.search-box .form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: #f8f9fa;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

.modal.show {
  display: block !important;
}

.modal-backdrop.show {
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    min-height: auto;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .action-bar {
    padding: 1rem;
  }

  .table-responsive {
    font-size: 0.875rem;
  }
}
</style>
