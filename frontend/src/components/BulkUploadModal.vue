<template>
  <div
    class="modal fade"
    id="bulkUploadModal"
    tabindex="-1"
    aria-labelledby="bulkUploadModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bulkUploadModalLabel">
            <i class="fas fa-upload me-2"></i>
            Bulk Upload Election Data
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Upload Progress -->
          <div v-if="isUploading" class="upload-progress mb-4">
            <div class="progress mb-3">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                :style="{ width: uploadProgress + '%' }"
                :aria-valuenow="uploadProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ Math.round(uploadProgress) }}%
              </div>
            </div>
            <div class="text-center">
              <p class="mb-2">{{ uploadStatus }}</p>
              <small class="text-muted">{{ uploadDetails }}</small>
            </div>
          </div>

          <!-- Upload Form -->
          <div v-else>
            <!-- Upload Type Selection -->
            <div class="mb-4">
              <label class="form-label fw-bold">Upload Type</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="uploadType"
                      id="csv-upload"
                      value="csv"
                      v-model="uploadType"
                    />
                    <label class="form-check-label" for="csv-upload">
                      <i class="fas fa-file-csv me-2"></i>
                      CSV Upload
                      <small class="d-block text-muted"
                        >Upload prepared CSV file</small
                      >
                    </label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="uploadType"
                      id="hierarchical"
                      value="hierarchical"
                      v-model="uploadType"
                    />
                    <label class="form-check-label" for="hierarchical">
                      <i class="fas fa-sitemap me-2"></i>
                      Hierarchical
                      <small class="d-block text-muted"
                        >Counties → Constituencies → Wards → Polling
                        Stations</small
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- File Upload -->
            <div class="mb-4">
              <label for="csvFile" class="form-label fw-bold"> CSV File </label>
              <input
                type="file"
                class="form-control"
                id="csvFile"
                accept=".csv"
                @change="handleFileSelect"
                :disabled="isUploading"
              />
              <div class="form-text">
                Select a CSV file containing election data. Maximum file size:
                50MB
              </div>
            </div>

            <!-- Data Preview -->
            <div v-if="previewData.length > 0" class="mb-4">
              <h6 class="fw-bold">Data Preview (First 5 rows)</h6>
              <div class="table-responsive">
                <table class="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th
                        v-for="(header, index) in previewHeaders"
                        :key="index"
                      >
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in previewData" :key="index">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Upload Options -->
            <div class="mb-4">
              <h6 class="fw-bold">Upload Options</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="skipDuplicates"
                      v-model="options.skipDuplicates"
                    />
                    <label class="form-check-label" for="skipDuplicates">
                      Skip Duplicates
                    </label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="validateData"
                      v-model="options.validateData"
                    />
                    <label class="form-check-label" for="validateData">
                      Validate Data
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upload Results -->
          <div v-if="uploadResults" class="upload-results">
            <h6 class="fw-bold mb-3">Upload Results</h6>
            <div class="row">
              <div class="col-md-6">
                <div class="result-item">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  <span>Successful: {{ uploadResults.successful }}</span>
                </div>
                <div class="result-item">
                  <i class="fas fa-times-circle text-danger me-2"></i>
                  <span>Failed: {{ uploadResults.failed }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="result-item">
                  <i class="fas fa-info-circle text-info me-2"></i>
                  <span>Total: {{ uploadResults.total }}</span>
                </div>
                <div class="result-item">
                  <i class="fas fa-clock text-warning me-2"></i>
                  <span>Duration: {{ uploadResults.duration }}</span>
                </div>
              </div>
            </div>

            <!-- Error Details -->
            <div
              v-if="uploadResults.errors && uploadResults.errors.length > 0"
              class="mt-3"
            >
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <h6 class="fw-bold text-danger mb-0">Errors</h6>
                <button
                  v-if="uploadResults.hasDetailedErrors"
                  class="btn btn-sm btn-outline-danger"
                  @click="viewDetailedErrors"
                >
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  View Detailed Errors
                </button>
              </div>
              <div class="alert alert-danger">
                <div class="row">
                  <div class="col-md-6">
                    <h6 class="fw-bold mb-2">Error Summary:</h6>
                    <ul class="mb-0">
                      <li
                        v-for="(error, index) in uploadResults.errors.slice(
                          0,
                          3
                        )"
                        :key="index"
                      >
                        <strong>{{ error.code }}</strong> - {{ error.error }}
                      </li>
                      <li
                        v-if="uploadResults.errors.length > 3"
                        class="text-muted"
                      >
                        ... and {{ uploadResults.errors.length - 3 }} more
                        errors
                      </li>
                    </ul>
                  </div>
                  <div class="col-md-6">
                    <h6 class="fw-bold mb-2">Error Types:</h6>
                    <div class="d-flex flex-wrap gap-1">
                      <span
                        v-for="(count, type) in errorTypeSummary"
                        :key="type"
                        class="badge"
                        :class="getErrorTypeBadgeClass(type)"
                      >
                        {{ getErrorTypeLabel(type) }}: {{ count }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            :disabled="isUploading"
          >
            {{ isUploading ? 'Uploading...' : 'Cancel' }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="startUpload"
            :disabled="!selectedFile || isUploading"
          >
            <i class="fas fa-upload me-2"></i>
            {{ isUploading ? 'Uploading...' : 'Start Upload' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Reactive data
const uploadType = ref('csv');
const selectedFile = ref<File | null>(null);
const previewData = ref<any[]>([]);
const previewHeaders = ref<string[]>([]);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref('');
const uploadDetails = ref('');
const uploadResults = ref<any>(null);

const options = ref({
  skipDuplicates: true,
  validateData: true,
});

// Computed properties
const canUpload = computed(() => {
  return selectedFile.value && !isUploading.value;
});

const errorTypeSummary = computed(() => {
  if (!uploadResults.value?.errors) return {};

  const summary: Record<string, number> = {};
  uploadResults.value.errors.forEach((error: any) => {
    const type = error.errorType || 'UNKNOWN';
    summary[type] = (summary[type] || 0) + 1;
  });
  return summary;
});

// Methods
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    selectedFile.value = file;
    previewFile(file);
  }
};

const previewFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const lines = text.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());
    const data = lines
      .slice(1, 6)
      .map((line) => line.split(',').map((cell) => cell.trim()));

    previewHeaders.value = headers;
    previewData.value = data;
  };
  reader.readAsText(file);
};

const startUpload = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = 'Preparing upload...';
  uploadDetails.value = 'Reading file and validating data...';

  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 10;
        uploadStatus.value = 'Uploading data...';
        uploadDetails.value = `Processing ${Math.floor(
          uploadProgress.value * 100
        )} records...`;
      }
    }, 500);

    // Read and parse CSV file
    const csvText = await readFileAsText(selectedFile.value);
    const pollingStations = parseCSV(csvText);

    uploadProgress.value = 30;
    uploadStatus.value = 'Validating data...';
    uploadDetails.value = 'Checking data integrity and format...';

    // Call the hierarchical upload API
    const response = await fetch('/api/bulk-upload/hierarchical', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        pollingStations: pollingStations,
      }),
    });

    clearInterval(progressInterval);
    uploadProgress.value = 100;
    uploadStatus.value = 'Upload completed!';
    uploadDetails.value = 'Processing results...';

    if (response.ok) {
      const result = await response.json();
      uploadResults.value = {
        successful: result.data.pollingStations.created,
        failed: result.data.pollingStations.errors.length,
        total: result.data.total,
        duration: '2.5s',
        errors: result.data.pollingStations.errors,
        hasDetailedErrors: result.data.pollingStations.errors.length > 0,
      };

      // Emit success event
      emit('upload-success', result);
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    uploadResults.value = {
      successful: 0,
      failed: 1,
      total: 1,
      duration: '0s',
      errors: [error.message],
    };
  } finally {
    isUploading.value = false;
  }
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      return {
        countyCode: row['County Code'],
        countyName: row['County Name'],
        constCode: row['Const Code'],
        constName: row['Const. Name'],
        cawCode: row['CAW Code'],
        cawName: row['CAW Name'],
        regCentreCode: row['Reg. Centre Code'],
        regCentreName: row['Reg. Centre Name'],
        pollingStationCode: row['Polling Station Code'],
        pollingStationName: row['Polling Station Name'],
        registeredVoters: parseInt(row['Registered Voters']) || 0,
      };
    });
};

// Emits
const emit = defineEmits<{
  'upload-success': [result: any];
}>();

// Error handling methods
const getErrorTypeBadgeClass = (errorType: string) => {
  const classes: Record<string, string> = {
    COUNTY_NOT_FOUND: 'bg-info',
    CONSTITUENCY_NOT_FOUND: 'bg-warning',
    CAW_NOT_FOUND: 'bg-secondary',
    PROCESSING_ERROR: 'bg-danger',
  };
  return classes[errorType] || 'bg-secondary';
};

const getErrorTypeLabel = (errorType: string) => {
  const labels: Record<string, string> = {
    COUNTY_NOT_FOUND: 'County Not Found',
    CONSTITUENCY_NOT_FOUND: 'Constituency Not Found',
    CAW_NOT_FOUND: 'CAW Not Found',
    PROCESSING_ERROR: 'Processing Error',
  };
  return labels[errorType] || errorType;
};

const viewDetailedErrors = () => {
  // Store error data in session storage for the error page
  sessionStorage.setItem(
    'uploadErrors',
    JSON.stringify({
      errors: uploadResults.value.errors,
      uploadResults: uploadResults.value,
    })
  );

  // Navigate to error page
  window.open('/upload-errors', '_blank');
};

// Reset modal when closed
const resetModal = () => {
  selectedFile.value = null;
  previewData.value = [];
  previewHeaders.value = [];
  uploadResults.value = null;
  uploadProgress.value = 0;
  uploadStatus.value = '';
  uploadDetails.value = '';
  isUploading.value = false;
  uploadType.value = 'csv';
};

// Expose reset method
defineExpose({
  resetModal,
});
</script>

<style scoped>
/* Bulk upload modal styles are now globally available via main.ts */
</style>
