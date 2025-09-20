<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!-- Background overlay -->
      <Overlay @close="$emit('close')" />

      <!-- Modal panel -->
      <div
        class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md"
      >
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <i class="fas fa-key text-indigo-600"></i>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Change Password
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
                <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <i class="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Changing password for:</strong>
                        {{ user.firstName }} {{ user.lastName }} ({{
                          user.email
                        }})
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    for="newPassword"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >New Password *</label
                  >
                  <div class="relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      :class="{ 'border-red-500': errors.newPassword }"
                      id="newPassword"
                      v-model="form.newPassword"
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
                    v-if="errors.newPassword"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ errors.newPassword }}
                  </div>
                  <div class="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long
                  </div>
                </div>

                <div>
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Confirm New Password *</label
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

                <div
                  class="bg-yellow-50 border border-yellow-200 rounded-md p-4"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <i
                        class="fas fa-exclamation-triangle text-yellow-400"
                      ></i>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        <strong>Warning:</strong> Changing the password will log
                        out the user from all devices. They will need to log in
                        again with the new password.
                      </p>
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
            <i v-else class="fas fa-key mr-2"></i>
            {{ loading ? 'Changing...' : 'Change Password' }}
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
import { ref, reactive, computed } from 'vue';
import { useUserManagementStore } from '@/stores/userManagement';
import type { User } from '@/services/userService';
import Overlay from '../../Overlay.vue';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const userManagementStore = useUserManagementStore();

// Form data
const form = reactive({
  newPassword: '',
  confirmPassword: '',
});

const errors = reactive<Record<string, string>>({});
const showPassword = ref(false);
const loading = computed(() => userManagementStore.loading);

// Validation
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // New password validation
  if (!form.newPassword) {
    newErrors.newPassword = 'New password is required';
  } else if (form.newPassword.length < 8) {
    newErrors.newPassword = 'Password must be at least 8 characters long';
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your new password';
  } else if (form.newPassword !== form.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
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
    const result = await userManagementStore.changePassword(
      props.user.id,
      form.newPassword
    );

    if (result) {
      emit('updated');
    }
  } catch (error) {
    console.error('Error changing password:', error);
  }
};
</script>

<style scoped>
/* Change password modal styles are now globally available via main.ts */
</style>
