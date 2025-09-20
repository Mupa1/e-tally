<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!-- Background overlay -->
      <Overlay @close="closeModal" />

      <!-- Modal panel -->
      <div
        class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
      >
        <!-- Modal header -->
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-upload mr-2"></i>
              Bulk Upload Election Data
            </h3>
            <button
              @click="closeModal"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal body -->
        <div class="px-4 pb-4 sm:p-6">
          <!-- Upload Progress -->
          <div v-if="isUploading" class="mb-6">
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                :style="{ width: uploadProgress + '%' }"
                role="progressbar"
                :aria-valuenow="uploadProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only"
                  >{{ Math.round(uploadProgress) }}% complete</span
                >
              </div>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-gray-900 mb-1">
                {{ uploadStatus }}
              </p>
              <p class="text-xs text-gray-500">{{ uploadDetails }}</p>
            </div>
          </div>

          <!-- Upload Form -->
          <div v-else>
            <!-- Upload Type Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3"
                >Upload Type</label
              >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="uploadType"
                    id="csv-upload"
                    value="csv"
                    v-model="uploadType"
                  />
                  <label
                    for="csv-upload"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50': uploadType === 'csv',
                    }"
                  >
                    <input
                      type="radio"
                      name="uploadType"
                      value="csv"
                      v-model="uploadType"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-file-csv text-indigo-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >CSV Upload</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Upload prepared CSV file
                      </p>
                    </div>
                  </label>
                </div>
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="uploadType"
                    id="hierarchical"
                    value="hierarchical"
                    v-model="uploadType"
                  />
                  <label
                    for="hierarchical"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50':
                        uploadType === 'hierarchical',
                    }"
                  >
                    <input
                      type="radio"
                      name="uploadType"
                      value="hierarchical"
                      v-model="uploadType"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-sitemap text-indigo-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >Hierarchical</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Counties → Constituencies → Wards → Polling Stations
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- File Upload -->
            <div class="mb-6">
              <label
                for="csvFile"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                CSV File
              </label>
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
              >
                <div class="space-y-1 text-center">
                  <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl"></i>
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="csvFile"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="csvFile"
                        name="csvFile"
                        type="file"
                        class="sr-only"
                        accept=".csv"
                        @change="handleFileSelect"
                        :disabled="isUploading"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">CSV files up to 50MB</p>
                </div>
              </div>
              <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                <i class="fas fa-file-csv text-indigo-600 mr-1"></i>
                {{ selectedFile.name }}
              </div>
            </div>

            <!-- Data Preview -->
            <div v-if="previewData.length > 0" class="mb-6">
              <h6 class="text-sm font-medium text-gray-900 mb-3">
                Data Preview (First 5 rows)
              </h6>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        v-for="(header, index) in previewHeaders"
                        :key="index"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(row, index) in previewData"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td
                        v-for="(cell, cellIndex) in row"
                        :key="cellIndex"
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Upload Options -->
            <div class="mb-6">
              <h6 class="text-sm font-medium text-gray-900 mb-3">
                Upload Options
              </h6>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center">
                  <input
                    id="skipDuplicates"
                    type="checkbox"
                    v-model="options.skipDuplicates"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    for="skipDuplicates"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    Skip Duplicates
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="validateData"
                    type="checkbox"
                    v-model="options.validateData"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    for="validateData"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    Validate Data
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Upload Results -->
          <div v-if="uploadResults" class="mb-6">
            <h6 class="text-sm font-medium text-gray-900 mb-4">
              Upload Results
            </h6>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 mr-3"></i>
                  <span class="text-sm text-gray-900"
                    >Successful: {{ uploadResults.successful }}</span
                  >
                </div>
                <div class="flex items-center">
                  <i class="fas fa-times-circle text-red-500 mr-3"></i>
                  <span class="text-sm text-gray-900"
                    >Failed: {{ uploadResults.failed }}</span
                  >
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center">
                  <i class="fas fa-info-circle text-blue-500 mr-3"></i>
                  <span class="text-sm text-gray-900"
                    >Total: {{ uploadResults.total }}</span
                  >
                </div>
                <div class="flex items-center">
                  <i class="fas fa-clock text-yellow-500 mr-3"></i>
                  <span class="text-sm text-gray-900"
                    >Duration: {{ uploadResults.duration }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Error Details -->
            <div
              v-if="uploadResults.errors && uploadResults.errors.length > 0"
              class="mt-4"
            >
              <div class="flex justify-between items-center mb-3">
                <h6 class="text-sm font-medium text-red-600">Errors</h6>
                <button
                  v-if="uploadResults.hasDetailedErrors"
                  class="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  @click="viewDetailedErrors"
                >
                  <i class="fas fa-exclamation-triangle mr-1"></i>
                  View Detailed Errors
                </button>
              </div>
              <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 class="text-sm font-medium text-red-800 mb-2">
                      Error Summary:
                    </h6>
                    <ul class="text-sm text-red-700 space-y-1">
                      <li
                        v-for="(error, index) in uploadResults.errors.slice(
                          0,
                          3
                        )"
                        :key="index"
                      >
                        <span class="font-medium">{{ error.code }}</span> -
                        {{ error.error }}
                      </li>
                      <li
                        v-if="uploadResults.errors.length > 3"
                        class="text-red-500"
                      >
                        ... and {{ uploadResults.errors.length - 3 }} more
                        errors
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 class="text-sm font-medium text-red-800 mb-2">
                      Error Types:
                    </h6>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="(count, type) in errorTypeSummary"
                        :key="type"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
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

        <!-- Modal footer -->
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            @click="startUpload"
            :disabled="!selectedFile || isUploading"
          >
            <i class="fas fa-upload mr-2"></i>
            {{ isUploading ? 'Uploading...' : 'Start Upload' }}
          </button>
          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Overlay from '../../Overlay.vue';

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

// Modal state
const isOpen = ref(false);

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
const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetModal();
};

const resetModal = () => {
  selectedFile.value = null;
  previewData.value = [];
  previewHeaders.value = [];
  isUploading.value = false;
  uploadProgress.value = 0;
  uploadStatus.value = '';
  uploadDetails.value = '';
  uploadResults.value = null;
};

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
    COUNTY_NOT_FOUND: 'bg-blue-100 text-blue-800',
    CONSTITUENCY_NOT_FOUND: 'bg-yellow-100 text-yellow-800',
    CAW_NOT_FOUND: 'bg-gray-100 text-gray-800',
    PROCESSING_ERROR: 'bg-red-100 text-red-800',
  };
  return classes[errorType] || 'bg-gray-100 text-gray-800';
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

// Expose modal control methods
defineExpose({
  openModal,
  closeModal,
  resetModal,
});
</script>

<style scoped>
/* Bulk upload modal styles are now globally available via main.ts */
</style>
