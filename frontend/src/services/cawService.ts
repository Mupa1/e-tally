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

export interface CAW {
  id: string;
  code: string;
  name: string;
  constituencyId: string;
  createdAt: string;
  updatedAt: string;
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
  _count?: {
    pollingStations: number;
  };
}

export interface CAWsResponse {
  success: boolean;
  data: {
    caws: CAW[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface CAWResponse {
  success: boolean;
  data: {
    caw: CAW;
  };
}

export interface CreateCAWData {
  code: string;
  name: string;
  constituencyId: string;
}

export interface UpdateCAWData {
  code?: string;
  name?: string;
  constituencyId?: string;
}

export interface CAWsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  constituencyId?: string;
}

export interface BulkImportCAWsData {
  caws: CreateCAWData[];
}

class CAWService {
  async getCAWs(params: CAWsParams = {}): Promise<CAWsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.constituencyId)
      queryParams.append('constituencyId', params.constituencyId);

    const response = await api.get(`/caws?${queryParams.toString()}`);
    return response.data;
  }

  async getCAWById(id: string): Promise<CAWResponse> {
    const response = await api.get(`/caws/${id}`);
    return response.data;
  }

  async createCAW(data: CreateCAWData): Promise<CAWResponse> {
    const response = await api.post('/caws', data);
    return response.data;
  }

  async updateCAW(id: string, data: UpdateCAWData): Promise<CAWResponse> {
    const response = await api.put(`/caws/${id}`, data);
    return response.data;
  }

  async deleteCAW(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/caws/${id}`);
    return response.data;
  }

  async bulkImportCAWs(
    data: BulkImportCAWsData
  ): Promise<{ success: boolean; message: string; data: { count: number } }> {
    const response = await api.post('/caws/bulk-import', data);
    return response.data;
  }
}

export const cawService = new CAWService();
