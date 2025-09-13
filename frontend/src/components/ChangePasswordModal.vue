<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-key me-2"></i>
            Change Password
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
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              <strong>Changing password for:</strong> {{ user.firstName }}
              {{ user.lastName }} ({{ user.email }})
            </div>

            <div class="mb-3">
              <label for="newPassword" class="form-label">New Password *</label>
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  id="newPassword"
                  v-model="form.newPassword"
                  :class="{ 'is-invalid': errors.newPassword }"
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
              <div v-if="errors.newPassword" class="invalid-feedback">
                {{ errors.newPassword }}
              </div>
              <div class="form-text">
                Password must be at least 8 characters long
              </div>
            </div>

            <div class="mb-3">
              <label for="confirmPassword" class="form-label"
                >Confirm New Password *</label
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

            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Warning:</strong> Changing the password will log out the
              user from all devices. They will need to log in again with the new
              password.
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
            <button type="submit" class="btn btn-warning" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              <i v-else class="fas fa-key me-2"></i>
              {{ loading ? 'Changing...' : 'Change Password' }}
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
import type { User } from '@/services/userService';

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
.modal {
  z-index: 1055;
}

.modal-dialog {
  max-width: 500px;
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
</style>
