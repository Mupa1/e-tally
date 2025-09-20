<template>
  <div class="min-h-screen relative flex flex-col">
    <!-- Background -->
    <div class="login-background">
      <div class="login-overlay"></div>
    </div>

    <!-- Login Form -->
    <div class="container mx-auto px-4">
      <div class="flex justify-center items-center min-h-screen">
        <div class="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <div class="login-card">
            <!-- Header -->
            <div class="text-center mb-6">
              <div class="login-logo">
                <i class="fas fa-vote-yea"></i>
              </div>
              <h2 class="login-title">e-Tally</h2>
              <p class="login-subtitle">Election Monitoring System</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-user mr-2"></i>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  v-model="form.username"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500': errors.username }"
                  placeholder="Enter your username"
                  required
                  :disabled="loading"
                />
                <div v-if="errors.username" class="mt-1 text-sm text-red-600">
                  {{ errors.username }}
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-lock mr-2"></i>
                  Password
                </label>
                <div class="relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="form.password"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
                    placeholder="Enter your password"
                    required
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    @click="togglePassword"
                    :disabled="loading"
                  >
                    <i
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    ></i>
                  </button>
                </div>
                <div v-if="errors.password" class="mt-1 text-sm text-red-600">
                  {{ errors.password }}
                </div>
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  v-model="form.rememberMe"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  :disabled="loading"
                />
                <label for="rememberMe" class="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="loading || !isFormValid"
              >
                <span
                  v-if="loading"
                  class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                ></span>
                <i v-else class="fas fa-sign-in-alt mr-2"></i>
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </button>

              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                {{ error }}
              </div>
            </form>

            <!-- Footer -->
            <div class="text-center mt-6">
              <p class="mb-0">
                <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >Forgot your password?</a
                >
              </p>
              <p class="mt-2 mb-0">
                <router-link to="/" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  <i class="fas fa-arrow-left mr-1"></i>
                  Back to Home
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Credentials -->
    <div class="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div class="container mx-auto px-4">
        <div class="flex justify-center">
          <div class="w-full max-w-4xl">
            <div class="demo-card">
              <h6 class="demo-title">
                <i class="fas fa-info-circle mr-2"></i>
                Demo Credentials
              </h6>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="demo-account" @click="fillDemoCredentials('superadmin', 'SuperAdmin123!')">
                  <strong>Super Admin</strong>
                  <p class="mb-1">Username: superadmin</p>
                  <p class="mb-0">Password: SuperAdmin123!</p>
                </div>
                <div class="demo-account" @click="fillDemoCredentials('test-admin', 'TestPassword123!')">
                  <strong>Admin</strong>
                  <p class="mb-1">Username: test-admin</p>
                  <p class="mb-0">Password: TestPassword123!</p>
                </div>
                <div class="demo-account" @click="fillDemoCredentials('test-user', 'TestPassword123!')">
                  <strong>User</strong>
                  <p class="mb-1">Username: test-user</p>
                  <p class="mb-0">Password: TestPassword123!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { LoginCredentials } from '@/types/auth';

const router = useRouter();
const authStore = useAuthStore();

// Form data
const form = ref<LoginCredentials & { rememberMe: boolean }>({
  username: '',
  password: '',
  rememberMe: false,
});

// UI state
const loading = ref(false);
const showPassword = ref(false);
const error = ref<string | null>(null);
const errors = ref<Record<string, string>>({});

// Computed
const isFormValid = computed(() => {
  return form.value.username.trim() !== '' && form.value.password.trim() !== '';
});

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.username.trim()) {
    errors.value.username = 'Username is required';
  }

  if (!form.value.password.trim()) {
    errors.value.password = 'Password is required';
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }

  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const result = await authStore.login({
      username: form.value.username,
      password: form.value.password,
    });

    if (result.success) {
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      error.value = result.error || 'Login failed. Please try again.';
    }
  } catch (err: any) {
    error.value =
      err.message || 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Auto-fill demo credentials on click
const fillDemoCredentials = (username: string, password: string) => {
  form.value.username = username;
  form.value.password = password;
};

onMounted(() => {
  // If already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    router.push('/dashboard');
  }
});
</script>

<style scoped>
.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  z-index: -2;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  z-index: -1;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.login-logo i {
  font-size: 2rem;
  color: white;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 0;
}

.demo-card {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  color: white;
  animation: slideInUp 0.6s ease-out;
}

.demo-title {
  color: #fbbf24;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.demo-account {
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.demo-account:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.demo-account strong {
  color: #fbbf24;
  display: block;
  margin-bottom: 0.5rem;
}

.demo-account p {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .demo-credentials {
    position: relative;
    margin-top: 2rem;
  }

  .demo-card {
    margin: 0 1rem;
  }
}

@media (max-width: 576px) {
  .login-title {
    font-size: 1.5rem;
  }

  .demo-account {
    margin-bottom: 1rem;
  }
}
</style>
