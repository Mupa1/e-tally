import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken } = response.data.data;

          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface PollingStation {
  id: string;
  code: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  constituencyId: string;
  cawId: string;
  constituency?: {
    id: string;
    code: string;
    name: string;
    county: {
      id: string;
      code: string;
      name: string;
    };
  };
  caw?: {
    id: string;
    code: string;
    name: string;
  };
  _count?: {
    voterRegistrations: number;
  };
}

export interface PollingStationsResponse {
  success: boolean;
  data: {
    pollingStations: PollingStation[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface PollingStationResponse {
  success: boolean;
  data: {
    pollingStation: PollingStation;
  };
}

export interface PollingStationStatsResponse {
  success: boolean;
  data: {
    totalCount: number;
    pollingStation?: PollingStation;
    voterStats: {
      totalRegisteredVoters: number;
      averageRegisteredVoters: number;
    };
  };
}

export interface CreatePollingStationData {
  code: string;
  name: string;
  constituencyId: string;
  cawId: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  registeredVoters?: number;
}

export interface UpdatePollingStationData {
  code?: string;
  name?: string;
  constituencyId?: string;
  cawId?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  registeredVoters?: number;
}

export interface PollingStationsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  constituencyId?: string;
  cawId?: string;
  countyId?: string;
}

class PollingStationService {
  async getPollingStations(
    params: PollingStationsParams = {}
  ): Promise<PollingStationsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.constituencyId)
      queryParams.append('constituencyId', params.constituencyId);
    if (params.cawId) queryParams.append('cawId', params.cawId);
    if (params.countyId) queryParams.append('countyId', params.countyId);

    const response = await api.get(
      `/polling-stations?${queryParams.toString()}`
    );
    return response.data;
  }

  async getPollingStationById(id: string): Promise<PollingStationResponse> {
    const response = await api.get(`/polling-stations/${id}`);
    return response.data;
  }

  async getPollingStationStats(
    pollingStationId?: string
  ): Promise<PollingStationStatsResponse> {
    const queryParams = new URLSearchParams();
    if (pollingStationId)
      queryParams.append('pollingStationId', pollingStationId);

    const response = await api.get(
      `/polling-stations/stats?${queryParams.toString()}`
    );
    return response.data;
  }

  async createPollingStation(
    data: CreatePollingStationData
  ): Promise<PollingStationResponse> {
    const response = await api.post('/polling-stations', data);
    return response.data;
  }

  async updatePollingStation(
    id: string,
    data: UpdatePollingStationData
  ): Promise<PollingStationResponse> {
    const response = await api.put(`/polling-stations/${id}`, data);
    return response.data;
  }

  async deletePollingStation(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/polling-stations/${id}`);
    return response.data;
  }

  async bulkUploadPollingStations(data: {
    pollingStations: any[];
  }): Promise<{ success: boolean; message: string; data: { count: number } }> {
    const response = await api.post('/polling-stations/bulk-upload', data);
    return response.data;
  }
}

export const pollingStationService = new PollingStationService();
