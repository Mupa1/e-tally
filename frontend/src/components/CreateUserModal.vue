<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-user-plus me-2"></i>
            Create New User
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            :disabled="loading"
          ></button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName" class="form-label">First Name *</label>
                <input
                  type="text"
                  class="form-control"
                  id="firstName"
                  v-model="form.firstName"
                  :class="{ 'is-invalid': errors.firstName }"
                  required
                />
                <div v-if="errors.firstName" class="invalid-feedback">
                  {{ errors.firstName }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lastName" class="form-label">Last Name *</label>
                <input
                  type="text"
                  class="form-control"
                  id="lastName"
                  v-model="form.lastName"
                  :class="{ 'is-invalid': errors.lastName }"
                  required
                />
                <div v-if="errors.lastName" class="invalid-feedback">
                  {{ errors.lastName }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email Address *</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  :class="{ 'is-invalid': errors.email }"
                  required
                />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="username" class="form-label">Username *</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="form.username"
                  :class="{ 'is-invalid': errors.username }"
                  required
                />
                <div v-if="errors.username" class="invalid-feedback">
                  {{ errors.username }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="password" class="form-label">Password *</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    :class="{ 'is-invalid': errors.password }"
                    required
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    ></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
                <div class="form-text">
                  Password must be at least 8 characters long
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirm Password *</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  required
                />
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                  {{ errors.confirmPassword }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phoneNumber"
                  v-model="form.phoneNumber"
                  :class="{ 'is-invalid': errors.phoneNumber }"
                  placeholder="+254 700 000 000"
                />
                <div v-if="errors.phoneNumber" class="invalid-feedback">
                  {{ errors.phoneNumber }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="imei" class="form-label">IMEI</label>
                <input
                  type="text"
                  class="form-control"
                  id="imei"
                  v-model="form.imei"
                  :class="{ 'is-invalid': errors.imei }"
                  placeholder="15-digit IMEI number"
                  maxlength="15"
                />
                <div v-if="errors.imei" class="invalid-feedback">
                  {{ errors.imei }}
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="role" class="form-label">Role *</label>
              <select
                class="form-select"
                id="role"
                v-model="form.role"
                :class="{ 'is-invalid': errors.role }"
                required
              >
                <option value="">Select a role</option>
                <option
                  v-for="role in userRoles"
                  :key="role.value"
                  :value="role.value"
                >
                  {{ role.label }}
                </option>
              </select>
              <div v-if="errors.role" class="invalid-feedback">
                {{ errors.role }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close')"
              :disabled="loading"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              <i v-else class="fas fa-user-plus me-2"></i>
              {{ loading ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUserManagementStore } from '@/stores/userManagement';
import type { CreateUserData, UserRole } from '@/services/userService';

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const userManagementStore = useUserManagementStore();

// Form data
const form = reactive<CreateUserData & { confirmPassword: string }>({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  imei: '',
  role: '' as UserRole,
});

const errors = reactive<Record<string, string>>({});
const showPassword = ref(false);
const loading = computed(() => userManagementStore.loading);

// User roles
const userRoles = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'CENTRAL_COMMAND_ADMIN', label: 'Central Command Admin' },
  { value: 'CENTRAL_COMMAND_USER', label: 'Central Command User' },
  {
    value: 'PRESIDENTIAL_ELECTION_OBSERVER',
    label: 'Presidential Election Observer',
  },
  {
    value: 'PARLIAMENTARY_ELECTION_OBSERVER',
    label: 'Parliamentary Election Observer',
  },
  {
    value: 'LOCAL_GOVERNMENT_ELECTION_OBSERVER',
    label: 'Local Government Election Observer',
  },
  {
    value: 'SENATORIAL_ELECTION_OBSERVER',
    label: 'Senatorial Election Observer',
  },
  {
    value: 'GUBERNATORIAL_ELECTION_OBSERVER',
    label: 'Gubernatorial Election Observer',
  },
  { value: 'COUNTY_LEVEL_SUPERVISOR', label: 'County Level Supervisor' },
  {
    value: 'CONSTITUENCY_LEVEL_SUPERVISOR',
    label: 'Constituency Level Supervisor',
  },
  {
    value: 'COUNTY_ASSEMBLY_WARD_SUPERVISOR',
    label: 'County Assembly Ward Supervisor',
  },
];

// Validation
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // First name validation
  if (!form.firstName.trim()) {
    newErrors.firstName = 'First name is required';
  } else if (form.firstName.trim().length < 2) {
    newErrors.firstName = 'First name must be at least 2 characters';
  }

  // Last name validation
  if (!form.lastName.trim()) {
    newErrors.lastName = 'Last name is required';
  } else if (form.lastName.trim().length < 2) {
    newErrors.lastName = 'Last name must be at least 2 characters';
  }

  // Email validation
  if (!form.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  // Username validation
  if (!form.username.trim()) {
    newErrors.username = 'Username is required';
  } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) {
    newErrors.username =
      'Username must be 3-30 characters and contain only letters, numbers, and underscores';
  }

  // Password validation
  if (!form.password) {
    newErrors.password = 'Password is required';
  } else if (form.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters long';
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  // Phone number validation (optional)
  if (form.phoneNumber && !/^[0-9+\-\s()]+$/.test(form.phoneNumber)) {
    newErrors.phoneNumber = 'Please enter a valid phone number';
  }

  // IMEI validation (optional)
  if (form.imei && !/^[0-9]{15}$/.test(form.imei)) {
    newErrors.imei = 'IMEI must be exactly 15 digits';
  }

  // Role validation
  if (!form.role) {
    newErrors.role = 'Please select a role';
  }

  // Set errors
  Object.assign(errors, newErrors);

  return Object.keys(newErrors).length === 0;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const userData: CreateUserData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
      phoneNumber: form.phoneNumber?.trim() || undefined,
      imei: form.imei?.trim() || undefined,
      role: form.role as UserRole,
    };

    const result = await userManagementStore.createUser(userData);

    if (result) {
      emit('created');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
</script>

<style scoped>
/* Create user modal styles are now globally available via main.ts */
</style>
