<template>
  <MainLayout
    page-title="Polling Station Management"
    page-subtitle="Manage Polling Stations and their information"
  >
    <!-- Error Alert -->
    <ErrorAlert
      :show="!!pollingStationManagementStore.error"
      :message="pollingStationManagementStore.error || ''"
      @dismiss="pollingStationManagementStore.clearError()"
    />

    <!-- Filters and Search -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 relative"
    >
      <!-- Clear Button -->
      <ClearButton :show="hasActiveFilters" @click="clearFilters" />

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchInput
            v-model="searchTerm"
            label="Search Polling Stations"
            placeholder="Search by name, code, or address..."
            @input="handleSearch"
          />
          <CountyFilter
            v-model="selectedCountyOption"
            label="Filter by County"
            placeholder="Select county..."
            @change="handleCountyFilterChange"
          />
          <ConstituencyFilter
            v-model="selectedConstituencyOption"
            label="Filter by Constituency"
            placeholder="Select constituency..."
            :disabled="!selectedCountyOption"
            :county-id="selectedCountyOption?.value || null"
            @change="handleConstituencyFilterChange"
          />
          <CAWFilter
            v-model="selectedCawOption"
            label="Filter by CAW"
            placeholder="Select CAW..."
            :disabled="!selectedConstituencyOption"
            :constituency-id="selectedConstituencyOption?.value || null"
            @change="handleCawFilterChange"
          />
        </div>
      </div>
    </div>

    <!-- Polling Stations Table -->
    <SimpleTable
      :data="pollingStations"
      :columns="tableColumns"
      :loading="pollingStationManagementStore.loading"
      :pagination="pagination"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @sort="handleSort"
      @page-change="changePage"
      @page-size-change="changePageSize"
      empty-state-title="No polling stations found"
      empty-state-description="No polling stations match your current filters."
      empty-state-icon="fas fa-poll"
    >
      <template #actions="{ item, index }">
        <a
          href="#"
          class="text-indigo-600 hover:text-indigo-900"
          @click.prevent="viewPollingStation(item)"
        >
          View
          <span class="sr-only">, {{ item.name }}</span>
        </a>
      </template>
    </SimpleTable>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePollingStationManagementStore } from '@/stores/pollingStationManagement';
import { useCountyManagementStore } from '@/stores/countyManagement';
import { useConstituencyManagementStore } from '@/stores/constituencyManagement';
import { useCAWManagementStore } from '@/stores/cawManagement';
import MainLayout from '@/components/MainLayout.vue';
import { ErrorAlert, ClearButton } from '@/components';
import SearchInput from '@/components/SearchInput.vue';
import CountyFilter from '@/components/filters/CountyFilter.vue';
import ConstituencyFilter from '@/components/filters/ConstituencyFilter.vue';
import CAWFilter from '@/components/filters/CAWFilter.vue';
import SimpleTable from '@/components/table/SimpleTable.vue';
import type { SimpleTableColumn } from '@/components/table/SimpleTable.vue';
import { type SelectOption } from '@/components/select';

const router = useRouter();
const authStore = useAuthStore();
const pollingStationManagementStore = usePollingStationManagementStore();
const countyManagementStore = useCountyManagementStore();
const constituencyManagementStore = useConstituencyManagementStore();
const cawManagementStore = useCAWManagementStore();

// Reactive data
const searchTerm = ref('');
const selectedCountyOption = ref<SelectOption | null>(null);
const selectedConstituencyOption = ref<SelectOption | null>(null);
const selectedCawOption = ref<SelectOption | null>(null);

// Computed properties
const user = computed(() => authStore.user);
const pollingStations = computed(() => {
  return pollingStationManagementStore.filteredPollingStations.map(
    (station) => ({
      ...station,
      'constituency.county.name': station.constituency?.county?.name || '',
      'constituency.name': station.constituency?.name || '',
      'caw.name': station.caw?.name || '',
      registeredVoters: station.totalRegisteredVoters || 0,
    })
  );
});
const pagination = computed(() => pollingStationManagementStore.pagination);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return !!(
    searchTerm.value ||
    selectedCountyOption.value ||
    selectedConstituencyOption.value ||
    selectedCawOption.value
  );
});

// Sorting state
const sortBy = ref('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');

// Table columns configuration
const tableColumns: SimpleTableColumn[] = [
  {
    key: 'code',
    label: 'Code',
    sortable: true,
    width: 'w-20',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    width: 'w-48',
  },
  {
    key: 'constituency.county.name',
    label: 'County',
    sortable: true,
    width: 'w-32',
  },
  {
    key: 'constituency.name',
    label: 'Constituency',
    sortable: true,
    width: 'w-40',
  },
  {
    key: 'caw.name',
    label: 'CAW',
    sortable: true,
    width: 'w-32',
  },
  {
    key: 'registeredVoters',
    label: 'Registered Voters',
    sortable: false,
    width: 'w-32',
  },
];

// Methods
const handleSearch = () => {
  pollingStationManagementStore.searchPollingStations(searchTerm.value);
};

const handleCountyFilterChange = async (countyId: string | null) => {
  // Reset dependent filters when county changes
  selectedConstituencyOption.value = null;
  selectedCawOption.value = null;

  // Set selected county and fetch constituencies
  constituencyManagementStore.setSelectedCounty(countyId);
  await constituencyManagementStore.fetchConstituencies();

  // Clear dependent filters and apply county filter
  pollingStationManagementStore.filterByConstituency(null);
  pollingStationManagementStore.filterByCaw(null);
  await pollingStationManagementStore.filterByCounty(countyId);
};

const handleConstituencyFilterChange = async (
  constituencyId: string | null
) => {
  // Reset CAW filter when constituency changes
  selectedCawOption.value = null;

  // Set selected constituency and fetch CAWs
  cawManagementStore.selectedConstituencyId = constituencyId;
  await cawManagementStore.fetchCAWs();

  // Clear CAW filter and apply constituency filter
  pollingStationManagementStore.filterByCaw(null);
  await pollingStationManagementStore.filterByConstituency(constituencyId);
};

const handleCawFilterChange = (cawId: string | null) => {
  pollingStationManagementStore.filterByCaw(cawId);
};

const clearFilters = async () => {
  searchTerm.value = '';
  selectedCountyOption.value = null;
  selectedConstituencyOption.value = null;
  selectedCawOption.value = null;
  await pollingStationManagementStore.clearFilters();
};

const changePage = (page: number) => {
  pollingStationManagementStore.changePage(page);
};

const changePageSize = (pageSize: number) => {
  pollingStationManagementStore.changePageSize(pageSize);
};

const handleSort = (field: string, order: 'asc' | 'desc') => {
  sortBy.value = field;
  sortOrder.value = order;
  pollingStationManagementStore.sortPollingStations(field, order);
};

const viewPollingStation = (pollingStation: any) => {
  router.push(`/pollingstations/${pollingStation.id}`);
};

// Lifecycle
onMounted(async () => {
  // Fetch initial data
  await Promise.all([
    pollingStationManagementStore.fetchPollingStations(),
    countyManagementStore.fetchCounties(),
    constituencyManagementStore.fetchConstituencies(),
    cawManagementStore.fetchCAWs(),
  ]);
});
</script>
