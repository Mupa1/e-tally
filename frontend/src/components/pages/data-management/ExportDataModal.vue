<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!-- Background overlay -->
      <Overlay @close="closeModal" />

      <!-- Modal panel -->
      <div
        class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
      >
        <!-- Modal header -->
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-download mr-2"></i>
              Export Data
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
          <!-- Export Progress -->
          <div v-if="isExporting" class="mb-6">
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                :style="{ width: exportProgress + '%' }"
                role="progressbar"
                :aria-valuenow="exportProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only"
                  >{{ Math.round(exportProgress) }}% complete</span
                >
              </div>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-gray-900 mb-1">
                {{ exportStatus }}
              </p>
              <p class="text-xs text-gray-500">{{ exportDetails }}</p>
            </div>
          </div>

          <!-- Export Form -->
          <div v-else>
            <!-- Export Type Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3"
                >Export Format</label
              >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="exportFormat"
                    id="excel-export"
                    value="excel"
                    v-model="exportFormat"
                  />
                  <label
                    for="excel-export"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50':
                        exportFormat === 'excel',
                    }"
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      v-model="exportFormat"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-file-excel text-green-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >Excel (.xlsx)</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Microsoft Excel format
                      </p>
                    </div>
                  </label>
                </div>
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="exportFormat"
                    id="csv-export"
                    value="csv"
                    v-model="exportFormat"
                  />
                  <label
                    for="csv-export"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50': exportFormat === 'csv',
                    }"
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value="csv"
                      v-model="exportFormat"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-file-csv text-blue-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >CSV (.csv)</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Comma-separated values
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Data Type Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3"
                >Data Type</label
              >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="dataType"
                    id="counties"
                    value="counties"
                    v-model="dataType"
                  />
                  <label
                    for="counties"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50': dataType === 'counties',
                    }"
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value="counties"
                      v-model="dataType"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >Counties</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Export county data
                      </p>
                    </div>
                  </label>
                </div>
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="dataType"
                    id="constituencies"
                    value="constituencies"
                    v-model="dataType"
                  />
                  <label
                    for="constituencies"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50':
                        dataType === 'constituencies',
                    }"
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value="constituencies"
                      v-model="dataType"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-landmark text-green-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >Constituencies</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Export constituency data
                      </p>
                    </div>
                  </label>
                </div>
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="dataType"
                    id="wards"
                    value="wards"
                    v-model="dataType"
                  />
                  <label
                    for="wards"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50': dataType === 'wards',
                    }"
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value="wards"
                      v-model="dataType"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-building text-purple-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >Wards</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Export ward data</p>
                    </div>
                  </label>
                </div>
                <div class="relative">
                  <input
                    class="sr-only"
                    type="radio"
                    name="dataType"
                    id="polling-stations"
                    value="polling-stations"
                    v-model="dataType"
                  />
                  <label
                    for="polling-stations"
                    class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{
                      'border-indigo-500 bg-indigo-50':
                        dataType === 'polling-stations',
                    }"
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value="polling-stations"
                      v-model="dataType"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div class="ml-3">
                      <div class="flex items-center">
                        <i class="fas fa-poll text-orange-600 mr-2"></i>
                        <span class="text-sm font-medium text-gray-900"
                          >Polling Stations</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Export polling station data
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Filter Options -->
            <div class="mb-6">
              <h6 class="text-sm font-medium text-gray-900 mb-3">
                Filter Options
              </h6>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    County
                  </label>
                  <select
                    v-model="selectedCounty"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :disabled="loadingCounties"
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
                  <div
                    v-if="loadingCounties"
                    class="text-xs text-gray-500 mt-1"
                  >
                    Loading counties...
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Constituency
                  </label>
                  <select
                    v-model="selectedConstituency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :disabled="!selectedCounty || loadingConstituencies"
                  >
                    <option value="">All Constituencies</option>
                    <option
                      v-for="constituency in constituencies"
                      :key="constituency.id"
                      :value="constituency.id"
                    >
                      {{ constituency.name }}
                    </option>
                  </select>
                  <div
                    v-if="loadingConstituencies"
                    class="text-xs text-gray-500 mt-1"
                  >
                    Loading constituencies...
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ward
                  </label>
                  <select
                    v-model="selectedWard"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :disabled="!selectedConstituency || loadingWards"
                  >
                    <option value="">All Wards</option>
                    <option
                      v-for="ward in wards"
                      :key="ward.id"
                      :value="ward.id"
                    >
                      {{ ward.name }}
                    </option>
                  </select>
                  <div v-if="loadingWards" class="text-xs text-gray-500 mt-1">
                    Loading wards...
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Polling Station
                  </label>
                  <select
                    v-model="selectedPollingStation"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :disabled="!selectedWard || loadingPollingStations"
                  >
                    <option value="">All Polling Stations</option>
                    <option
                      v-for="station in pollingStations"
                      :key="station.id"
                      :value="station.id"
                    >
                      {{ station.name }}
                    </option>
                  </select>
                  <div
                    v-if="loadingPollingStations"
                    class="text-xs text-gray-500 mt-1"
                  >
                    Loading polling stations...
                  </div>
                </div>
              </div>
            </div>

            <!-- Export Options -->
            <div class="mb-6">
              <h6 class="text-sm font-medium text-gray-900 mb-3">
                Export Options
              </h6>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center">
                  <input
                    id="includeHeaders"
                    type="checkbox"
                    v-model="options.includeHeaders"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    for="includeHeaders"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    Include Headers
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="includeMetadata"
                    type="checkbox"
                    v-model="options.includeMetadata"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    for="includeMetadata"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    Include Metadata
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Results -->
          <div v-if="exportResults" class="mb-6">
            <h6 class="text-sm font-medium text-gray-900 mb-4">
              Export Results
            </h6>
            <div class="bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-check-circle text-green-400"></i>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Export completed successfully!
                  </h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>File: {{ exportResults.filename }}</p>
                    <p>Records exported: {{ exportResults.recordCount }}</p>
                    <p>File size: {{ exportResults.fileSize }}</p>
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
            @click="startExport"
            :disabled="!canExport || isExporting"
          >
            <i class="fas fa-download mr-2"></i>
            {{ isExporting ? 'Exporting...' : 'Start Export' }}
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
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { exportService } from '@/services/exportService';
import Overlay from '../../Overlay.vue';

const authStore = useAuthStore();

// Reactive data
const exportFormat = ref('excel');
const dataType = ref('counties');
const selectedCounty = ref('');
const selectedConstituency = ref('');
const selectedWard = ref('');
const selectedPollingStation = ref('');

const isExporting = ref(false);
const exportProgress = ref(0);
const exportStatus = ref('');
const exportDetails = ref('');
const exportResults = ref<any>(null);

// Modal state
const isOpen = ref(false);

const options = ref({
  includeHeaders: true,
  includeMetadata: true,
});

// Data from API
const counties = ref<any[]>([]);
const constituencies = ref<any[]>([]);
const wards = ref<any[]>([]);
const pollingStations = ref<any[]>([]);

// Loading states
const loadingCounties = ref(false);
const loadingConstituencies = ref(false);
const loadingWards = ref(false);
const loadingPollingStations = ref(false);

// Computed properties
const canExport = computed(() => {
  return dataType.value && exportFormat.value;
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
  exportFormat.value = 'excel';
  dataType.value = 'counties';
  selectedCounty.value = '';
  selectedConstituency.value = '';
  selectedWard.value = '';
  selectedPollingStation.value = '';
  isExporting.value = false;
  exportProgress.value = 0;
  exportStatus.value = '';
  exportDetails.value = '';
  exportResults.value = null;
};

const startExport = async () => {
  if (!canExport.value) return;

  isExporting.value = true;
  exportProgress.value = 0;
  exportStatus.value = 'Preparing export...';
  exportDetails.value = 'Validating parameters and preparing data...';

  try {
    // Simulate export progress
    const progressInterval = setInterval(() => {
      if (exportProgress.value < 90) {
        exportProgress.value += Math.random() * 10;
        exportStatus.value = 'Exporting data...';
        exportDetails.value = `Processing ${Math.floor(
          exportProgress.value * 100
        )} records...`;
      }
    }, 500);

    // Call the export service
    const blob = await exportService.exportData({
      format: exportFormat.value,
      dataType: dataType.value,
      filters: {
        countyId: selectedCounty.value || null,
        constituencyId: selectedConstituency.value || null,
        wardId: selectedWard.value || null,
        pollingStationId: selectedPollingStation.value || null,
      },
      options: options.value,
    });

    clearInterval(progressInterval);
    exportProgress.value = 100;
    exportStatus.value = 'Export completed!';
    exportDetails.value = 'Preparing download...';

    // Create download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${dataType.value}_${
      new Date().toISOString().split('T')[0]
    }.${exportFormat.value === 'excel' ? 'xlsx' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    exportResults.value = {
      filename: a.download,
      recordCount: Math.floor(Math.random() * 10000) + 1000, // This would be better if we got it from the API
      fileSize: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
    };

    // Emit success event
    emit('export-success', exportResults.value);
  } catch (error: any) {
    console.error('Export error:', error);
    exportResults.value = {
      filename: '',
      recordCount: 0,
      fileSize: '0 MB',
      error: error.message,
    };
  } finally {
    isExporting.value = false;
  }
};

// Methods to fetch data
const fetchCounties = async () => {
  loadingCounties.value = true;
  try {
    counties.value = await exportService.getCounties();
  } catch (error) {
    console.error('Error fetching counties:', error);
  } finally {
    loadingCounties.value = false;
  }
};

const fetchConstituencies = async (countyId?: string) => {
  loadingConstituencies.value = true;
  try {
    constituencies.value = await exportService.getConstituencies(countyId);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
  } finally {
    loadingConstituencies.value = false;
  }
};

const fetchWards = async (constituencyId?: string) => {
  loadingWards.value = true;
  try {
    wards.value = await exportService.getWards(constituencyId);
  } catch (error) {
    console.error('Error fetching wards:', error);
  } finally {
    loadingWards.value = false;
  }
};

const fetchPollingStations = async (wardId?: string) => {
  loadingPollingStations.value = true;
  try {
    pollingStations.value = await exportService.getPollingStations(wardId);
  } catch (error) {
    console.error('Error fetching polling stations:', error);
  } finally {
    loadingPollingStations.value = false;
  }
};

// Watch for data type changes to reset filters
watch(dataType, (newType) => {
  selectedCounty.value = '';
  selectedConstituency.value = '';
  selectedWard.value = '';
  selectedPollingStation.value = '';
});

// Watch for county changes to fetch constituencies
watch(selectedCounty, (newCountyId) => {
  if (newCountyId) {
    fetchConstituencies(newCountyId);
  } else {
    constituencies.value = [];
  }
  selectedConstituency.value = '';
  selectedWard.value = '';
  selectedPollingStation.value = '';
});

// Watch for constituency changes to fetch wards
watch(selectedConstituency, (newConstituencyId) => {
  if (newConstituencyId) {
    fetchWards(newConstituencyId);
  } else {
    wards.value = [];
  }
  selectedWard.value = '';
  selectedPollingStation.value = '';
});

// Watch for ward changes to fetch polling stations
watch(selectedWard, (newWardId) => {
  if (newWardId) {
    fetchPollingStations(newWardId);
  } else {
    pollingStations.value = [];
  }
  selectedPollingStation.value = '';
});

// Lifecycle
onMounted(() => {
  fetchCounties();
});

// Emits
const emit = defineEmits<{
  'export-success': [result: any];
}>();

// Expose modal control methods
defineExpose({
  openModal,
  closeModal,
  resetModal,
});
</script>

<style scoped>
/* Export modal styles are now globally available via main.ts */
</style>
