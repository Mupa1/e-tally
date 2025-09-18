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

    const response = await axios.get(
      `${API_BASE_URL}/constituencies?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
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
}

export const constituencyService = new ConstituencyService();
