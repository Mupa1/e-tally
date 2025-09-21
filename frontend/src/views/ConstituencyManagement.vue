<template>
  <MainLayout
    page-title="Constituency Management"
    page-subtitle="Manage constituencies efficiently with optimized performance"
  >
    <!-- Error Alert -->
    <div
      v-if="constituencyManagementStore.error"
      class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-600 mr-3"></i>
        <span class="text-red-800 font-medium">{{
          constituencyManagementStore.error
        }}</span>
        <button
          type="button"
          @click="constituencyManagementStore.clearError()"
          class="ml-auto text-red-400 hover:text-red-600 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-landmark text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">
              Total Constituencies
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ constituencyManagementStore.totalConstituencies }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-building text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Wards</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ constituencyManagementStore.stats?.byCAW?.length || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-poll text-purple-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Polling Stations</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{
                constituencyManagementStore.stats?.voterStats?._sum
                  ?.registeredVoters || 0
              }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-users text-orange-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Avg Voters</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{
                Math.round(
                  constituencyManagementStore.stats?.voterStats?._avg
                    ?.registeredVoters || 0
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div class="p-6">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Search</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                class="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Search constituencies..."
                v-model="searchQuery"
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- County Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >County</label
            >
            <FormSelect
              v-model="selectedCountyId"
              :options="countyOptions"
              placeholder="All Counties"
              @update:model-value="handleCountyFilter"
              button-class="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>

          <!-- Page Size -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Show</label
            >
            <FormSelect
              v-model="pageSizeOption"
              :options="pageSizeOptions"
              @update:model-value="handlePageSizeChange"
              button-class="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="constituencyManagementStore.toggleCursorPagination()"
              :class="[
                'inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200',
                constituencyManagementStore.useCursorPagination
                  ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              ]"
            >
              <i class="fas fa-arrows-alt mr-2"></i>
              {{
                constituencyManagementStore.useCursorPagination
                  ? 'Cursor'
                  : 'Page'
              }}
            </button>
            <button
              @click="showCreateModal = true"
              :disabled="constituencyManagementStore.loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <i class="fas fa-plus mr-2"></i>
              Add Constituency
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Constituencies Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-landmark mr-2 text-indigo-600"></i>
            Constituencies
            <span
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {{ constituencyManagementStore.totalConstituencies }}
            </span>
          </h3>
          <button
            @click="refreshData"
            :disabled="constituencyManagementStore.loading"
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <i
              class="fas fa-sync-alt mr-2"
              :class="{ 'fa-spin': constituencyManagementStore.loading }"
            ></i>
            Refresh
          </button>
        </div>
      </div>

      <div v-if="constituencyManagementStore.loading" class="text-center p-8">
        <div
          class="inline-flex items-center justify-center w-8 h-8 text-indigo-600"
        >
          <i class="fas fa-spinner fa-spin text-2xl"></i>
        </div>
        <p class="mt-2 text-gray-600">Loading constituencies...</p>
      </div>

      <div
        v-else-if="!constituencyManagementStore.hasConstituencies"
        class="text-center p-8"
      >
        <i class="fas fa-landmark fa-3x text-gray-300 mb-4"></i>
        <h4 class="text-lg font-medium text-gray-900 mb-2">
          No constituencies found
        </h4>
        <p class="text-gray-600 mb-4">
          Get started by adding your first constituency.
        </p>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <i class="fas fa-plus mr-2"></i>
          Add Constituency
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
                @click="handleSort('county.name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                County
                <i class="fas fa-sort ml-1" v-if="sortBy !== 'county.name'"></i>
                <i
                  class="fas fa-sort-up ml-1"
                  v-else-if="sortOrder === 'asc'"
                ></i>
                <i class="fas fa-sort-down ml-1" v-else></i>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Wards
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Polling Stations
              </th>
              <th
                @click="handleSort('createdAt')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                Created
                <i class="fas fa-sort ml-1" v-if="sortBy !== 'createdAt'"></i>
                <i
                  class="fas fa-sort-up ml-1"
                  v-else-if="sortOrder === 'asc'"
                ></i>
                <i class="fas fa-sort-down ml-1" v-else></i>
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
              v-for="constituency in constituencyManagementStore.filteredConstituencies"
              :key="constituency.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ constituency.code }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ constituency.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <div class="font-medium">{{ constituency.county.code }}</div>
                  <div class="text-gray-500">
                    {{ constituency.county.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ constituency._count?.caws || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {{ constituency._count?.pollingStations || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(constituency.createdAt) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewConstituency(constituency)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    @click="editConstituency(constituency)"
                    class="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                    title="Edit Constituency"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deleteConstituency(constituency)"
                    :title="
                      (constituency._count?.caws ?? 0) > 0
                        ? 'Cannot delete - has wards'
                        : 'Delete Constituency'
                    "
                    :disabled="(constituency._count?.caws ?? 0) > 0"
                    class="text-red-600 hover:text-red-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="
          constituencyManagementStore.pagination.totalPages > 1 ||
          constituencyManagementStore.pagination.hasNextPage
        "
        class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="
                changePage(constituencyManagementStore.pagination.page - 1)
              "
              :disabled="constituencyManagementStore.pagination.page === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="
                changePage(constituencyManagementStore.pagination.page + 1)
              "
              :disabled="
                constituencyManagementStore.pagination.page ===
                constituencyManagementStore.pagination.totalPages
              "
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
                  (constituencyManagementStore.pagination.page - 1) *
                    constituencyManagementStore.pagination.limit +
                  1
                }}</span>
                to
                <span class="font-medium">{{
                  Math.min(
                    constituencyManagementStore.pagination.page *
                      constituencyManagementStore.pagination.limit,
                    constituencyManagementStore.pagination.total
                  )
                }}</span>
                of
                <span class="font-medium">{{
                  constituencyManagementStore.pagination.total
                }}</span>
                results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="
                    changePage(constituencyManagementStore.pagination.page - 1)
                  "
                  :disabled="constituencyManagementStore.pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200',
                    page === constituencyManagementStore.pagination.page
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="
                    changePage(constituencyManagementStore.pagination.page + 1)
                  "
                  :disabled="
                    constituencyManagementStore.pagination.page ===
                    constituencyManagementStore.pagination.totalPages
                  "
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Constituency Modal -->
    <CreateConstituencyModal
      :is-open="showCreateModal"
      :loading="constituencyManagementStore.loading"
      @close="showCreateModal = false"
      @submit="handleCreateConstituency"
    />

    <!-- Edit Constituency Modal -->
    <EditConstituencyModal
      :is-open="showEditModal"
      :constituency="selectedConstituency"
      :loading="constituencyManagementStore.loading"
      @close="showEditModal = false"
      @submit="handleUpdateConstituency"
    />

    <!-- View Constituency Modal -->
    <ViewConstituencyModal
      :is-open="showViewModal"
      :constituency="selectedConstituency"
      @close="showViewModal = false"
      @edit="editConstituency"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useConstituencyManagementStore } from '@/stores/constituencyManagement';
import { useCountyManagementStore } from '@/stores/countyManagement';
import type { Constituency } from '@/services/constituencyService';
import type { SelectOption } from '@/components/select/Select.vue';
import MainLayout from '@/components/MainLayout.vue';
import FormSelect from '@/components/select/FormSelect.vue';
import CreateConstituencyModal from '@/components/pages/constituencies/CreateConstituencyModal.vue';
import EditConstituencyModal from '@/components/pages/constituencies/EditConstituencyModal.vue';
import ViewConstituencyModal from '@/components/pages/constituencies/ViewConstituencyModal.vue';

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
const selectedCountyId = ref<SelectOption | null>(null);

// Form options
const pageSizeOptions = [
  { id: 10, value: 10, label: '10 per page' },
  { id: 20, value: 20, label: '20 per page' },
  { id: 50, value: 50, label: '50 per page' },
  { id: 100, value: 100, label: '100 per page' },
];

const pageSizeOption = ref(pageSizeOptions[0]);

// Computed
const user = computed(() => authStore.user);
const counties = computed(() => countyManagementStore.counties);

const countyOptions = computed(() => [
  { id: '', value: '', label: 'All Counties' },
  ...counties.value.map((county) => ({
    id: county.id,
    value: county.id,
    label: `${county.name} (${county.code})`,
  })),
]);

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
  constituencyManagementStore.setSelectedCounty(
    selectedCountyId.value?.value || null
  );
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
  constituencyManagementStore.changePageSize(pageSizeOption.value?.value || 10);
};

const refreshData = async () => {
  await Promise.all([
    constituencyManagementStore.fetchConstituencies(),
    constituencyManagementStore.fetchConstituencyStats(
      selectedCountyId.value?.value || undefined
    ),
  ]);
};

const viewConstituency = (constituency: Constituency) => {
  selectedConstituency.value = constituency;
  showViewModal.value = true;
};

const editConstituency = (constituency: Constituency) => {
  selectedConstituency.value = constituency;
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

const handleCreateConstituency = async (data: any) => {
  try {
    await constituencyManagementStore.createConstituency(data);
    showCreateModal.value = false;
  } catch (error) {
    // Error is handled by the store
  }
};

const handleUpdateConstituency = async (data: any) => {
  if (!selectedConstituency.value) return;

  try {
    await constituencyManagementStore.updateConstituency(
      selectedConstituency.value.id,
      data
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
  // Fetch constituencies and stats
  await refreshData();
});

// Watch for search query changes
watch(searchQuery, () => {
  const timeoutId = setTimeout(() => {
    handleSearch();
  }, 500);

  return () => clearTimeout(timeoutId);
});

// Watch for page size changes
watch(pageSizeOption, (newOption) => {
  if (newOption) {
    handlePageSizeChange();
  }
});
</script>
