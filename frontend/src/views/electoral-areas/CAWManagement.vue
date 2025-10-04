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
        </div>
      </div>
    </div>

    <!-- CAWs Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-building mr-2 text-indigo-600"></i>
            CAWs
            <span
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {{ pagination.total }}
            </span>
          </h3>
          <button
            @click="refreshCAWs"
            :disabled="cawManagementStore.loading"
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <i
              class="fas fa-sync-alt mr-2"
              :class="{ 'fa-spin': cawManagementStore.loading }"
            ></i>
            Refresh
          </button>
        </div>
      </div>

      <div v-if="cawManagementStore.loading" class="text-center p-8">
        <div
          class="inline-flex items-center justify-center w-8 h-8 text-indigo-600"
        >
          <i class="fas fa-spinner fa-spin text-2xl"></i>
        </div>
        <p class="mt-2 text-gray-600">Loading CAWs...</p>
      </div>

      <div v-else-if="!cawManagementStore.hasCAWs" class="text-center p-8">
        <i class="fas fa-building fa-3x text-gray-300 mb-4"></i>
        <h4 class="text-lg font-medium text-gray-900 mb-2">No CAWs found</h4>
        <p class="text-gray-600 mb-4">Get started by adding your first CAW.</p>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <i class="fas fa-plus mr-2"></i>
          Add CAW
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                @click="handleSort('code')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                Code
                <i class="fas fa-sort ml-1" v-if="sortBy !== 'code'"></i>
                <i
                  class="fas fa-sort-up ml-1"
                  v-else-if="sortOrder === 'asc'"
                ></i>
                <i class="fas fa-sort-down ml-1" v-else></i>
              </th>
              <th
                @click="handleSort('name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                Name
                <i class="fas fa-sort ml-1" v-if="sortBy !== 'name'"></i>
                <i
                  class="fas fa-sort-up ml-1"
                  v-else-if="sortOrder === 'asc'"
                ></i>
                <i class="fas fa-sort-down ml-1" v-else></i>
              </th>
              <th
                @click="handleSort('constituency.county.name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                County
                <i
                  class="fas fa-sort ml-1"
                  v-if="sortBy !== 'constituency.county.name'"
                ></i>
                <i
                  class="fas fa-sort-up ml-1"
                  v-else-if="sortOrder === 'asc'"
                ></i>
                <i class="fas fa-sort-down ml-1" v-else></i>
              </th>
              <th
                @click="handleSort('constituency.name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                Constituency
                <i
                  class="fas fa-sort ml-1"
                  v-if="sortBy !== 'constituency.name'"
                ></i>
                <i
                  class="fas fa-sort-up ml-1"
                  v-else-if="sortOrder === 'asc'"
                ></i>
                <i class="fas fa-sort-down ml-1" v-else></i>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Polling Stations
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="caw in caws"
              :key="caw.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ caw.code }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ caw.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <div class="font-medium">
                    {{ caw.constituency?.county?.code }}
                  </div>
                  <div class="text-gray-500">
                    {{ caw.constituency?.county?.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <div class="font-medium">{{ caw.constituency?.code }}</div>
                  <div class="text-gray-500">
                    {{ caw.constituency?.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {{ caw._count?.pollingStations || 0 }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end">
                  <button
                    @click="viewCAW(caw)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{
                  (pagination.page - 1) * pagination.limit + 1
                }}</span>
                to
                <span class="font-medium">{{
                  Math.min(pagination.page * pagination.limit, pagination.total)
                }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page === '...'"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                    disabled
                  >
                    ...
                  </button>
                  <button
                    v-else
                    @click="changePage(page as number)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === pagination.page
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page === pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import SearchableSelect from '@/components/select/SearchableSelect.vue';
import CountyFilter from '@/components/filters/CountyFilter.vue';
import ConstituencyFilter from '@/components/filters/ConstituencyFilter.vue';
import { type SelectOption } from '@/components/select';

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
const constituencies = computed(
  () => constituencyManagementStore.filteredConstituencies
);
const pagination = computed(() => cawManagementStore.pagination);

// Sorting state
const sortBy = ref('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');

// Pagination helpers
const visiblePages = computed(() => {
  const current = pagination.value.page;
  const total = pagination.value.totalPages;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total);
  } else {
    rangeWithDots.push(total);
  }

  return rangeWithDots.filter(
    (page, index, arr) => arr.indexOf(page) === index
  );
});

// Options for FormSelect components

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    searchTerm.value.trim() !== '' ||
    selectedCountyOption.value !== null ||
    selectedConstituencyOption.value !== null
  );
});

// Methods
const refreshCAWs = async () => {
  await cawManagementStore.fetchCAWs();
};

const handleSearch = () => {
  cawManagementStore.searchCAWs(searchTerm.value);
};

const handleCountyFilterChange = async (countyId: string | null) => {
  // Find the county option to update the v-model
  if (countyId) {
    const county = countyManagementStore.counties.find(
      (c) => c.id === countyId
    );
    selectedCountyOption.value = county
      ? {
          id: county.id,
          value: county.id,
          label: `${county.name} (${county.code})`,
        }
      : null;
  } else {
    selectedCountyOption.value = null;
  }

  selectedConstituencyOption.value = null; // Reset constituency when county changes

  // Set selected county and fetch constituencies
  constituencyManagementStore.setSelectedCounty(countyId);
  await constituencyManagementStore.fetchConstituencies();

  // Clear constituency filter and apply county filter
  cawManagementStore.filterByConstituency(null);
  await cawManagementStore.filterByCounty(countyId);
};

const handleConstituencyFilterChange = (constituencyId: string | null) => {
  // Find the constituency option to update the v-model
  if (constituencyId) {
    const constituency = constituencyManagementStore.constituencies.find(
      (c) => c.id === constituencyId
    );
    selectedConstituencyOption.value = constituency
      ? {
          id: constituency.id,
          value: constituency.id,
          label: `${constituency.name} (${constituency.code})`,
        }
      : null;
  } else {
    selectedConstituencyOption.value = null;
  }

  cawManagementStore.filterByConstituency(constituencyId);
};

const clearFilters = () => {
  searchTerm.value = '';
  selectedCountyOption.value = null;
  selectedConstituencyOption.value = null;
  constituencyManagementStore.setSelectedCounty(null);
  cawManagementStore.clearFilters();
};

const changePageSize = (limit: number) => {
  cawManagementStore.changePageSize(limit);
};

const changePage = (page: number) => {
  cawManagementStore.changePage(page);
};

const handleCAWAction = (action: string, caw: any, index: number) => {
  if (action === 'view') {
    viewCAW(caw);
  }
};

const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
  cawManagementStore.sortCAWs(field, sortOrder.value);
};

// Pagination methods are now handled by SimpleTable component

const viewCAW = (caw: any) => {
  router.push(`/caws/${caw.id}`);
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
