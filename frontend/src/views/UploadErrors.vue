<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">
              <i class="fas fa-exclamation-triangle text-warning me-2"></i>
              Upload Errors
            </h2>
            <p class="text-muted mb-0">
              Detailed view of errors encountered during bulk upload
            </p>
          </div>
          <div>
            <button class="btn btn-outline-secondary me-2" @click="goBack">
              <i class="fas fa-arrow-left me-1"></i>
              Back to Upload
            </button>
            <button class="btn btn-primary" @click="downloadErrorReport">
              <i class="fas fa-download me-1"></i>
              Download Report
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-danger text-white">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-times-circle fa-2x"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h4 class="mb-0">{{ errorSummary.total }}</h4>
                    <small>Total Errors</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-map-marker-alt fa-2x"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h4 class="mb-0">
                      {{ errorSummary.byType.CONSTITUENCY_NOT_FOUND || 0 }}
                    </h4>
                    <small>Constituency Errors</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-building fa-2x"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h4 class="mb-0">
                      {{ errorSummary.byType.COUNTY_NOT_FOUND || 0 }}
                    </h4>
                    <small>County Errors</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-secondary text-white">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-home fa-2x"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h4 class="mb-0">
                      {{ errorSummary.byType.CAW_NOT_FOUND || 0 }}
                    </h4>
                    <small>CAW Errors</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-4">
                <label class="form-label fw-bold">Filter by Error Type</label>
                <select v-model="selectedErrorType" class="form-select">
                  <option value="">All Error Types</option>
                  <option value="COUNTY_NOT_FOUND">County Not Found</option>
                  <option value="CONSTITUENCY_NOT_FOUND">
                    Constituency Not Found
                  </option>
                  <option value="CAW_NOT_FOUND">CAW Not Found</option>
                  <option value="PROCESSING_ERROR">Processing Error</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold">Search</label>
                <input
                  v-model="searchTerm"
                  type="text"
                  class="form-control"
                  placeholder="Search by code or name..."
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold">Show</label>
                <select v-model="itemsPerPage" class="form-select">
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-list me-2"></i>
              Error Details
              <span class="badge bg-danger ms-2">{{
                filteredErrors.length
              }}</span>
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Polling Station</th>
                    <th>County</th>
                    <th>Constituency</th>
                    <th>CAW</th>
                    <th>Error Type</th>
                    <th>Error Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="error in paginatedErrors"
                    :key="`${error.code}-${error.errorType}`"
                  >
                    <td>
                      <div>
                        <strong>{{ error.code }}</strong>
                        <br />
                        <small class="text-muted">{{ error.name }}</small>
                      </div>
                    </td>
                    <td>
                      <div v-if="error.countyCode">
                        <strong>{{ error.countyCode }}</strong>
                        <br />
                        <small class="text-muted">{{ error.countyName }}</small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div v-if="error.constCode">
                        <strong>{{ error.constCode }}</strong>
                        <br />
                        <small class="text-muted">{{ error.constName }}</small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div v-if="error.cawCode">
                        <strong>{{ error.cawCode }}</strong>
                        <br />
                        <small class="text-muted">{{ error.cawName }}</small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getErrorTypeBadgeClass(error.errorType)"
                      >
                        {{ getErrorTypeLabel(error.errorType) }}
                      </span>
                    </td>
                    <td>
                      <div class="text-wrap" style="max-width: 300px">
                        {{ error.error }}
                      </div>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="viewRowData(error)"
                        title="View Row Data"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              v-if="totalPages > 1"
              class="d-flex justify-content-between align-items-center p-3 border-top"
            >
              <div class="text-muted">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                {{
                  Math.min(currentPage * itemsPerPage, filteredErrors.length)
                }}
                of {{ filteredErrors.length }} errors
              </div>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <button
                      class="page-link"
                      @click="currentPage = 1"
                      :disabled="currentPage === 1"
                    >
                      First
                    </button>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <button
                      class="page-link"
                      @click="currentPage--"
                      :disabled="currentPage === 1"
                    >
                      Previous
                    </button>
                  </li>
                  <li
                    v-for="page in visiblePages"
                    :key="page"
                    class="page-item"
                    :class="{ active: currentPage === page }"
                  >
                    <button class="page-link" @click="currentPage = page">
                      {{ page }}
                    </button>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <button
                      class="page-link"
                      @click="currentPage++"
                      :disabled="currentPage === totalPages"
                    >
                      Next
                    </button>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <button
                      class="page-link"
                      @click="currentPage = totalPages"
                      :disabled="currentPage === totalPages"
                    >
                      Last
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row Data Modal -->
    <div
      class="modal fade"
      id="rowDataModal"
      tabindex="-1"
      aria-labelledby="rowDataModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="rowDataModalLabel">
              <i class="fas fa-database me-2"></i>
              Row Data Preview
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedRowData">
              <h6 class="fw-bold mb-3">Complete Row Data</h6>
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(value, key) in selectedRowData" :key="key">
                      <td>
                        <strong>{{ formatFieldName(String(key)) }}</strong>
                      </td>
                      <td>{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/css/views.css';

const router = useRouter();

// Get data from session storage
const getStoredData = () => {
  const stored = sessionStorage.getItem('uploadErrors');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored upload errors:', e);
    }
  }
  return { errors: [], uploadResults: null };
};

const storedData = getStoredData();

// Reactive data
const selectedErrorType = ref('');
const searchTerm = ref('');
const itemsPerPage = ref(25);
const currentPage = ref(1);
const selectedRowData = ref<any>(null);

// Computed properties
const filteredErrors = computed(() => {
  let filtered = storedData.errors;

  // Filter by error type
  if (selectedErrorType.value) {
    filtered = filtered.filter(
      (error: any) => error.errorType === selectedErrorType.value
    );
  }

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (error: any) =>
        error.code.toLowerCase().includes(term) ||
        error.name.toLowerCase().includes(term) ||
        (error.countyName && error.countyName.toLowerCase().includes(term)) ||
        (error.constName && error.constName.toLowerCase().includes(term)) ||
        (error.cawName && error.cawName.toLowerCase().includes(term))
    );
  }

  return filtered;
});

const paginatedErrors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredErrors.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredErrors.value.length / itemsPerPage.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const errorSummary = computed(() => {
  const summary = {
    total: storedData.errors.length,
    byType: {} as Record<string, number>,
  };

  storedData.errors.forEach((error: any) => {
    const type = error.errorType || 'UNKNOWN';
    summary.byType[type] = (summary.byType[type] || 0) + 1;
  });

  return summary;
});

// Methods
const getErrorTypeBadgeClass = (errorType: string) => {
  const classes = {
    COUNTY_NOT_FOUND: 'bg-info',
    CONSTITUENCY_NOT_FOUND: 'bg-warning',
    CAW_NOT_FOUND: 'bg-secondary',
    PROCESSING_ERROR: 'bg-danger',
  };
  return classes[errorType as keyof typeof classes] || 'bg-secondary';
};

const getErrorTypeLabel = (errorType: string) => {
  const labels = {
    COUNTY_NOT_FOUND: 'County Not Found',
    CONSTITUENCY_NOT_FOUND: 'Constituency Not Found',
    CAW_NOT_FOUND: 'CAW Not Found',
    PROCESSING_ERROR: 'Processing Error',
  };
  return labels[errorType as keyof typeof labels] || errorType;
};

const formatFieldName = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const viewRowData = (error: any) => {
  selectedRowData.value = error.rowData || error;
  // Show modal
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('rowDataModal')
  );
  modal.show();
};

const goBack = () => {
  router.go(-1);
};

const downloadErrorReport = () => {
  // Create CSV content
  const headers = [
    'Polling Station Code',
    'Polling Station Name',
    'County Code',
    'County Name',
    'Constituency Code',
    'Constituency Name',
    'CAW Code',
    'CAW Name',
    'Error Type',
    'Error Message',
  ];

  const csvContent = [
    headers.join(','),
    ...filteredErrors.value.map((error: any) =>
      [
        error.code || '',
        error.name || '',
        error.countyCode || '',
        error.countyName || '',
        error.constCode || '',
        error.constName || '',
        error.cawCode || '',
        error.cawName || '',
        error.errorType || '',
        `"${(error.error || '').replace(/"/g, '""')}"`,
      ].join(',')
    ),
  ].join('\n');

  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `upload-errors-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Reset pagination when filters change
const resetPagination = () => {
  currentPage.value = 1;
};

// Watch for filter changes
const watchFilters = () => {
  selectedErrorType.value && resetPagination();
  searchTerm.value && resetPagination();
  itemsPerPage.value && resetPagination();
};

onMounted(() => {
  // Initialize any required setup
});
</script>
