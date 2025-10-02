<template>
  <MainLayout
    page-title="Data Management"
    page-subtitle="Manage and view system data and information"
  >
    <!-- Error Alert -->
    <ErrorAlert
      :show="!!statsStore.error"
      :message="statsStore.error || ''"
      @dismiss="statsStore.clearError"
    />

    <!-- Success Alert -->
    <SuccessAlert
      :show="showSuccessAlert"
      :message="successMessage"
      @dismiss="handleSuccessAlertDismiss"
    />

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
            <Button
              text="Upload Polling Station Data"
              variant="primary"
              size="md"
              icon="fas fa-upload"
              icon-position="left"
              class="w-full"
              @click="openBulkUpload"
            />
            <Button
              text="Export Data"
              variant="success"
              size="md"
              icon="fas fa-download"
              icon-position="left"
              class="w-full"
              @click="exportData"
            />
            <Button
              text="Validate Data"
              variant="warning"
              size="md"
              icon="fas fa-check-circle"
              icon-position="left"
              class="w-full"
              @click="validateData"
            />
            <Button
              text="Refresh Data"
              variant="info"
              size="md"
              icon="fas fa-sync-alt"
              icon-position="left"
              class="w-full"
              @click="refreshData"
            />
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
import SuccessAlert from '@/components/SuccessAlert.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import Button from '@/components/Button.vue';
import { useStatsStore } from '@/stores/stats';

// Store
const statsStore = useStatsStore();

// Reactive data
const loading = ref(false);
const showSuccessAlert = ref(false);
const successMessage = ref('');

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
  successMessage.value = result.data
    ? `Upload completed successfully! Created ${
        result.data.pollingStations?.created || 0
      } polling stations, ${result.data.caws?.created || 0} wards, ${
        result.data.constituencies?.created || 0
      } constituencies, and ${result.data.counties?.created || 0} counties.`
    : 'Upload completed successfully!';

  showSuccessAlert.value = true;
};

const handleSuccessAlertDismiss = () => {
  showSuccessAlert.value = false;
  successMessage.value = '';
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
