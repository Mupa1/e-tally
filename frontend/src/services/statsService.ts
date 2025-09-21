import axios from 'axios';

const API_BASE_URL = '/api';

export interface HierarchyStats {
  totalCounties: number;
  totalConstituencies: number;
  totalWards: number;
  totalPollingStations: number;
  totalRegisteredVoters: number;
}

export interface HierarchyStatsResponse {
  success: boolean;
  data: HierarchyStats;
}

class StatsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getHierarchyStats(): Promise<HierarchyStatsResponse> {
    const response = await axios.get(`${API_BASE_URL}/stats/hierarchy`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const statsService = new StatsService();
