<template>
  <MainLayout
    page-title="Create New User"
    page-subtitle="Add a new user to the system"
  >
    <!-- Error Alert -->
    <ErrorAlert
      :show="!!error"
      :message="error || ''"
      @dismiss="error = null"
    />

    <!-- Success Alert -->
    <SuccessAlert
      :show="!!success"
      :message="success || ''"
      @dismiss="success = null"
    />

    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <GoBack to="/users" text="Back to Users" />
      </div>
    </div>

    <!-- Create User Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <!-- Personal Information -->
          <FormSection :columns="2" gap="sm">
            <FormInput
              v-model="form.firstName"
              id="firstName"
              label="First Name"
              type="text"
              :required="true"
              :error="errors.firstName"
            />
            <FormInput
              v-model="form.lastName"
              id="lastName"
              label="Last Name"
              type="text"
              :required="true"
              :error="errors.lastName"
            />
          </FormSection>

          <!-- Account Information -->
          <FormSection :columns="2" gap="sm">
            <FormInput
              v-model="form.email"
              id="email"
              label="Email Address"
              type="email"
              :required="true"
              :error="errors.email"
            />
            <FormInput
              v-model="form.username"
              id="username"
              label="Username"
              type="text"
              :required="true"
              :error="errors.username"
            />
          </FormSection>

          <!-- Password Information -->
          <FormSection :columns="2" gap="sm">
            <PasswordInput
              v-model="form.password"
              id="password"
              label="Password"
              :required="true"
              :error="errors.password"
              help-text="Password must be at least 8 characters long"
            />
            <PasswordInput
              v-model="form.confirmPassword"
              id="confirmPassword"
              label="Confirm Password"
              :required="true"
              :error="errors.confirmPassword"
            />
          </FormSection>

          <!-- Contact Information -->
          <FormSection :columns="2" gap="sm">
            <FormInput
              v-model="form.phoneNumber"
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              placeholder="+254 700 000 000"
              :error="errors.phoneNumber"
            />
            <FormInput
              v-model="form.imei"
              id="imei"
              label="IMEI"
              type="text"
              placeholder="15-digit IMEI number"
              :maxlength="15"
              :error="errors.imei"
            />
          </FormSection>

          <!-- Role Information -->
          <FormSection :columns="1" gap="sm">
            <FormSelect
              v-model="selectedRole"
              :options="userRoles"
              label="Role"
              placeholder="Select a role"
              @change="handleRoleChange"
            />
            <div v-if="errors.role" class="mt-1 text-sm text-red-600">
              {{ errors.role }}
            </div>
          </FormSection>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              text="Cancel"
              variant="secondary"
              :disabled="loading"
              @click="router.push('/users')"
            />
            <Button
              text="Create User"
              icon="fas fa-user-plus"
              icon-position="left"
              variant="primary"
              :loading="loading"
              loading-text="Creating..."
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserManagementStore } from '@/stores/userManagement';
import type { CreateUserData, UserRole } from '@/services/userService';
import MainLayout from '@/components/MainLayout.vue';
import Button from '@/components/Button.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import SuccessAlert from '@/components/SuccessAlert.vue';
import GoBack from '@/components/GoBack.vue';
import FormInput from '@/components/FormInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import FormSection from '@/components/FormSection.vue';
import FormSelect from '@/components/FormSelect.vue';

const router = useRouter();
const userManagementStore = useUserManagementStore();

// Reactive data
const error = ref<string | null>(null);
const success = ref<string | null>(null);

// Form data
const form = reactive<
  CreateUserData & {
    confirmPassword: string;
    phoneNumber: string;
    imei: string;
  }
>({
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
const loading = computed(() => userManagementStore.loading);

// User roles
const userRoles = [
  { id: 'SUPER_ADMIN', value: 'SUPER_ADMIN', label: 'Super Admin' },
  {
    id: 'CENTRAL_COMMAND_ADMIN',
    value: 'CENTRAL_COMMAND_ADMIN',
    label: 'Central Command Admin',
  },
  {
    id: 'CENTRAL_COMMAND_USER',
    value: 'CENTRAL_COMMAND_USER',
    label: 'Central Command User',
  },
  {
    id: 'PRESIDENTIAL_ELECTION_OBSERVER',
    value: 'PRESIDENTIAL_ELECTION_OBSERVER',
    label: 'Presidential Election Observer',
  },
  {
    id: 'PARLIAMENTARY_ELECTION_OBSERVER',
    value: 'PARLIAMENTARY_ELECTION_OBSERVER',
    label: 'Parliamentary Election Observer',
  },
  {
    id: 'LOCAL_GOVERNMENT_ELECTION_OBSERVER',
    value: 'LOCAL_GOVERNMENT_ELECTION_OBSERVER',
    label: 'Local Government Election Observer',
  },
  {
    id: 'SENATORIAL_ELECTION_OBSERVER',
    value: 'SENATORIAL_ELECTION_OBSERVER',
    label: 'Senatorial Election Observer',
  },
  {
    id: 'GUBERNATORIAL_ELECTION_OBSERVER',
    value: 'GUBERNATORIAL_ELECTION_OBSERVER',
    label: 'Gubernatorial Election Observer',
  },
  {
    id: 'COUNTY_LEVEL_SUPERVISOR',
    value: 'COUNTY_LEVEL_SUPERVISOR',
    label: 'County Level Supervisor',
  },
  {
    id: 'CONSTITUENCY_LEVEL_SUPERVISOR',
    value: 'CONSTITUENCY_LEVEL_SUPERVISOR',
    label: 'Constituency Level Supervisor',
  },
  {
    id: 'COUNTY_ASSEMBLY_WARD_SUPERVISOR',
    value: 'COUNTY_ASSEMBLY_WARD_SUPERVISOR',
    label: 'County Assembly Ward Supervisor',
  },
];

// Selected role for FormSelect
const selectedRole = ref<{
  id: string | number;
  value?: any;
  label: string;
} | null>(null);

// Handle role change
const handleRoleChange = (
  role: { id: string | number; value?: any; label: string } | null
) => {
  if (role && role.value) {
    form.role = role.value as UserRole;
  } else {
    form.role = '' as UserRole;
  }
};

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
    error.value = null;
    success.value = null;

    const userData: CreateUserData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
      phoneNumber: form.phoneNumber.trim() || undefined,
      imei: form.imei.trim() || undefined,
      role: form.role as UserRole,
    };

    const result = await userManagementStore.createUser(userData);

    if (result) {
      success.value = 'User created successfully!';
      // Reset form
      Object.assign(form, {
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
      selectedRole.value = null;
      // Navigate back to users list after a short delay
      setTimeout(() => {
        router.push('/users');
      }, 2000);
    }
  } catch (err) {
    console.error('Error creating user:', err);
    error.value = 'Failed to create user. Please try again.';
  }
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
