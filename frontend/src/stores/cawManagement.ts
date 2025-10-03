import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  cawService,
  type CAW,
  type CAWsParams,
  type CreateCAWData,
  type UpdateCAWData,
} from '@/services/cawService';

export const useCAWManagementStore = defineStore('cawManagement', () => {
  // State
  const caws = ref<CAW[]>([]);
  const currentCAW = ref<CAW | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const searchQuery = ref('');
  const sortBy = ref('createdAt');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const selectedConstituencyId = ref<string | null>(null);
  const selectedCountyId = ref<string | null>(null);

  // Computed
  const filteredCAWs = computed(() => caws.value);
  const hasCAWs = computed(() => caws.value.length > 0);
  const totalCAWs = computed(() => pagination.value.total);

  // Actions
  const fetchCAWs = async (params: CAWsParams = {}) => {
    try {
      loading.value = true;
      error.value = null;

      const queryParams = {
        page: params.page || pagination.value.page,
        limit: params.limit || pagination.value.limit,
        search: params.search !== undefined ? params.search : searchQuery.value,
        sortBy: params.sortBy || sortBy.value,
        sortOrder: params.sortOrder || sortOrder.value,
        constituencyId: params.constituencyId || selectedConstituencyId.value,
        countyId: params.countyId || selectedCountyId.value,
      };

      const response = await cawService.getCAWs(queryParams);

      if (response.success) {
        caws.value = response.data.caws;
        pagination.value = {
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          totalPages: response.data.pagination.pages,
        };
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch CAWs';
      console.error('Error fetching CAWs:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchCAWById = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await cawService.getCAWById(id);

      if (response.success) {
        currentCAW.value = response.data.caw;
        return response.data.caw;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch CAW';
      console.error('Error fetching CAW:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCAW = async (data: CreateCAWData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await cawService.createCAW(data);

      if (response.success) {
        // Refresh the list
        await fetchCAWs();
        return response.data.caw;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create CAW';
      console.error('Error creating CAW:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCAW = async (id: string, data: UpdateCAWData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await cawService.updateCAW(id, data);

      if (response.success) {
        // Update the CAW in the list
        const index = caws.value.findIndex((caw) => caw.id === id);
        if (index !== -1) {
          caws.value[index] = response.data.caw;
        }

        // Update current CAW if it's the same
        if (currentCAW.value?.id === id) {
          currentCAW.value = response.data.caw;
        }

        return response.data.caw;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update CAW';
      console.error('Error updating CAW:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCAW = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await cawService.deleteCAW(id);

      if (response.success) {
        // Remove CAW from the list
        caws.value = caws.value.filter((caw) => caw.id !== id);

        // Clear current CAW if it's the same
        if (currentCAW.value?.id === id) {
          currentCAW.value = null;
        }

        // Update pagination
        pagination.value.total -= 1;

        return true;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete CAW';
      console.error('Error deleting CAW:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchCAWs = (query: string) => {
    searchQuery.value = query;
    pagination.value.page = 1; // Reset to first page
    return fetchCAWs();
  };

  const filterByConstituency = (constituencyId: string | null) => {
    selectedConstituencyId.value = constituencyId;
    pagination.value.page = 1; // Reset to first page
    return fetchCAWs();
  };

  const filterByCounty = (countyId: string | null) => {
    selectedCountyId.value = countyId;
    pagination.value.page = 1; // Reset to first page
    return fetchCAWs();
  };

  const sortCAWs = (field: string, order: 'asc' | 'desc') => {
    sortBy.value = field;
    sortOrder.value = order;
    pagination.value.page = 1; // Reset to first page
    return fetchCAWs();
  };

  const changePage = (page: number) => {
    pagination.value.page = page;
    return fetchCAWs();
  };

  const changePageSize = (limit: number) => {
    pagination.value.limit = limit;
    pagination.value.page = 1; // Reset to first page
    return fetchCAWs();
  };

  const clearFilters = async () => {
    searchQuery.value = '';
    selectedConstituencyId.value = null;
    selectedCountyId.value = null;
    sortBy.value = 'createdAt';
    sortOrder.value = 'desc';
    pagination.value.page = 1;
    await fetchCAWs();
  };

  const clearError = () => {
    error.value = null;
  };

  const clearCurrentCAW = () => {
    currentCAW.value = null;
  };

  return {
    // State
    caws,
    currentCAW,
    loading,
    error,
    pagination,
    searchQuery,
    sortBy,
    sortOrder,
    selectedConstituencyId,
    selectedCountyId,

    // Computed
    filteredCAWs,
    hasCAWs,
    totalCAWs,

    // Actions
    fetchCAWs,
    fetchCAWById,
    createCAW,
    updateCAW,
    deleteCAW,
    searchCAWs,
    filterByConstituency,
    filterByCounty,
    sortCAWs,
    changePage,
    changePageSize,
    clearFilters,
    clearError,
    clearCurrentCAW,
  };
});
