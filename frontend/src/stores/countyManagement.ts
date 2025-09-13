import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  countyService,
  type County,
  type CountiesParams,
  type CreateCountyData,
  type UpdateCountyData,
} from '@/services/countyService';

export const useCountyManagementStore = defineStore('countyManagement', () => {
  // State
  const counties = ref<County[]>([]);
  const currentCounty = ref<County | null>(null);
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

  // Computed
  const filteredCounties = computed(() => counties.value);
  const hasCounties = computed(() => counties.value.length > 0);
  const totalCounties = computed(() => pagination.value.total);

  // Actions
  const fetchCounties = async (params: CountiesParams = {}) => {
    try {
      loading.value = true;
      error.value = null;

      const queryParams = {
        page: params.page || pagination.value.page,
        limit: params.limit || pagination.value.limit,
        search: params.search !== undefined ? params.search : searchQuery.value,
        sortBy: params.sortBy || sortBy.value,
        sortOrder: params.sortOrder || sortOrder.value,
      };

      const response = await countyService.getCounties(queryParams);

      if (response.success) {
        counties.value = response.data.counties;
        pagination.value = response.data.pagination;
      } else {
        throw new Error('Failed to fetch counties');
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch counties';
      console.error('Error fetching counties:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchCounty = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await countyService.getCounty(id);

      if (response.success) {
        currentCounty.value = response.data.county;
        return response.data.county;
      } else {
        throw new Error('Failed to fetch county');
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch county';
      console.error('Error fetching county:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCounty = async (data: CreateCountyData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await countyService.createCounty(data);

      if (response.success) {
        // Refresh the counties list
        await fetchCounties();
        return response.data.county;
      } else {
        throw new Error('Failed to create county');
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to create county';
      console.error('Error creating county:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCounty = async (id: string, data: UpdateCountyData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await countyService.updateCounty(id, data);

      if (response.success) {
        // Update the county in the list
        const index = counties.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          counties.value[index] = response.data.county;
        }

        // Update current county if it's the same
        if (currentCounty.value?.id === id) {
          currentCounty.value = response.data.county;
        }

        return response.data.county;
      } else {
        throw new Error('Failed to update county');
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update county';
      console.error('Error updating county:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCounty = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await countyService.deleteCounty(id);

      if (response.success) {
        // Remove county from the list
        counties.value = counties.value.filter((c) => c.id !== id);

        // Clear current county if it's the same
        if (currentCounty.value?.id === id) {
          currentCounty.value = null;
        }

        // Update pagination
        pagination.value.total -= 1;

        return true;
      } else {
        throw new Error('Failed to delete county');
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete county';
      console.error('Error deleting county:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const setSorting = (field: string, order: 'asc' | 'desc') => {
    sortBy.value = field;
    sortOrder.value = order;
  };

  const changePage = (page: number) => {
    pagination.value.page = page;
    fetchCounties({ page });
  };

  const clearError = () => {
    error.value = null;
  };

  const resetState = () => {
    counties.value = [];
    currentCounty.value = null;
    loading.value = false;
    error.value = null;
    pagination.value = {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
    searchQuery.value = '';
    sortBy.value = 'createdAt';
    sortOrder.value = 'desc';
  };

  return {
    // State
    counties,
    currentCounty,
    loading,
    error,
    pagination,
    searchQuery,
    sortBy,
    sortOrder,

    // Computed
    filteredCounties,
    hasCounties,
    totalCounties,

    // Actions
    fetchCounties,
    fetchCounty,
    createCounty,
    updateCounty,
    deleteCounty,
    setSearchQuery,
    setSorting,
    changePage,
    clearError,
    resetState,
  };
});
