import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { authService } from '@/services/authService';
import type { User, LoginCredentials } from '@/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const toast = useToast();

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const isAdmin = computed(
    () =>
      userRole.value === 'SUPER_ADMIN' ||
      userRole.value === 'CENTRAL_COMMAND_ADMIN'
  );

  // Actions
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        clearAuth();
      }
    }
  };

  // Initialize auth immediately when store is created
  initializeAuth();

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        token.value = response.data.accessToken;
        user.value = response.data.user;

        // Store in localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success('Login successful!');
        return { success: true };
      } else {
        throw new Error('Login failed');
      }
    } catch (err: any) {
      error.value = err.message || 'Login failed';
      toast.error(error.value);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;

    try {
      if (token.value) {
        await authService.logout(token.value);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      loading.value = false;
      toast.success('Logged out successfully');
    }
  };

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refreshToken(storedRefreshToken);

      if (response.success) {
        token.value = response.data.accessToken;
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return true;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (err) {
      clearAuth();
      throw err;
    }
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    error.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    user.value = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return {
    // State
    user,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,
    userRole,
    isAdmin,

    // Actions
    initializeAuth,
    login,
    logout,
    refreshToken,
    clearAuth,
    updateUser,
  };
});
