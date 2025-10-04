import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  pollingStationService,
  type PollingStation,
  type PollingStationsParams,
  type CreatePollingStationData,
  type UpdatePollingStationData,
  type PollingStationStatsResponse,
} from '@/services/pollingStationService';

export const usePollingStationManagementStore = defineStore(
  'pollingStationManagement',
  () => {
    // State
    const pollingStations = ref<PollingStation[]>([]);
    const currentPollingStation = ref<PollingStation | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref({
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });
    const searchQuery = ref('');
    const sortBy = ref('createdAt');
    const sortOrder = ref<'asc' | 'desc'>('desc');
    const selectedConstituencyId = ref<string | null>(null);
    const selectedCawId = ref<string | null>(null);
    const selectedCountyId = ref<string | null>(null);
    const stats = ref<PollingStationStatsResponse['data'] | null>(null);

    // Computed
    const filteredPollingStations = computed(() => pollingStations.value);
    const hasPollingStations = computed(() => pollingStations.value.length > 0);
    const totalPollingStations = computed(() => pagination.value.total);

    // Actions
    const fetchPollingStations = async (params: PollingStationsParams = {}) => {
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
          constituencyId: params.constituencyId || selectedConstituencyId.value,
          cawId: params.cawId || selectedCawId.value,
          countyId: params.countyId || selectedCountyId.value,
        };

        const response = await pollingStationService.getPollingStations(
          queryParams
        );

        if (response.success) {
          pollingStations.value = response.data.pollingStations;
          pagination.value = {
            total: response.data.pagination.total,
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            totalPages: response.data.pagination.totalPages,
          };
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message || 'Failed to fetch polling stations';
        console.error('Error fetching polling stations:', err);
      } finally {
        loading.value = false;
      }
    };

    const fetchPollingStationById = async (id: string) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await pollingStationService.getPollingStationById(id);

        if (response.success) {
          currentPollingStation.value = response.data.pollingStation;
          return response.data.pollingStation;
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message || 'Failed to fetch polling station';
        console.error('Error fetching polling station:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const createPollingStation = async (data: CreatePollingStationData) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await pollingStationService.createPollingStation(data);

        if (response.success) {
          // Refresh the list
          await fetchPollingStations();
          return response.data.pollingStation;
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message || 'Failed to create polling station';
        console.error('Error creating polling station:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const updatePollingStation = async (
      id: string,
      data: UpdatePollingStationData
    ) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await pollingStationService.updatePollingStation(
          id,
          data
        );

        if (response.success) {
          // Update the polling station in the list
          const index = pollingStations.value.findIndex((ps) => ps.id === id);
          if (index !== -1) {
            pollingStations.value[index] = response.data.pollingStation;
          }

          // Update current polling station if it's the same
          if (currentPollingStation.value?.id === id) {
            currentPollingStation.value = response.data.pollingStation;
          }

          return response.data.pollingStation;
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message || 'Failed to update polling station';
        console.error('Error updating polling station:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const deletePollingStation = async (id: string) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await pollingStationService.deletePollingStation(id);

        if (response.success) {
          // Remove polling station from the list
          pollingStations.value = pollingStations.value.filter(
            (ps) => ps.id !== id
          );

          // Clear current polling station if it's the same
          if (currentPollingStation.value?.id === id) {
            currentPollingStation.value = null;
          }

          // Update pagination
          pagination.value.total -= 1;

          return true;
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message || 'Failed to delete polling station';
        console.error('Error deleting polling station:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const searchPollingStations = (query: string) => {
      searchQuery.value = query;
      pagination.value.page = 1; // Reset to first page
      return fetchPollingStations();
    };

    const filterByConstituency = (constituencyId: string | null) => {
      selectedConstituencyId.value = constituencyId;
      pagination.value.page = 1; // Reset to first page
      return fetchPollingStations();
    };

    const filterByCaw = (cawId: string | null) => {
      selectedCawId.value = cawId;
      pagination.value.page = 1; // Reset to first page
      return fetchPollingStations();
    };

    const filterByCounty = (countyId: string | null) => {
      selectedCountyId.value = countyId;
      pagination.value.page = 1; // Reset to first page
      return fetchPollingStations();
    };

    const sortPollingStations = (field: string, order: 'asc' | 'desc') => {
      sortBy.value = field;
      sortOrder.value = order;
      pagination.value.page = 1; // Reset to first page
      return fetchPollingStations();
    };

    const changePage = (page: number) => {
      pagination.value.page = page;
      return fetchPollingStations();
    };

    const changePageSize = (limit: number) => {
      pagination.value.limit = limit;
      pagination.value.page = 1; // Reset to first page
      return fetchPollingStations();
    };

    const clearFilters = async () => {
      searchQuery.value = '';
      selectedConstituencyId.value = null;
      selectedCawId.value = null;
      selectedCountyId.value = null;
      sortBy.value = 'createdAt';
      sortOrder.value = 'desc';
      pagination.value.page = 1;
      await fetchPollingStations();
    };

    const clearError = () => {
      error.value = null;
    };

    const clearCurrentPollingStation = () => {
      currentPollingStation.value = null;
    };

    const fetchPollingStationStats = async (pollingStationId?: string) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await pollingStationService.getPollingStationStats(
          pollingStationId
        );

        if (response.success) {
          stats.value = response.data;
          return response.data;
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message ||
          'Failed to fetch polling station statistics';
        console.error('Error fetching polling station statistics:', err);
        throw err;
      } finally {
        loading.value = false;
      }
    };

    return {
      // State
      pollingStations,
      currentPollingStation,
      loading,
      error,
      pagination,
      searchQuery,
      sortBy,
      sortOrder,
      selectedConstituencyId,
      selectedCawId,
      selectedCountyId,
      stats,

      // Computed
      filteredPollingStations,
      hasPollingStations,
      totalPollingStations,

      // Actions
      fetchPollingStations,
      fetchPollingStationById,
      createPollingStation,
      updatePollingStation,
      deletePollingStation,
      searchPollingStations,
      filterByConstituency,
      filterByCaw,
      filterByCounty,
      sortPollingStations,
      changePage,
      changePageSize,
      clearFilters,
      clearError,
      clearCurrentPollingStation,
      fetchPollingStationStats,
    };
  }
);
