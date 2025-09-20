<template>
  <MainLayout
    page-title="Constituency Management"
    page-subtitle="Manage constituencies"
  >
    <!-- Error Alert -->
    <div
      v-if="constituencyManagementStore.error"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <i class="fas fa-exclamation-circle me-2"></i>
      {{ constituencyManagementStore.error }}
      <button
        type="button"
        class="btn-close"
        @click="constituencyManagementStore.clearError()"
      ></button>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <div class="row align-items-center">
        <div class="col-md-3">
          <div class="search-box">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Search constituencies..."
                v-model="searchQuery"
                @input="handleSearch"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="county-filter">
            <select
              v-model="selectedCountyId"
              @change="handleCountyFilter"
              class="form-select form-select-sm"
            >
              <option value="">All Counties</option>
              <option
                v-for="county in counties"
                :key="county.id"
                :value="county.id"
              >
                {{ county.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-3">
          <div class="page-size-selector">
            <label class="form-label me-2 mb-0">Show:</label>
            <select
              v-model="pageSize"
              @change="handlePageSizeChange"
              class="form-select form-select-sm"
              style="width: auto; display: inline-block"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
        <div class="col-md-3 text-end">
          <button
            class="btn btn-primary"
            @click="showCreateModal = true"
            :disabled="constituencyManagementStore.loading"
          >
            <i class="fas fa-plus me-2"></i>
            Add Constituency
          </button>
        </div>
      </div>
    </div>

    <!-- Constituencies Table -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="fas fa-map me-2"></i>
          Constituencies
          <span class="badge bg-primary ms-2">{{
            constituencyManagementStore.totalConstituencies
          }}</span>
        </h5>
      </div>
      <div class="card-body p-0">
        <div v-if="constituencyManagementStore.loading" class="text-center p-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading constituencies...</p>
        </div>

        <div
          v-else-if="!constituencyManagementStore.hasConstituencies"
          class="text-center p-4"
        >
          <i class="fas fa-map fa-3x text-muted mb-3"></i>
          <h5>No constituencies found</h5>
          <p class="text-muted">
            Get started by adding your first constituency.
          </p>
          <button class="btn btn-primary" @click="showCreateModal = true">
            <i class="fas fa-plus me-2"></i>
            Add Constituency
          </button>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th @click="handleSort('code')" class="sortable">
                  Code
                  <i class="fas fa-sort ms-1" v-if="sortBy !== 'code'"></i>
                  <i
                    class="fas fa-sort-up ms-1"
                    v-else-if="sortOrder === 'asc'"
                  ></i>
                  <i class="fas fa-sort-down ms-1" v-else></i>
                </th>
                <th @click="handleSort('name')" class="sortable">
                  Name
                  <i class="fas fa-sort ms-1" v-if="sortBy !== 'name'"></i>
                  <i
                    class="fas fa-sort-up ms-1"
                    v-else-if="sortOrder === 'asc'"
                  ></i>
                  <i class="fas fa-sort-down ms-1" v-else></i>
                </th>
                <th @click="handleSort('county.name')" class="sortable">
                  County
                  <i
                    class="fas fa-sort ms-1"
                    v-if="sortBy !== 'county.name'"
                  ></i>
                  <i
                    class="fas fa-sort-up ms-1"
                    v-else-if="sortOrder === 'asc'"
                  ></i>
                  <i class="fas fa-sort-down ms-1" v-else></i>
                </th>
                <th>Wards</th>
                <th>Polling Stations</th>
                <th @click="handleSort('createdAt')" class="sortable">
                  Created
                  <i class="fas fa-sort ms-1" v-if="sortBy !== 'createdAt'"></i>
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
                v-for="constituency in constituencyManagementStore.filteredConstituencies"
                :key="constituency.id"
              >
                <td>
                  <span class="badge bg-secondary">{{
                    constituency.code
                  }}</span>
                </td>
                <td>
                  <strong>{{ constituency.name }}</strong>
                </td>
                <td>
                  <div>
                    <strong>{{ constituency.county.code }}</strong>
                    <br />
                    <small class="text-muted">{{
                      constituency.county.name
                    }}</small>
                  </div>
                </td>
                <td>
                  <span class="badge bg-info">{{
                    constituency._count?.caws || 0
                  }}</span>
                </td>
                <td>
                  <span class="badge bg-success">{{
                    constituency._count?.pollingStations || 0
                  }}</span>
                </td>
                <td>
                  <small class="text-muted">
                    {{ formatDate(constituency.createdAt) }}
                  </small>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-primary"
                      @click="viewConstituency(constituency)"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="btn btn-outline-warning"
                      @click="editConstituency(constituency)"
                      title="Edit Constituency"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="deleteConstituency(constituency)"
                      :title="
                        (constituency._count?.caws ?? 0) > 0
                          ? 'Cannot delete - has wards'
                          : 'Delete Constituency'
                      "
                      :disabled="(constituency._count?.caws ?? 0) > 0"
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
        v-if="constituencyManagementStore.pagination.totalPages > 1"
        class="card-footer"
      >
        <nav aria-label="Constituencies pagination">
          <ul class="pagination pagination-sm justify-content-center mb-0">
            <li
              class="page-item"
              :class="{
                disabled: constituencyManagementStore.pagination.page === 1,
              }"
            >
              <button
                class="page-link"
                @click="
                  changePage(constituencyManagementStore.pagination.page - 1)
                "
                :disabled="constituencyManagementStore.pagination.page === 1"
              >
                Previous
              </button>
            </li>

            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{
                active: page === constituencyManagementStore.pagination.page,
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
                  constituencyManagementStore.pagination.page ===
                  constituencyManagementStore.pagination.totalPages,
              }"
            >
              <button
                class="page-link"
                @click="
                  changePage(constituencyManagementStore.pagination.page + 1)
                "
                :disabled="
                  constituencyManagementStore.pagination.page ===
                  constituencyManagementStore.pagination.totalPages
                "
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Create Constituency Modal -->
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
              Add New Constituency
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showCreateModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleCreateConstituency">
              <div class="mb-3">
                <label for="constituencyCode" class="form-label"
                  >Constituency Code *</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="constituencyCode"
                  v-model="createForm.code"
                  placeholder="e.g., 001"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="constituencyName" class="form-label"
                  >Constituency Name *</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="constituencyName"
                  v-model="createForm.name"
                  placeholder="e.g., Changamwe"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="countySelect" class="form-label">County *</label>
                <select
                  class="form-select"
                  id="countySelect"
                  v-model="createForm.countyId"
                  required
                >
                  <option value="">Select a county</option>
                  <option
                    v-for="county in counties"
                    :key="county.id"
                    :value="county.id"
                  >
                    {{ county.name }} ({{ county.code }})
                  </option>
                </select>
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
              @click="handleCreateConstituency"
              :disabled="
                constituencyManagementStore.loading ||
                !createForm.code ||
                !createForm.name ||
                !createForm.countyId
              "
            >
              <i
                class="fas fa-spinner fa-spin me-2"
                v-if="constituencyManagementStore.loading"
              ></i>
              <i class="fas fa-plus me-2" v-else></i>
              Create Constituency
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Constituency Modal -->
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
              Edit Constituency
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showEditModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleUpdateConstituency">
              <div class="mb-3">
                <label for="editConstituencyCode" class="form-label"
                  >Constituency Code *</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="editConstituencyCode"
                  v-model="editForm.code"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editConstituencyName" class="form-label"
                  >Constituency Name *</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="editConstituencyName"
                  v-model="editForm.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editCountySelect" class="form-label"
                  >County *</label
                >
                <select
                  class="form-select"
                  id="editCountySelect"
                  v-model="editForm.countyId"
                  required
                >
                  <option value="">Select a county</option>
                  <option
                    v-for="county in counties"
                    :key="county.id"
                    :value="county.id"
                  >
                    {{ county.name }} ({{ county.code }})
                  </option>
                </select>
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
              @click="handleUpdateConstituency"
              :disabled="
                constituencyManagementStore.loading ||
                !editForm.code ||
                !editForm.name ||
                !editForm.countyId
              "
            >
              <i
                class="fas fa-spinner fa-spin me-2"
                v-if="constituencyManagementStore.loading"
              ></i>
              <i class="fas fa-save me-2" v-else></i>
              Update Constituency
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Constituency Modal -->
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
              Constituency Details
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showViewModal = false"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedConstituency">
            <div class="row">
              <div class="col-md-6">
                <h6>Code</h6>
                <p class="text-muted">{{ selectedConstituency.code }}</p>
              </div>
              <div class="col-md-6">
                <h6>Name</h6>
                <p class="text-muted">{{ selectedConstituency.name }}</p>
              </div>
              <div class="col-md-6">
                <h6>County</h6>
                <p class="text-muted">
                  {{ selectedConstituency.county.name }} ({{
                    selectedConstituency.county.code
                  }})
                </p>
              </div>
              <div class="col-md-6">
                <h6>Wards</h6>
                <p class="text-muted">
                  {{ selectedConstituency._count?.caws || 0 }}
                </p>
              </div>
              <div class="col-md-6">
                <h6>Polling Stations</h6>
                <p class="text-muted">
                  {{ selectedConstituency._count?.pollingStations || 0 }}
                </p>
              </div>
              <div class="col-md-6">
                <h6>Created</h6>
                <p class="text-muted">
                  {{ formatDate(selectedConstituency.createdAt) }}
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
              @click="
                selectedConstituency && editConstituency(selectedConstituency)
              "
            >
              <i class="fas fa-edit me-2"></i>
              Edit Constituency
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
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useConstituencyManagementStore } from '@/stores/constituencyManagement';
import { useCountyManagementStore } from '@/stores/countyManagement';
import type { Constituency } from '@/services/constituencyService';
import MainLayout from '@/components/MainLayout.vue';

const authStore = useAuthStore();
const constituencyManagementStore = useConstituencyManagementStore();
const countyManagementStore = useCountyManagementStore();

// State
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedConstituency = ref<Constituency | null>(null);
const searchQuery = ref('');
const sortBy = ref('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');
const pageSize = ref(10);
const selectedCountyId = ref<string | null>(null);

// Forms
const createForm = ref({
  code: '',
  name: '',
  countyId: '',
});

const editForm = ref({
  code: '',
  name: '',
  countyId: '',
});

// Computed
const user = computed(() => authStore.user);
const counties = computed(() => countyManagementStore.counties);

const visiblePages = computed(() => {
  const current = constituencyManagementStore.pagination.page;
  const total = constituencyManagementStore.pagination.totalPages;
  const pages = [];

  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const handleSearch = () => {
  constituencyManagementStore.setSearchQuery(searchQuery.value);
  constituencyManagementStore.fetchConstituencies({ page: 1 });
};

const handleCountyFilter = () => {
  constituencyManagementStore.setSelectedCounty(selectedCountyId.value);
  constituencyManagementStore.fetchConstituencies({ page: 1 });
};

const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }

  constituencyManagementStore.setSorting(sortBy.value, sortOrder.value);
  constituencyManagementStore.fetchConstituencies({ page: 1 });
};

const changePage = (page: number) => {
  constituencyManagementStore.changePage(page);
};

const handlePageSizeChange = () => {
  constituencyManagementStore.changePageSize(Number(pageSize.value));
};

const viewConstituency = (constituency: Constituency) => {
  selectedConstituency.value = constituency;
  showViewModal.value = true;
};

const editConstituency = (constituency: Constituency) => {
  selectedConstituency.value = constituency;
  editForm.value = {
    code: constituency.code,
    name: constituency.name,
    countyId: constituency.countyId,
  };
  showEditModal.value = true;
  showViewModal.value = false;
};

const deleteConstituency = async (constituency: Constituency) => {
  const wardCount = constituency._count?.caws || 0;
  let confirmMessage = `Are you sure you want to delete ${constituency.name}?`;

  if (wardCount > 0) {
    confirmMessage += `\n\n⚠️ This constituency has ${wardCount} ward(s) associated with it. Deleting this constituency will not be possible until all wards are removed first.`;
  }

  if (confirm(confirmMessage)) {
    try {
      await constituencyManagementStore.deleteConstituency(constituency.id);
    } catch (error) {
      // Error is handled by the store
    }
  }
};

const handleCreateConstituency = async () => {
  try {
    await constituencyManagementStore.createConstituency(createForm.value);
    showCreateModal.value = false;
    createForm.value = { code: '', name: '', countyId: '' };
  } catch (error) {
    // Error is handled by the store
  }
};

const handleUpdateConstituency = async () => {
  if (!selectedConstituency.value) return;

  try {
    await constituencyManagementStore.updateConstituency(
      selectedConstituency.value.id,
      editForm.value
    );
    showEditModal.value = false;
    selectedConstituency.value = null;
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
onMounted(async () => {
  // Fetch counties for the dropdown
  await countyManagementStore.fetchCounties({ limit: 1000 });
  // Fetch constituencies
  constituencyManagementStore.fetchConstituencies();
});

// Watch for search query changes
watch(searchQuery, () => {
  const timeoutId = setTimeout(() => {
    handleSearch();
  }, 500);

  return () => clearTimeout(timeoutId);
});
</script>
