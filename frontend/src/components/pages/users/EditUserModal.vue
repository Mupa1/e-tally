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
              <i class="fas fa-user-edit text-indigo-600"></i>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Edit User
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

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="role"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Role *</label
                    >
                    <select
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{
                        'border-red-500': errors.role,
                        'bg-gray-100': !canChangeRole,
                      }"
                      id="role"
                      v-model="form.role"
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
                    <div v-if="errors.role" class="mt-1 text-sm text-red-600">
                      {{ errors.role }}
                    </div>
                    <div
                      v-if="!canChangeRole"
                      class="mt-1 text-sm text-gray-500"
                    >
                      You don't have permission to change this user's role
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Status</label
                    >
                    <div class="flex items-center">
                      <input
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        type="checkbox"
                        id="isActive"
                        v-model="form.isActive"
                        :disabled="!canChangeStatus"
                      />
                      <label class="ml-2 text-sm text-gray-700" for="isActive">
                        {{ form.isActive ? 'Active' : 'Inactive' }}
                      </label>
                    </div>
                    <div
                      v-if="!canChangeStatus"
                      class="mt-1 text-sm text-gray-500"
                    >
                      You don't have permission to change this user's status
                    </div>
                  </div>
                </div>

                <div
                  v-if="user"
                  class="bg-blue-50 border border-blue-200 rounded-md p-4"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <i class="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">
                        User Information
                      </h3>
                      <div class="mt-2 text-sm text-blue-700">
                        <ul class="list-disc list-inside space-y-1">
                          <li>Created: {{ formatDate(user.createdAt) }}</li>
                          <li>
                            Last Updated: {{ formatDate(user.updatedAt) }}
                          </li>
                          <li v-if="user.lastLoginAt">
                            Last Login: {{ formatDate(user.lastLoginAt) }}
                          </li>
                          <li v-else>Last Login: Never</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
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
            <i v-else class="fas fa-save mr-2"></i>
            {{ loading ? 'Saving...' : 'Save Changes' }}
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useUserManagementStore } from '@/stores/userManagement';
import { useAuthStore } from '@/stores/auth';
import type { User, UpdateUserData, UserRole } from '@/services/userService';
import Overlay from '../../Overlay.vue';

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
/* Edit user modal styles are now globally available via main.ts */
</style>
