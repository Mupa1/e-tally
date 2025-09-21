<template>
  <MainLayout
    page-title="County Management"
    page-subtitle="Manage counties and their information"
  >
    <!-- Error Alert -->
    <div
      v-if="countyManagementStore.error"
      class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-600 mr-3"></i>
        <span class="text-red-800 font-medium">{{
          countyManagementStore.error
        }}</span>
        <button
          type="button"
          @click="countyManagementStore.clearError()"
          class="ml-auto text-red-400 hover:text-red-600 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="flex flex-col">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Search Counties
            </label>
            <div class="relative flex-1">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                class="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Search counties..."
                v-model="searchQuery"
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- Page Size -->
          <div class="flex flex-col">
            <div class="space-y-0">
              <FormSelect
                v-model="pageSizeOption"
                :options="pageSizeOptions"
                label="Show"
                placeholder="Select page size"
                button-class="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                @change="handlePageSizeChange"
              />
            </div>
          </div>

          <!-- Empty space for alignment -->
          <div></div>

          <!-- Add Button -->
          <div class="flex flex-col">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              &nbsp;
            </label>
            <button
              class="w-full h-12 inline-flex items-center justify-center px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              @click="showCreateModal = true"
              :disabled="countyManagementStore.loading"
            >
              <i class="fas fa-plus mr-2"></i>
              Add County
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Counties Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- Table Header -->
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h5 class="text-lg font-semibold text-gray-900 mb-0">
          <i class="fas fa-map-marker-alt mr-2 text-indigo-600"></i>
          Counties
          <span
            class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            {{ countyManagementStore.totalCounties }}
          </span>
        </h5>
      </div>

      <!-- Table Content -->
      <div class="p-0">
        <!-- Loading State -->
        <div v-if="countyManagementStore.loading" class="text-center p-8">
          <div
            class="inline-flex items-center justify-center w-8 h-8 text-indigo-600"
          >
            <i class="fas fa-spinner fa-spin text-2xl"></i>
          </div>
          <p class="mt-2 text-gray-600">Loading counties...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!countyManagementStore.hasCounties"
          class="text-center p-8"
        >
          <i class="fas fa-map-marker-alt text-6xl text-gray-300 mb-4"></i>
          <h5 class="text-lg font-semibold text-gray-900 mb-2">
            No counties found
          </h5>
          <p class="text-gray-600 mb-4">
            Get started by adding your first county.
          </p>
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            @click="showCreateModal = true"
          >
            <i class="fas fa-plus mr-2"></i>
            Add County
          </button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  @click="handleSort('code')"
                  class="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                  <div class="flex items-center">
                    Code
                    <i class="fas fa-sort ml-1" v-if="sortBy !== 'code'"></i>
                    <i
                      class="fas fa-sort-up ml-1"
                      v-else-if="sortOrder === 'asc'"
                    ></i>
                    <i class="fas fa-sort-down ml-1" v-else></i>
                  </div>
                </th>
                <th
                  @click="handleSort('name')"
                  class="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                  <div class="flex items-center">
                    Name
                    <i class="fas fa-sort ml-1" v-if="sortBy !== 'name'"></i>
                    <i
                      class="fas fa-sort-up ml-1"
                      v-else-if="sortOrder === 'asc'"
                    ></i>
                    <i class="fas fa-sort-down ml-1" v-else></i>
                  </div>
                </th>
                <th
                  class="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Constituencies
                </th>
                <th
                  class="px-1 py-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="county in countyManagementStore.filteredCounties"
                :key="county.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-1 py-1 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ county.code }}
                  </span>
                </td>
                <td class="px-1 py-1 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ county.name }}
                  </div>
                </td>
                <td class="px-1 py-1 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ county._count?.constituencies ?? 0 }}
                  </span>
                </td>
                <td
                  class="px-1 py-1 whitespace-nowrap text-right text-sm font-medium"
                >
                  <div class="flex items-center justify-end">
                    <button
                      class="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                      @click="viewCounty(county)"
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
      </div>

      <!-- Pagination -->
      <div
        v-if="countyManagementStore.pagination.totalPages > 1"
        class="bg-gray-50 px-6 py-4 border-t border-gray-200"
      >
        <nav aria-label="Counties pagination">
          <div class="flex items-center justify-center space-x-2">
            <button
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              @click="changePage(countyManagementStore.pagination.page - 1)"
              :disabled="countyManagementStore.pagination.page === 1"
            >
              Previous
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="{
                'bg-indigo-600 text-white hover:bg-indigo-700':
                  page === countyManagementStore.pagination.page,
                'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50':
                  page !== countyManagementStore.pagination.page,
              }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>

            <button
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              @click="changePage(countyManagementStore.pagination.page + 1)"
              :disabled="
                countyManagementStore.pagination.page ===
                countyManagementStore.pagination.totalPages
              "
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Create County Modal -->
    <CreateCountyModal
      :is-open="showCreateModal"
      :loading="countyManagementStore.loading"
      @close="showCreateModal = false"
      @submit="handleCreateCounty"
    />

    <!-- Edit County Modal -->
    <EditCountyModal
      :is-open="showEditModal"
      :county="selectedCounty"
      :loading="countyManagementStore.loading"
      @close="showEditModal = false"
      @submit="handleUpdateCounty"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCountyManagementStore } from '@/stores/countyManagement';
import type { County } from '@/services/countyService';
import MainLayout from '@/components/MainLayout.vue';
import CreateCountyModal from '@/components/pages/counties/CreateCountyModal.vue';
import EditCountyModal from '@/components/pages/counties/EditCountyModal.vue';
import { FormSelect } from '@/components/select';

const router = useRouter();
const authStore = useAuthStore();
const countyManagementStore = useCountyManagementStore();

// State
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedCounty = ref<County | null>(null);
const searchQuery = ref('');
const sortBy = ref('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');
const pageSize = ref(10);

// Page size options for FormSelect
const pageSizeOptions = [
  { value: '10', label: '10 per page' },
  { value: '20', label: '20 per page' },
  { value: '50', label: '50 per page' },
];

// Page size option for FormSelect
const pageSizeOption = ref('10');

// Forms - now handled by modal components

// Computed
const user = computed(() => authStore.user);

const visiblePages = computed(() => {
  const current = countyManagementStore.pagination.page;
  const total = countyManagementStore.pagination.totalPages;
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
  countyManagementStore.setSearchQuery(searchQuery.value);
  countyManagementStore.fetchCounties({ page: 1 });
};

const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }

  countyManagementStore.setSorting(sortBy.value, sortOrder.value);
  countyManagementStore.fetchCounties({ page: 1 });
};

const changePage = (page: number) => {
  countyManagementStore.changePage(page);
};

const handlePageSizeChange = (value: string) => {
  pageSize.value = Number(value);
  countyManagementStore.changePageSize(Number(value));
};

const viewCounty = (county: County) => {
  router.push(`/counties/${county.id}`);
};

const editCounty = (county: County) => {
  selectedCounty.value = county;
  showEditModal.value = true;
};

const deleteCounty = async (county: County) => {
  const constituencyCount = county._count?.constituencies ?? 0;
  let confirmMessage = `Are you sure you want to delete ${county.name}?`;

  if (constituencyCount > 0) {
    confirmMessage += `\n\n⚠️ This county has ${constituencyCount} constituency(ies) associated with it. Deleting this county will not be possible until all constituencies are removed first.`;
  }

  if (confirm(confirmMessage)) {
    try {
      await countyManagementStore.deleteCounty(county.id);
    } catch (error) {
      // Error is handled by the store
    }
  }
};

const handleCreateCounty = async (data: { code: string; name: string }) => {
  try {
    await countyManagementStore.createCounty(data);
    showCreateModal.value = false;
  } catch (error) {
    // Error is handled by the store
  }
};

const handleUpdateCounty = async (data: { code: string; name: string }) => {
  if (!selectedCounty.value) return;

  try {
    await countyManagementStore.updateCounty(selectedCounty.value.id, data);
    showEditModal.value = false;
    selectedCounty.value = null;
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
onMounted(() => {
  countyManagementStore.fetchCounties();
});

// Watch for search query changes
watch(searchQuery, () => {
  const timeoutId = setTimeout(() => {
    handleSearch();
  }, 500);

  return () => clearTimeout(timeoutId);
});

// Watch for page size changes
watch(pageSize, (newValue) => {
  pageSizeOption.value = newValue.toString();
});

// Initialize page size option
watch(
  () => countyManagementStore.pagination.limit,
  (newLimit) => {
    pageSize.value = newLimit;
    pageSizeOption.value = newLimit.toString();
  },
  { immediate: true }
);
</script>
