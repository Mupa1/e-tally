<template>
  <MainLayout
    page-title="County Assembly Wards Management"
    page-subtitle="Manage County Assembly Wards and their information"
  >
    <!-- Error Alert -->
    <ErrorAlert
      :show="!!cawManagementStore.error"
      :message="cawManagementStore.error || ''"
      @dismiss="cawManagementStore.clearError()"
    />

    <!-- Action Buttons -->
    <div class="flex justify-end mb-6">
      <div class="flex space-x-3">
        <Button
          v-if="user?.role === 'SUPER_ADMIN'"
          text="Add CAW"
          icon="fas fa-plus"
          icon-position="left"
          variant="secondary"
          size="md"
          :disabled="cawManagementStore.loading"
          @click="showCreateModal = true"
        />
        <Button
          text="Refresh"
          icon="fas fa-sync-alt"
          icon-position="left"
          variant="secondary"
          size="md"
          :disabled="cawManagementStore.loading"
          :loading="cawManagementStore.loading"
          loading-text="Refreshing..."
          @click="refreshCAWs"
        />
      </div>
    </div>

    <!-- Filters and Search -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 relative"
    >
      <!-- Clear Button -->
      <ClearButton :show="hasActiveFilters" @click="clearFilters" />

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchInput
            v-model="searchTerm"
            label="Search CAWs"
            placeholder="Search by name or code..."
            @input="handleSearch"
          />
          <FormSelect
            v-model="selectedCountyOption"
            :options="countyOptions"
            label="Filter by County"
            placeholder="All Counties"
            @change="handleCountyFilterChange"
          />
          <FormSelect
            v-model="selectedConstituencyOption"
            :options="constituencyOptions"
            label="Filter by Constituency"
            placeholder="All Constituencies"
            @change="handleConstituencyFilterChange"
          />
        </div>
      </div>
    </div>

    <!-- CAWs Table -->
    <SimpleTable
      :data="caws"
      :columns="tableColumns"
      :pagination="tablePagination"
      :loading="cawManagementStore.loading"
      title="CAWs"
      :subtitle="`${pagination.total} CAWs found`"
      @action="handleCAWAction"
      @page-change="changePage"
    >
      <!-- Header Actions -->
      <template #header-actions>
        <PageSizeSelector
          :current-page-size="pagination.limit"
          @page-size-change="changePageSize"
        />
      </template>
    </SimpleTable>

    <!-- Bulk Actions removed - SimpleTable handles actions through individual row actions -->
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCAWManagementStore } from '@/stores/cawManagement';
import { useCountyManagementStore } from '@/stores/countyManagement';
import { useConstituencyManagementStore } from '@/stores/constituencyManagement';
import MainLayout from '@/components/MainLayout.vue';
import {
  ErrorAlert,
  Button,
  SearchInput,
  FormSelect,
  ClearButton,
  PageSizeSelector,
} from '@/components';
import { type SelectOption } from '@/components/select';
import SimpleTable from '@/components/table/SimpleTable.vue';
import type {
  SimpleTableColumn,
  SimpleTablePagination,
} from '@/components/table/SimpleTable.vue';

const router = useRouter();
const authStore = useAuthStore();
const cawManagementStore = useCAWManagementStore();
const countyManagementStore = useCountyManagementStore();
const constituencyManagementStore = useConstituencyManagementStore();

// Reactive data
const showCreateModal = ref(false);
const searchTerm = ref('');
const selectedCountyOption = ref<SelectOption | null>(null);
const selectedConstituencyOption = ref<SelectOption | null>(null);

// Computed properties
const user = computed(() => authStore.user);
const caws = computed(() => cawManagementStore.filteredCAWs);
const counties = computed(() => countyManagementStore.filteredCounties);
const constituencies = computed(
  () => constituencyManagementStore.filteredConstituencies
);
const pagination = computed(() => cawManagementStore.pagination);

const canEditCAW = computed(() => {
  return (
    user.value?.role === 'SUPER_ADMIN' ||
    user.value?.role === 'COUNTY_LEVEL_SUPERVISOR'
  );
});

const canDeleteCAW = computed(() => {
  return user.value?.role === 'SUPER_ADMIN';
});

const filteredConstituencies = computed(() => {
  if (!selectedCountyOption.value?.value) return constituencies.value;
  return constituencies.value.filter(
    (c) => c.countyId === selectedCountyOption.value?.value
  );
});

// Options for FormSelect components
const countyOptions = computed<SelectOption[]>(() => [
  { id: '', label: 'All Counties' },
  ...counties.value.map((county) => ({
    id: county.id,
    label: county.name,
    value: county.id,
  })),
]);

const constituencyOptions = computed<SelectOption[]>(() => [
  { id: '', label: 'All Constituencies' },
  ...filteredConstituencies.value.map((constituency) => ({
    id: constituency.id,
    label: constituency.name,
    value: constituency.id,
  })),
]);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    searchTerm.value.trim() !== '' ||
    selectedCountyOption.value !== null ||
    selectedConstituencyOption.value !== null
  );
});

// Table columns configuration
const tableColumns: SimpleTableColumn[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'code',
    label: 'Code',
    sortable: true,
  },
  {
    key: 'constituency.county.name',
    label: 'County',
    sortable: true,
    formatter: (value: any, item: any) =>
      item.constituency?.county?.name || 'N/A',
  },
  {
    key: 'constituency.name',
    label: 'Constituency',
    sortable: true,
    formatter: (value: any, item: any) => item.constituency?.name || 'N/A',
  },
  {
    key: '_count.pollingStations',
    label: 'Polling Stations',
    sortable: true,
    formatter: (value: any, item: any) => item._count?.pollingStations || 0,
  },
];

// Table pagination for SimpleTable
const tablePagination = computed<SimpleTablePagination>(() => ({
  page: pagination.value.page,
  limit: pagination.value.limit,
  total: pagination.value.total,
  totalPages: pagination.value.totalPages,
}));

// Methods
const refreshCAWs = async () => {
  await cawManagementStore.fetchCAWs();
};

const handleSearch = () => {
  cawManagementStore.searchCAWs(searchTerm.value);
};

const handleCountyFilterChange = async (option: SelectOption | null) => {
  selectedCountyOption.value = option;
  selectedConstituencyOption.value = null; // Reset constituency when county changes

  // Set selected county and fetch constituencies
  constituencyManagementStore.setSelectedCounty(option?.value || null);
  await constituencyManagementStore.fetchConstituencies();
};

const handleConstituencyFilterChange = (option: SelectOption | null) => {
  selectedConstituencyOption.value = option;
  cawManagementStore.filterByConstituency(option?.value || null);
};

const clearFilters = () => {
  searchTerm.value = '';
  selectedCountyOption.value = null;
  selectedConstituencyOption.value = null;
  cawManagementStore.clearFilters();
};

const changePageSize = (limit: number) => {
  cawManagementStore.changePageSize(limit);
};

const changePage = (page: number) => {
  cawManagementStore.changePage(page);
};

const handleCAWAction = (action: string, caw: any, index: number) => {
  switch (action) {
    case 'view':
      viewCAW(caw);
      break;
    case 'edit':
      editCAW(caw);
      break;
    case 'delete':
      deleteCAW(caw);
      break;
  }
};

// Pagination methods are now handled by SimpleTable component

const viewCAW = (caw: any) => {
  router.push(`/caws/${caw.id}`);
};

const editCAW = (caw: any) => {
  router.push(`/caws/${caw.id}/edit`);
};

const deleteCAW = async (caw: any) => {
  if (confirm(`Are you sure you want to delete ${caw.name}?`)) {
    try {
      await cawManagementStore.deleteCAW(caw.id);
    } catch (error) {
      console.error('Error deleting CAW:', error);
    }
  }
};

// Bulk selection methods removed - SimpleTable handles individual actions

// Lifecycle
onMounted(async () => {
  // Fetch initial data
  await Promise.all([
    cawManagementStore.fetchCAWs(),
    countyManagementStore.fetchCounties(),
    constituencyManagementStore.fetchConstituencies(),
  ]);
});
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
