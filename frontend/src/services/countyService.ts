import axios from 'axios';

const API_BASE_URL = '/api';

export interface County {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    constituencies: number;
  };
}

export interface CountiesResponse {
  success: boolean;
  data: {
    counties: County[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CountyResponse {
  success: boolean;
  data: {
    county: County;
  };
}

export interface CreateCountyData {
  code: string;
  name: string;
}

export interface UpdateCountyData {
  code?: string;
  name?: string;
}

export interface CountiesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  forceRefresh?: boolean;
}

class CountyService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    console.log(
      'County service - token from localStorage:',
      token ? 'exists' : 'null'
    );
    console.log(
      'County service - Authorization header:',
      token ? `Bearer ${token.substring(0, 20)}...` : 'Bearer null'
    );
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getCounties(params: CountiesParams = {}): Promise<CountiesResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    // Only add cache-busting for specific requests that need fresh data
    if (params.forceRefresh) {
      queryParams.append('_t', Date.now().toString());
    }

    const response = await axios.get(
      `${API_BASE_URL}/counties?${queryParams.toString()}`,
      {
        headers: this.getAuthHeaders(),
        // Only disable caching when forcing refresh
        ...(params.forceRefresh && { cache: 'no-cache' }),
      }
    );
    return response.data;
  }

  async getCounty(id: string): Promise<CountyResponse> {
    const response = await axios.get(`${API_BASE_URL}/counties/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createCounty(data: CreateCountyData): Promise<CountyResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/counties`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async updateCounty(
    id: string,
    data: UpdateCountyData
  ): Promise<CountyResponse> {
    try {
      const response = await axios.put(`${API_BASE_URL}/counties/${id}`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async deleteCounty(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/counties/${id}`, {
        headers: this.getAuthHeaders(),
      });
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

export const countyService = new CountyService();
