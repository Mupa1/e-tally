import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  userService,
  type User,
  type UserFilters,
  type UserStats,
  type CreateUserData,
  type UpdateUserData,
} from '@/services/userService';
import { useToast } from 'vue-toastification';

export const useUserManagementStore = defineStore('userManagement', () => {
  // State
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const stats = ref<UserStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const filters = ref<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Getters
  const activeUsers = computed(() =>
    users.value.filter((user) => user.isActive)
  );
  const inactiveUsers = computed(() =>
    users.value.filter((user) => !user.isActive)
  );
  const selectedUsers = ref<string[]>([]);

  // Actions
  const toast = useToast();

  // Fetch users with filters
  const fetchUsers = async (newFilters?: Partial<UserFilters>) => {
    try {
      loading.value = true;
      error.value = null;

      const currentFilters = { ...filters.value, ...newFilters };
      const response = await userService.getUsers(currentFilters);

      if (response.success && response.data) {
        users.value = response.data.users;
        pagination.value = response.data.pagination;
        filters.value = currentFilters;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching users';
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Fetch user by ID
  const fetchUserById = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.getUserById(id);

      if (response.success && response.data) {
        currentUser.value = response.data.user;
        return response.data.user;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch user');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching user';
      toast.error(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Create user
  const createUser = async (userData: CreateUserData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.createUser(userData);

      if (response.success && response.data) {
        users.value.unshift(response.data.user);
        toast.success('User created successfully');
        return response.data.user;
      } else {
        throw new Error(response.error?.message || 'Failed to create user');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while creating user';
      toast.error(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Update user
  const updateUser = async (id: string, userData: UpdateUserData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.updateUser(id, userData);

      if (response.success && response.data) {
        const index = users.value.findIndex((user) => user.id === id);
        if (index !== -1) {
          users.value[index] = response.data.user;
        }
        if (currentUser.value?.id === id) {
          currentUser.value = response.data.user;
        }
        toast.success('User updated successfully');
        return response.data.user;
      } else {
        throw new Error(response.error?.message || 'Failed to update user');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while updating user';
      toast.error(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.deleteUser(id);

      if (response.success) {
        users.value = users.value.filter((user) => user.id !== id);
        if (currentUser.value?.id === id) {
          currentUser.value = null;
        }
        toast.success('User deleted successfully');
        return true;
      } else {
        throw new Error(response.error?.message || 'Failed to delete user');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while deleting user';
      toast.error(error.value);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Activate user
  const activateUser = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.activateUser(id);

      if (response.success && response.data) {
        const index = users.value.findIndex((user) => user.id === id);
        if (index !== -1) {
          users.value[index] = response.data.user;
        }
        toast.success('User activated successfully');
        return response.data.user;
      } else {
        throw new Error(response.error?.message || 'Failed to activate user');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while activating user';
      toast.error(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Deactivate user
  const deactivateUser = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.deactivateUser(id);

      if (response.success && response.data) {
        const index = users.value.findIndex((user) => user.id === id);
        if (index !== -1) {
          users.value[index] = response.data.user;
        }
        toast.success('User deactivated successfully');
        return response.data.user;
      } else {
        throw new Error(response.error?.message || 'Failed to deactivate user');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while deactivating user';
      toast.error(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Change user password
  const changePassword = async (id: string, newPassword: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.changePassword(id, newPassword);

      if (response.success) {
        toast.success('Password changed successfully');
        return true;
      } else {
        throw new Error(response.error?.message || 'Failed to change password');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while changing password';
      toast.error(error.value);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Fetch user statistics
  const fetchStats = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.getUserStats();

      if (response.success && response.data) {
        stats.value = response.data;
        return response.data;
      } else {
        throw new Error(
          response.error?.message || 'Failed to fetch user statistics'
        );
      }
    } catch (err: any) {
      error.value =
        err.message || 'An error occurred while fetching statistics';
      toast.error(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Bulk activate users
  const bulkActivateUsers = async (userIds: string[]) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.bulkActivateUsers(userIds);

      if (response.success && response.data) {
        // Update local state
        users.value = users.value.map((user) =>
          userIds.includes(user.id) ? { ...user, isActive: true } : user
        );
        toast.success(`${response.data.count} users activated successfully`);
        return response.data.count;
      } else {
        throw new Error(
          response.error?.message || 'Failed to bulk activate users'
        );
      }
    } catch (err: any) {
      error.value =
        err.message || 'An error occurred while bulk activating users';
      toast.error(error.value);
      return 0;
    } finally {
      loading.value = false;
    }
  };

  // Bulk deactivate users
  const bulkDeactivateUsers = async (userIds: string[]) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await userService.bulkDeactivateUsers(userIds);

      if (response.success && response.data) {
        // Update local state
        users.value = users.value.map((user) =>
          userIds.includes(user.id) ? { ...user, isActive: false } : user
        );
        toast.success(`${response.data.count} users deactivated successfully`);
        return response.data.count;
      } else {
        throw new Error(
          response.error?.message || 'Failed to bulk deactivate users'
        );
      }
    } catch (err: any) {
      error.value =
        err.message || 'An error occurred while bulk deactivating users';
      toast.error(error.value);
      return 0;
    } finally {
      loading.value = false;
    }
  };

  // Search users
  const searchUsers = async (searchTerm: string) => {
    await fetchUsers({ search: searchTerm, page: 1 });
  };

  // Filter users by role
  const filterByRole = async (role: string) => {
    await fetchUsers({ role: role as any, page: 1 });
  };

  // Filter users by status
  const filterByStatus = async (isActive: boolean) => {
    await fetchUsers({ isActive, page: 1 });
  };

  // Clear filters
  const clearFilters = async () => {
    filters.value = {
      page: 1,
      limit: 10,
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    await fetchUsers();
  };

  // Select user
  const selectUser = (id: string) => {
    if (!selectedUsers.value.includes(id)) {
      selectedUsers.value.push(id);
    }
  };

  // Deselect user
  const deselectUser = (id: string) => {
    selectedUsers.value = selectedUsers.value.filter((userId) => userId !== id);
  };

  // Toggle user selection
  const toggleUserSelection = (id: string) => {
    if (selectedUsers.value.includes(id)) {
      deselectUser(id);
    } else {
      selectUser(id);
    }
  };

  // Select all users
  const selectAllUsers = () => {
    selectedUsers.value = users.value.map((user) => user.id);
  };

  // Deselect all users
  const deselectAllUsers = () => {
    selectedUsers.value = [];
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    users,
    currentUser,
    stats,
    loading,
    error,
    pagination,
    filters,
    selectedUsers,

    // Getters
    activeUsers,
    inactiveUsers,

    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    changePassword,
    fetchStats,
    bulkActivateUsers,
    bulkDeactivateUsers,
    searchUsers,
    filterByRole,
    filterByStatus,
    clearFilters,
    selectUser,
    deselectUser,
    toggleUserSelection,
    selectAllUsers,
    deselectAllUsers,
    clearError,
  };
});
