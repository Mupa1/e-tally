<template>
  <MainLayout
    page-title="County Management"
    page-subtitle="Manage counties and their information"
  >
    <!-- Error Alert -->
    <ErrorAlert
      :show="!!countyManagementStore.error"
      :message="countyManagementStore.error || ''"
      @dismiss="countyManagementStore.clearError()"
    />

    <!-- Action Buttons -->
    <div class="flex justify-end mb-6">
      <div class="flex space-x-3">
        <Button
          v-if="user?.role === 'SUPER_ADMIN'"
          text="Add County"
          icon="fas fa-plus"
          icon-position="left"
          variant="secondary"
          size="md"
          :disabled="countyManagementStore.loading"
          @click="showCreateModal = true"
        />
        <Button
          text="Refresh"
          icon="fas fa-sync-alt"
          icon-position="left"
          variant="secondary"
          size="md"
          :disabled="countyManagementStore.loading"
          :loading="countyManagementStore.loading"
          loading-text="Refreshing..."
          @click="refreshCounties"
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
            v-model="searchQuery"
            label="Search Counties"
            placeholder="Search by name or code..."
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Counties Table -->
    <SimpleTable
      :data="countyManagementStore.filteredCounties"
      :columns="tableColumns"
      :loading="countyManagementStore.loading"
      :pagination="countyManagementStore.pagination"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :empty-message="'No counties found. Get started by adding your first county.'"
      @action="handleTableAction"
      @sort="handleSort"
      @page-change="changePage"
      @page-size-change="changePageSize"
    >
      <!-- Custom Code Cell -->
      <template #cell-code="{ value }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {{ value }}
        </span>
      </template>

      <!-- Custom Name Cell -->
      <template #cell-name="{ value }">
        <div class="text-sm font-semibold text-gray-900">
          {{ value }}
        </div>
      </template>

      <!-- Custom Constituencies Cell -->
      <template #cell-_count.constituencies="{ value }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ value || 0 }}
        </span>
      </template>

      <!-- Custom Actions -->
      <template #actions="{ item }">
        <div class="flex space-x-1">
          <button
            class="text-indigo-600 hover:text-indigo-900 p-1"
            @click="viewCounty(item)"
            title="View County"
          >
            <i class="fas fa-eye text-sm"></i>
          </button>
        </div>
      </template>

      <!-- Custom Empty State -->
      <template #empty-state>
        <i class="fas fa-map-marker-alt text-6xl text-gray-300 mb-4"></i>
        <h5 class="text-lg font-semibold text-gray-900 mb-2">
          No counties found
        </h5>
        <p class="text-gray-600 mb-4">
          <span v-if="user?.role === 'SUPER_ADMIN'"
            >Get started by adding your first county.</span
          >
          <span v-else>No counties are available at the moment.</span>
        </p>
        <button
          v-if="user?.role === 'SUPER_ADMIN'"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          @click="showCreateModal = true"
        >
          <i class="fas fa-plus mr-2"></i>
          Add County
        </button>
      </template>
    </SimpleTable>

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
import SimpleTable from '@/components/table/SimpleTable.vue';
import type { SimpleTableColumn } from '@/components/table/SimpleTable.vue';
import { SearchInput, ClearButton, ErrorAlert, Button } from '@/components';

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

// Table columns configuration
const tableColumns: SimpleTableColumn[] = [
  {
    key: 'code',
    label: 'Code',
    sortable: true,
    width: '20',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    width: '30',
  },
  {
    key: '_count.constituencies',
    label: 'Constituencies',
    sortable: false,
    width: '20',
  },
];

// Forms - now handled by modal components

// Computed
const user = computed(() => authStore.user);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '';
});

// Methods
const refreshCounties = async () => {
  await countyManagementStore.fetchCounties();
};

const handleSearch = () => {
  countyManagementStore.setSearchQuery(searchQuery.value);
  countyManagementStore.fetchCounties({ page: 1 });
};

const clearFilters = async () => {
  searchQuery.value = '';
  countyManagementStore.setSearchQuery('');
  await countyManagementStore.fetchCounties({ page: 1 });
};

const changePageSize = (pageSize: number) => {
  countyManagementStore.changePageSize(pageSize);
};

const handleSort = (field: string, order: 'asc' | 'desc') => {
  sortBy.value = field;
  sortOrder.value = order;

  countyManagementStore.setSorting(sortBy.value, sortOrder.value);
  countyManagementStore.fetchCounties({ page: 1 });
};

const handleTableAction = (action: string, item: County, index: number) => {
  switch (action) {
    case 'view':
      viewCounty(item);
      break;
    case 'edit':
      editCounty(item);
      break;
    case 'delete':
      deleteCounty(item);
      break;
  }
};

const changePage = (page: number) => {
  countyManagementStore.changePage(page);
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
onMounted(async () => {
  await refreshCounties();
});

// Watch for search query changes
watch(searchQuery, () => {
  const timeoutId = setTimeout(() => {
    handleSearch();
  }, 500);

  return () => clearTimeout(timeoutId);
});
</script>
