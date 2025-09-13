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
            <i class="fas fa-user-edit me-2"></i>
            Edit User
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

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="role" class="form-label">Role *</label>
                <select
                  class="form-select"
                  id="role"
                  v-model="form.role"
                  :class="{ 'is-invalid': errors.role }"
                  :disabled="!canChangeRole"
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
                <div v-if="!canChangeRole" class="form-text">
                  You don't have permission to change this user's role
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Status</label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="isActive"
                    v-model="form.isActive"
                    :disabled="!canChangeStatus"
                  />
                  <label class="form-check-label" for="isActive">
                    {{ form.isActive ? 'Active' : 'Inactive' }}
                  </label>
                </div>
                <div v-if="!canChangeStatus" class="form-text">
                  You don't have permission to change this user's status
                </div>
              </div>
            </div>

            <div class="alert alert-info" v-if="user">
              <i class="fas fa-info-circle me-2"></i>
              <strong>User Information:</strong>
              <ul class="mb-0 mt-2">
                <li>Created: {{ formatDate(user.createdAt) }}</li>
                <li>Last Updated: {{ formatDate(user.updatedAt) }}</li>
                <li v-if="user.lastLoginAt">
                  Last Login: {{ formatDate(user.lastLoginAt) }}
                </li>
                <li v-else>Last Login: Never</li>
              </ul>
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
              <i v-else class="fas fa-save me-2"></i>
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useUserManagementStore } from '@/stores/userManagement';
import { useAuthStore } from '@/stores/auth';
import type { User, UpdateUserData, UserRole } from '@/services/userService';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const userManagementStore = useUserManagementStore();
const authStore = useAuthStore();

// Form data
const form = reactive<UpdateUserData>({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  phoneNumber: '',
  imei: '',
  role: '' as UserRole,
  isActive: true,
});

const errors = reactive<Record<string, string>>({});
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

// Permission checks
const canChangeRole = computed(() => {
  const currentUser = authStore.user;
  if (!currentUser) return false;
  if (currentUser.role === 'SUPER_ADMIN') return true;
  if (currentUser.role === 'CENTRAL_COMMAND_ADMIN') return true;
  return false;
});

const canChangeStatus = computed(() => {
  const currentUser = authStore.user;
  if (!currentUser) return false;
  if (currentUser.role === 'SUPER_ADMIN') return true;
  if (currentUser.role === 'CENTRAL_COMMAND_ADMIN') return true;
  if (currentUser.role === 'CENTRAL_COMMAND_USER') return true;
  return false;
});

// Initialize form with user data
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.firstName = newUser.firstName;
      form.lastName = newUser.lastName;
      form.email = newUser.email;
      form.username = newUser.username;
      form.phoneNumber = newUser.phoneNumber || '';
      form.imei = newUser.imei || '';
      form.role = newUser.role;
      form.isActive = newUser.isActive;
    }
  },
  { immediate: true }
);

// Validation
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // First name validation
  if (!form.firstName?.trim()) {
    newErrors.firstName = 'First name is required';
  } else if (form.firstName.trim().length < 2) {
    newErrors.firstName = 'First name must be at least 2 characters';
  }

  // Last name validation
  if (!form.lastName?.trim()) {
    newErrors.lastName = 'Last name is required';
  } else if (form.lastName.trim().length < 2) {
    newErrors.lastName = 'Last name must be at least 2 characters';
  }

  // Email validation
  if (!form.email?.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  // Username validation
  if (!form.username?.trim()) {
    newErrors.username = 'Username is required';
  } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) {
    newErrors.username =
      'Username must be 3-30 characters and contain only letters, numbers, and underscores';
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
    const updateData: UpdateUserData = {
      firstName: form.firstName?.trim(),
      lastName: form.lastName?.trim(),
      email: form.email?.trim(),
      username: form.username?.trim(),
      phoneNumber: form.phoneNumber?.trim() || undefined,
      imei: form.imei?.trim() || undefined,
      role: form.role as UserRole,
      isActive: form.isActive,
    };

    const result = await userManagementStore.updateUser(
      props.user.id,
      updateData
    );

    if (result) {
      emit('updated');
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// Utility function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-dialog {
  max-width: 600px;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.invalid-feedback {
  display: block;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.form-check-input:disabled {
  opacity: 0.5;
}

.form-select:disabled {
  opacity: 0.5;
}
</style>
