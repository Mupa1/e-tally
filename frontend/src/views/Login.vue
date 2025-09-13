<template>
  <div class="login-page">
    <!-- Background -->
    <div class="login-background">
      <div class="login-overlay"></div>
    </div>

    <!-- Login Form -->
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="login-card">
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="login-logo">
                <i class="fas fa-vote-yea"></i>
              </div>
              <h2 class="login-title">e-Tally</h2>
              <p class="login-subtitle">Election Monitoring System</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="login-form">
              <div class="mb-3">
                <label for="username" class="form-label">
                  <i class="fas fa-user me-2"></i>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  v-model="form.username"
                  class="form-control"
                  :class="{ 'is-invalid': errors.username }"
                  placeholder="Enter your username"
                  required
                  :disabled="loading"
                />
                <div v-if="errors.username" class="invalid-feedback">
                  {{ errors.username }}
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fas fa-lock me-2"></i>
                  Password
                </label>
                <div class="password-input">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="form.password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Enter your password"
                    required
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="togglePassword"
                    :disabled="loading"
                  >
                    <i
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    ></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  id="rememberMe"
                  v-model="form.rememberMe"
                  class="form-check-input"
                  :disabled="loading"
                />
                <label for="rememberMe" class="form-check-label">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 login-btn"
                :disabled="loading || !isFormValid"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                <i v-else class="fas fa-sign-in-alt me-2"></i>
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </button>

              <div v-if="error" class="alert alert-danger mt-3" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>
            </form>

            <!-- Footer -->
            <div class="login-footer text-center mt-4">
              <p class="mb-0">
                <a href="#" class="text-decoration-none"
                  >Forgot your password?</a
                >
              </p>
              <p class="mt-2 mb-0">
                <router-link to="/" class="text-decoration-none">
                  <i class="fas fa-arrow-left me-1"></i>
                  Back to Home
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Credentials -->
    <div class="demo-credentials">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="demo-card">
              <h6 class="demo-title">
                <i class="fas fa-info-circle me-2"></i>
                Demo Credentials
              </h6>
              <div class="row">
                <div class="col-md-4">
                  <div class="demo-account">
                    <strong>Super Admin</strong>
                    <p class="mb-1">Username: superadmin</p>
                    <p class="mb-0">Password: SuperAdmin123!</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="demo-account">
                    <strong>Admin</strong>
                    <p class="mb-1">Username: test-admin</p>
                    <p class="mb-0">Password: TestPassword123!</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="demo-account">
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
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
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
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
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
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 0;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.password-toggle:hover {
  color: var(--secondary-color);
}

.login-btn {
  padding: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.login-footer a {
  color: var(--secondary-color);
  font-weight: 500;
}

.login-footer a:hover {
  color: var(--primary-color);
}

.demo-credentials {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
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
  color: #ffc107;
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
  color: #ffc107;
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
