import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  constituencyService,
  type Constituency,
  type ConstituenciesParams,
  type CreateConstituencyData,
  type UpdateConstituencyData,
  type ConstituencyStats,
  type BulkUpdateData,
  type BulkUpdateResponse,
} from '@/services/constituencyService';

export const useConstituencyManagementStore = defineStore(
  'constituencyManagement',
  () => {
    // State
    const constituencies = ref<Constituency[]>([]);
    const currentConstituency = ref<Constituency | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      nextCursor: null as string | null,
    });
    const searchQuery = ref('');
    const sortBy = ref('createdAt');
    const sortOrder = ref<'asc' | 'desc'>('desc');
    const selectedCountyId = ref<string | null>(null);
    const stats = ref<ConstituencyStats | null>(null);
    const useCursorPagination = ref(false);

    // Computed
    const filteredConstituencies = computed(() => constituencies.value);
    const hasConstituencies = computed(() => constituencies.value.length > 0);
    const totalConstituencies = computed(() => pagination.value.total);

    // Actions
    const fetchConstituencies = async (params: ConstituenciesParams = {}) => {
      try {
        loading.value = true;
        error.value = null;

        const queryParams = {
          page: params.page || pagination.value.page,
          limit: params.limit || pagination.value.limit,
          search:
            params.search !== undefined ? params.search : searchQuery.value,
          sortBy: params.sortBy || sortBy.value,
          sortOrder: params.sortOrder || sortOrder.value,
          countyId:
            params.countyId !== undefined
              ? params.countyId
              : selectedCountyId.value,
          forceRefresh: params.forceRefresh,
        };

        const response = await constituencyService.getConstituencies(
          queryParams
        );

        if (response.success) {
          constituencies.value = response.data.constituencies;
          pagination.value = response.data.pagination;
        } else {
          throw new Error('Failed to fetch constituencies');
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch constituencies';
        console.error('Error fetching constituencies:', err);
      } finally {
        loading.value = false;
      }
    };

    const fetchConstituency = async (id: string) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await constituencyService.getConstituency(id);

        if (response.success) {
          currentConstituency.value = response.data.constituency;
          return response.data.constituency;
        } else {
          throw new Error('Failed to fetch constituency');
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch constituency';
        console.error('Error fetching constituency:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const createConstituency = async (data: CreateConstituencyData) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await constituencyService.createConstituency(data);

        if (response.success) {
          // Refresh the constituencies list
          await fetchConstituencies();
          return response.data.constituency;
        } else {
          throw new Error('Failed to create constituency');
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to create constituency';
        console.error('Error creating constituency:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const updateConstituency = async (
      id: string,
      data: UpdateConstituencyData
    ) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await constituencyService.updateConstituency(id, data);

        if (response.success) {
          // Update the constituency in the list
          const index = constituencies.value.findIndex((c) => c.id === id);
          if (index !== -1) {
            constituencies.value[index] = response.data.constituency;
          }

          // Update current constituency if it's the same
          if (currentConstituency.value?.id === id) {
            currentConstituency.value = response.data.constituency;
          }

          return response.data.constituency;
        } else {
          throw new Error('Failed to update constituency');
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to update constituency';
        console.error('Error updating constituency:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const deleteConstituency = async (id: string) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await constituencyService.deleteConstituency(id);

        if (response.success) {
          // Remove constituency from the list
          constituencies.value = constituencies.value.filter(
            (c) => c.id !== id
          );

          // Clear current constituency if it's the same
          if (currentConstituency.value?.id === id) {
            currentConstituency.value = null;
          }

          // Update pagination
          pagination.value.total -= 1;

          return true;
        } else {
          throw new Error('Failed to delete constituency');
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to delete constituency';
        console.error('Error deleting constituency:', err);
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

    const setSelectedCounty = (countyId: string | null) => {
      selectedCountyId.value = countyId;
    };

    const changePage = (page: number) => {
      pagination.value.page = page;
      fetchConstituencies({ page });
    };

    const changePageSize = (limit: number) => {
      pagination.value.limit = limit;
      pagination.value.page = 1; // Reset to first page when changing page size
      fetchConstituencies({ page: 1, limit });
    };

    const clearError = () => {
      error.value = null;
    };

    const fetchConstituencyStats = async (
      countyId?: string,
      constituencyId?: string
    ) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await constituencyService.getConstituencyStats(
          countyId,
          constituencyId
        );

        if (response.success) {
          stats.value = response.data;
          return response.data;
        } else {
          throw new Error('Failed to fetch constituency statistics');
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch constituency statistics';
        console.error('Error fetching constituency statistics:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const bulkUpdateConstituencies = async (updates: BulkUpdateData[]) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await constituencyService.bulkUpdateConstituencies(
          updates
        );

        if (response.success) {
          // Refresh the constituencies list
          await fetchConstituencies();
          return response.data;
        } else {
          throw new Error('Failed to bulk update constituencies');
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to bulk update constituencies';
        console.error('Error bulk updating constituencies:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const toggleCursorPagination = () => {
      useCursorPagination.value = !useCursorPagination.value;
      // Reset pagination when switching modes
      pagination.value.page = 1;
      pagination.value.nextCursor = null;
      fetchConstituencies({ page: 1 });
    };

    const loadNextPage = () => {
      if (useCursorPagination.value && pagination.value.nextCursor) {
        fetchConstituencies({ cursor: pagination.value.nextCursor });
      } else if (!useCursorPagination.value) {
        changePage(pagination.value.page + 1);
      }
    };

    const resetState = () => {
      constituencies.value = [];
      currentConstituency.value = null;
      loading.value = false;
      error.value = null;
      pagination.value = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        nextCursor: null,
      };
      searchQuery.value = '';
      sortBy.value = 'createdAt';
      sortOrder.value = 'desc';
      selectedCountyId.value = null;
      stats.value = null;
      useCursorPagination.value = false;
    };

    return {
      // State
      constituencies,
      currentConstituency,
      loading,
      error,
      pagination,
      searchQuery,
      sortBy,
      sortOrder,
      selectedCountyId,
      stats,
      useCursorPagination,

      // Computed
      filteredConstituencies,
      hasConstituencies,
      totalConstituencies,

      // Actions
      fetchConstituencies,
      fetchConstituency,
      createConstituency,
      updateConstituency,
      deleteConstituency,
      setSearchQuery,
      setSorting,
      setSelectedCounty,
      changePage,
      changePageSize,
      clearError,
      resetState,
      fetchConstituencyStats,
      bulkUpdateConstituencies,
      toggleCursorPagination,
      loadNextPage,
    };
  }
);
