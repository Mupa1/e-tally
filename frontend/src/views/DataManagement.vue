<template>
  <MainLayout
    page-title="Data Management"
    page-subtitle="Manage and view system data and information"
  >
    <!-- Error Alert -->
    <div v-if="statsStore.error" class="mb-6">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-400"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error loading statistics
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ statsStore.error }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <StatisticsGrid
      title="Data Management"
      :columns="5"
      gap="lg"
      padding="none"
      class="mb-6"
    >
      <StatisticsCardCompact
        name="Total Counties"
        :value="totalCounties"
        format="number"
        icon="fas fa-map-marker-alt"
        color="blue"
        :loading="statsStore.loading"
      />
      <StatisticsCardCompact
        name="Total Constituencies"
        :value="totalConstituencies"
        format="number"
        icon="fas fa-landmark"
        color="green"
        :loading="statsStore.loading"
      />
      <StatisticsCardCompact
        name="Total Wards"
        :value="totalWards"
        format="number"
        icon="fas fa-building"
        color="purple"
        :loading="statsStore.loading"
      />
      <StatisticsCardCompact
        name="Total Polling Stations"
        :value="totalPollingStations"
        format="number"
        icon="fas fa-poll"
        color="orange"
        :loading="statsStore.loading"
      />
      <StatisticsCardCompact
        name="Total Registered Voters"
        :value="totalRegisteredVoters"
        format="number"
        icon="fas fa-users"
        color="pink"
        :loading="statsStore.loading"
      />
    </StatisticsGrid>

    <!-- Data Upload Tools -->
    <div class="mb-6">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-upload mr-2"></i>
            Data Upload Tools
          </h5>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button class="btn-primary w-full" @click="openBulkUpload">
              <i class="fas fa-upload mr-2"></i>
              Upload Polling Station Data
            </button>
            <button class="btn-success w-full" @click="exportData">
              <i class="fas fa-download mr-2"></i>
              Export Data
            </button>
            <button class="btn-warning w-full" @click="validateData">
              <i class="fas fa-check-circle mr-2"></i>
              Validate Data
            </button>
            <button class="btn-info w-full" @click="refreshData">
              <i class="fas fa-sync-alt mr-2"></i>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Upload Modal -->
    <BulkUploadModal
      ref="bulkUploadModalRef"
      @upload-success="handleUploadSuccess"
    />

    <!-- Export Data Modal -->
    <ExportDataModal
      ref="exportDataModalRef"
      @export-success="handleExportSuccess"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/components/MainLayout.vue';
import {
  StatisticsGrid,
  StatisticsCardCompact,
} from '@/components/statistics-card';
import BulkUploadModal from '@/components/pages/election-hirarchy/BulkUploadModal.vue';
import ExportDataModal from '@/components/pages/data-management/ExportDataModal.vue';
import { useStatsStore } from '@/stores/stats';

// Store
const statsStore = useStatsStore();

// Reactive data
const loading = ref(false);

const bulkUploadModalRef = ref<InstanceType<typeof BulkUploadModal> | null>(
  null
);

const exportDataModalRef = ref<InstanceType<typeof ExportDataModal> | null>(
  null
);

// Computed properties for statistics
const totalRegisteredVoters = computed(
  () => statsStore.hierarchyStats?.totalRegisteredVoters || 0
);
const totalCounties = computed(
  () => statsStore.hierarchyStats?.totalCounties || 0
);
const totalConstituencies = computed(
  () => statsStore.hierarchyStats?.totalConstituencies || 0
);
const totalWards = computed(() => statsStore.hierarchyStats?.totalWards || 0);
const totalPollingStations = computed(
  () => statsStore.hierarchyStats?.totalPollingStations || 0
);

// Methods
const refreshData = async () => {
  loading.value = true;
  try {
    // Fetch hierarchy statistics
    await statsStore.fetchHierarchyStats();
    console.log('Data refreshed successfully');
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    loading.value = false;
  }
};

const openBulkUpload = () => {
  // Open the bulk upload modal
  if (bulkUploadModalRef.value) {
    bulkUploadModalRef.value.openModal();
  }
};

const handleUploadSuccess = (result: any) => {
  console.log('Upload successful:', result);
  // Refresh stats after successful upload
  refreshData();

  // Show success notification
  const message = result.data
    ? `Upload completed successfully! Created ${
        result.data.pollingStations?.created || 0
      } polling stations, ${result.data.wards?.created || 0} wards, ${
        result.data.constituencies?.created || 0
      } constituencies, and ${result.data.counties?.created || 0} counties.`
    : 'Upload completed successfully!';

  alert(message);
};

const exportData = () => {
  // Open the export data modal
  if (exportDataModalRef.value) {
    exportDataModalRef.value.openModal();
  }
};

const handleExportSuccess = (result: any) => {
  console.log('Export successful:', result);
  // Show success notification
  alert(
    `Export completed successfully! Downloaded ${result.filename} with ${result.recordCount} records.`
  );
};

const validateData = () => {
  // TODO: Implement data validation functionality
  console.log('Validate data');
  alert(
    'Validation functionality will be implemented to check data integrity.'
  );
};

// Lifecycle
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0.75rem 0.75rem 0 0 !important;
  padding: 1rem 1.5rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
