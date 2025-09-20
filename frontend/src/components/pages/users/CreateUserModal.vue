<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!-- Background overlay -->
      <Overlay @close="$emit('close')" />

      <!-- Modal panel -->
      <div
        class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
      >
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <i class="fas fa-user-plus text-indigo-600"></i>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Create New User
              </h3>
              <button
                type="button"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                @click="$emit('close')"
                :disabled="loading"
              >
                <i class="fas fa-times"></i>
              </button>
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="firstName"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >First Name *</label
                    >
                    <input
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.firstName }"
                      id="firstName"
                      v-model="form.firstName"
                      required
                    />
                    <div
                      v-if="errors.firstName"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ errors.firstName }}
                    </div>
                  </div>
                  <div>
                    <label
                      for="lastName"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Last Name *</label
                    >
                    <input
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.lastName }"
                      id="lastName"
                      v-model="form.lastName"
                      required
                    />
                    <div
                      v-if="errors.lastName"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Email Address *</label
                    >
                    <input
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.email }"
                      id="email"
                      v-model="form.email"
                      required
                    />
                    <div v-if="errors.email" class="mt-1 text-sm text-red-600">
                      {{ errors.email }}
                    </div>
                  </div>
                  <div>
                    <label
                      for="username"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Username *</label
                    >
                    <input
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.username }"
                      id="username"
                      v-model="form.username"
                      required
                    />
                    <div
                      v-if="errors.username"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ errors.username }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="password"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Password *</label
                    >
                    <div class="relative">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        :class="{ 'border-red-500': errors.password }"
                        id="password"
                        v-model="form.password"
                        required
                      />
                      <button
                        type="button"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        @click="showPassword = !showPassword"
                      >
                        <i
                          :class="
                            showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                          "
                        ></i>
                      </button>
                    </div>
                    <div
                      v-if="errors.password"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ errors.password }}
                    </div>
                    <div class="mt-1 text-sm text-gray-500">
                      Password must be at least 8 characters long
                    </div>
                  </div>
                  <div>
                    <label
                      for="confirmPassword"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Confirm Password *</label
                    >
                    <input
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.confirmPassword }"
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      required
                    />
                    <div
                      v-if="errors.confirmPassword"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ errors.confirmPassword }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="phoneNumber"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Phone Number</label
                    >
                    <input
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.phoneNumber }"
                      id="phoneNumber"
                      v-model="form.phoneNumber"
                      placeholder="+254 700 000 000"
                    />
                    <div
                      v-if="errors.phoneNumber"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ errors.phoneNumber }}
                    </div>
                  </div>
                  <div>
                    <label
                      for="imei"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >IMEI</label
                    >
                    <input
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.imei }"
                      id="imei"
                      v-model="form.imei"
                      placeholder="15-digit IMEI number"
                      maxlength="15"
                    />
                    <div v-if="errors.imei" class="mt-1 text-sm text-red-600">
                      {{ errors.imei }}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    for="role"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Role *</label
                  >
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{ 'border-red-500': errors.role }"
                    id="role"
                    v-model="form.role"
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
                  <div v-if="errors.role" class="mt-1 text-sm text-red-600">
                    {{ errors.role }}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
              @click="handleSubmit"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                role="status"
              ></span>
              <i v-else class="fas fa-user-plus me-2"></i>
              {{ loading ? 'Creating...' : 'Create User' }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="$emit('close')"
              :disabled="loading"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUserManagementStore } from '@/stores/userManagement';
import type { CreateUserData, UserRole } from '@/services/userService';
import Overlay from '../../Overlay.vue';

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
