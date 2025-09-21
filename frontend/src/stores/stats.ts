import { defineStore } from 'pinia';
import { ref } from 'vue';
import { statsService, type HierarchyStats } from '@/services/statsService';

export const useStatsStore = defineStore('stats', () => {
  // State
  const hierarchyStats = ref<HierarchyStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchHierarchyStats = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await statsService.getHierarchyStats();

      if (response.success) {
        hierarchyStats.value = response.data;
        return response.data;
      } else {
        throw new Error('Failed to fetch hierarchy statistics');
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch hierarchy statistics';
      console.error('Error fetching hierarchy statistics:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    hierarchyStats,
    loading,
    error,
    // Actions
    fetchHierarchyStats,
    clearError,
  };
});
