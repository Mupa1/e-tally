import axios from 'axios';

const API_BASE_URL = '/api';

export interface Constituency {
  id: string;
  code: string;
  name: string;
  countyId: string;
  county: {
    id: string;
    code: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    caws: number;
    pollingStations: number;
  };
}

export interface ConstituenciesResponse {
  success: boolean;
  data: {
    constituencies: Constituency[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ConstituencyResponse {
  success: boolean;
  data: {
    constituency: Constituency;
  };
}

export interface CreateConstituencyData {
  code: string;
  name: string;
  countyId: string;
}

export interface UpdateConstituencyData {
  code?: string;
  name?: string;
  countyId?: string;
}

export interface ConstituenciesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  countyId?: string;
  fields?: string; // Comma-separated field list for selective loading
  cursor?: string; // For cursor-based pagination
  forceRefresh?: boolean;
}

export interface ConstituencyStats {
  totalCount: number;
  byCounty: Array<{
    constituencyId: string;
    _count: { id: number };
  }>;
  byCAW: Array<{
    cawId: string;
    _count: { id: number };
  }>;
  voterStats: {
    _sum: { registeredVoters: number | null };
    _avg: { registeredVoters: number | null };
    _max: { registeredVoters: number | null };
    _min: { registeredVoters: number | null };
  };
}

export interface ConstituencyStatsResponse {
  success: boolean;
  data: ConstituencyStats;
}

export interface BulkUpdateData {
  id: string;
  data: UpdateConstituencyData;
}

export interface BulkUpdateResponse {
  success: boolean;
  data: {
    total: number;
    successful: number;
    failed: number;
    errors: Array<{
      id: string;
      error: string;
    }>;
  };
  message: string;
}

class ConstituencyService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getConstituencies(
    params: ConstituenciesParams = {}
  ): Promise<ConstituenciesResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.countyId) queryParams.append('countyId', params.countyId);
    if (params.fields) queryParams.append('fields', params.fields);
    if (params.cursor) queryParams.append('cursor', params.cursor);

    // Only add cache-busting for specific requests that need fresh data
    if (params.forceRefresh) {
      queryParams.append('_t', Date.now().toString());
    }

    const response = await axios.get(
      `${API_BASE_URL}/constituencies?${queryParams.toString()}`,
      {
        headers: this.getAuthHeaders(),
        // Only disable caching when forcing refresh
        ...(params.forceRefresh && { cache: 'no-cache' }),
      }
    );
    return response.data;
  }

  async getConstituency(id: string): Promise<ConstituencyResponse> {
    const response = await axios.get(`${API_BASE_URL}/constituencies/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createConstituency(
    data: CreateConstituencyData
  ): Promise<ConstituencyResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/constituencies`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async updateConstituency(
    id: string,
    data: UpdateConstituencyData
  ): Promise<ConstituencyResponse> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/constituencies/${id}`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async deleteConstituency(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/constituencies/${id}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getConstituencyStats(
    countyId?: string,
    constituencyId?: string
  ): Promise<ConstituencyStatsResponse> {
    const queryParams = new URLSearchParams();
    if (countyId) queryParams.append('countyId', countyId);
    if (constituencyId) queryParams.append('constituencyId', constituencyId);

    const response = await axios.get(
      `${API_BASE_URL}/constituencies/stats?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async bulkUpdateConstituencies(
    updates: BulkUpdateData[]
  ): Promise<BulkUpdateResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/constituencies/bulk-update`,
        { updates },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export const constituencyService = new ConstituencyService();
