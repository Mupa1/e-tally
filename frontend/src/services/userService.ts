import axios from 'axios';
import type { ApiResponse } from '@/types/auth';

// User management types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  imei?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'CENTRAL_COMMAND_ADMIN'
  | 'CENTRAL_COMMAND_USER'
  | 'PRESIDENTIAL_ELECTION_OBSERVER'
  | 'PARLIAMENTARY_ELECTION_OBSERVER'
  | 'LOCAL_GOVERNMENT_ELECTION_OBSERVER'
  | 'SENATORIAL_ELECTION_OBSERVER'
  | 'GUBERNATORIAL_ELECTION_OBSERVER'
  | 'COUNTY_LEVEL_SUPERVISOR'
  | 'CONSTITUENCY_LEVEL_SUPERVISOR'
  | 'COUNTY_ASSEMBLY_WARD_SUPERVISOR';

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  imei?: string;
  role: UserRole;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  imei?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Array<{
    role: UserRole;
    _count: { role: number };
  }>;
  recentUsers: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
  }>;
}

export interface PaginatedUsers {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Create axios instance with auth token
const createApiClient = () => {
  const token = localStorage.getItem('accessToken');
  return axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// User service class
export class UserService {
  private api = createApiClient();

  // Get all users with pagination and filters
  async getUsers(
    filters: UserFilters = {}
  ): Promise<ApiResponse<PaginatedUsers>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined)
      params.append('isActive', filters.isActive.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await this.api.get(`/users?${params.toString()}`);
    return response.data;
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  // Create new user
  async createUser(
    userData: CreateUserData
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.post('/users', userData);
    return response.data;
  }

  // Update user
  async updateUser(
    id: string,
    userData: UpdateUserData
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse> {
    const response = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  // Activate user
  async activateUser(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.put(`/users/${id}/activate`);
    return response.data;
  }

  // Deactivate user
  async deactivateUser(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.put(`/users/${id}/deactivate`);
    return response.data;
  }

  // Change user password
  async changePassword(id: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.api.put(`/users/${id}/change-password`, {
      newPassword,
    });
    return response.data;
  }

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    const response = await this.api.get('/users/stats/overview');
    return response.data;
  }

  // Bulk activate users
  async bulkActivateUsers(
    userIds: string[]
  ): Promise<ApiResponse<{ count: number }>> {
    const response = await this.api.post('/users/bulk/activate', { userIds });
    return response.data;
  }

  // Bulk deactivate users
  async bulkDeactivateUsers(
    userIds: string[]
  ): Promise<ApiResponse<{ count: number }>> {
    const response = await this.api.post('/users/bulk/deactivate', { userIds });
    return response.data;
  }
}

// Export singleton instance
export const userService = new UserService();
