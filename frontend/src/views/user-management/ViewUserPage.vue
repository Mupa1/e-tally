<template>
  <MainLayout
    page-title="User Details"
    page-subtitle="View and manage user information"
  >
    <!-- Error Alert -->
    <div
      v-if="error"
      class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-600 mr-3"></i>
        <span class="text-red-800 font-medium">{{ error }}</span>
        <button
          type="button"
          @click="error = null"
          class="ml-auto text-red-400 hover:text-red-600 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingState v-if="loading" message="Loading user details..." />

    <!-- User Details -->
    <div v-else-if="user" class="space-y-6">
      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <router-link
            to="/users"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Users
          </router-link>
        </div>
        <div class="flex items-center space-x-3">
          <Button
            text="Edit User"
            icon="fas fa-edit"
            icon-position="left"
            variant="secondary"
            size="md"
            :disabled="!canEditUser"
            @click="handleEdit"
          />
          <Button
            text="Delete User"
            icon="fas fa-trash"
            icon-position="left"
            variant="danger"
            size="md"
            :disabled="!canDeleteUser"
            @click="handleDelete"
          />
        </div>
      </div>

      <!-- User Profile Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-8">
          <div class="text-center">
            <div
              class="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6"
            >
              <i class="fas fa-user-circle text-6xl text-gray-400"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ user.firstName }} {{ user.lastName }}
            </h1>
            <p class="text-lg text-gray-600 mb-4">{{ user.email }}</p>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
              :class="getRoleBadgeClass(user.role)"
            >
              {{ getRoleLabel(user.role) }}
            </span>
          </div>
        </div>
      </div>

      <!-- User Information Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              <i class="fas fa-user mr-2"></i>
              Basic Information
            </h3>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Username</label
              >
              <p class="mt-1 text-sm text-gray-900">@{{ user.username }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Status</label
              >
              <p class="mt-1">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Phone Number</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ user.phoneNumber || 'Not provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >IMEI</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ user.imei || 'Not provided' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              <i class="fas fa-clock mr-2"></i>
              Account Information
            </h3>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Created</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ formatDate(user.createdAt) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Last Updated</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ formatDate(user.updatedAt) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Last Login</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >User ID</label
              >
              <p class="mt-1 text-xs text-gray-500 font-mono">
                {{ user.id }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Role Information -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            <i class="fas fa-shield-alt mr-2"></i>
            Role Information
          </h3>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Role Description
              </h4>
              <p class="text-sm text-gray-600">
                {{ getRoleDescription(user.role) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Permissions
              </h4>
              <ul class="space-y-1">
                <li
                  v-for="permission in getRolePermissions(user.role)"
                  :key="permission"
                  class="flex items-center text-sm text-gray-600"
                >
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  {{ permission }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Summary -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            <i class="fas fa-chart-line mr-2"></i>
            Activity Summary
          </h3>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-3xl font-bold text-indigo-600 mb-2">
                {{ getDaysSinceCreated() }}
              </h4>
              <p class="text-sm text-gray-600">Days Active</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-6">
              <h4
                class="text-3xl font-bold mb-2"
                :class="user.isActive ? 'text-green-600' : 'text-red-600'"
              >
                {{ user.isActive ? 'Yes' : 'No' }}
              </h4>
              <p class="text-sm text-gray-600">Currently Active</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-3xl font-bold text-blue-600 mb-2">
                {{ getLastLoginDays() }}
              </h4>
              <p class="text-sm text-gray-600">Days Since Last Login</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Not Found -->
    <div v-else class="text-center py-12">
      <i class="fas fa-user-slash text-6xl text-gray-400 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
      <p class="text-gray-600 mb-6">
        The user you're looking for doesn't exist or has been deleted.
      </p>
      <router-link
        to="/users"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Users
      </router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <ActionConfirmation
      :show="showDeleteConfirmation"
      title="Delete User"
      :message="`Are you sure you want to delete ${user?.firstName} ${user?.lastName}? This action cannot be undone.`"
      confirm-text="Delete"
      action-type="delete"
      :loading="deleteLoading"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserManagementStore } from '@/stores/userManagement';
import { useAuthStore } from '@/stores/auth';
import type { User, UserRole } from '@/services/userService';
import MainLayout from '@/components/MainLayout.vue';
import Button from '@/components/Button.vue';
import ActionConfirmation from '@/components/ActionConfirmation.vue';
import { LoadingState } from '@/components';

const route = useRoute();
const router = useRouter();
const userManagementStore = useUserManagementStore();
const authStore = useAuthStore();

// Reactive data
const user = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showDeleteConfirmation = ref(false);
const deleteLoading = ref(false);

// Computed properties
const currentUser = computed(() => authStore.user);

const canEditUser = computed(() => {
  if (!currentUser.value || !user.value) return false;
  if (currentUser.value.role === 'SUPER_ADMIN') return true;
  if (currentUser.value.role === 'CENTRAL_COMMAND_ADMIN') return true;
  return false;
});

const canDeleteUser = computed(() => {
  if (!currentUser.value || !user.value) return false;
  if (currentUser.value.role === 'SUPER_ADMIN') return true;
  if (currentUser.value.role === 'CENTRAL_COMMAND_ADMIN') return true;
  return false;
});

// User roles with descriptions
const userRoles = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description:
      'Full system access with all administrative privileges. Can manage all users, roles, and system settings.',
    permissions: [
      'Manage all users',
      'Assign any role',
      'Delete users',
      'Access all data',
      'System configuration',
      'Audit logs access',
    ],
  },
  CENTRAL_COMMAND_ADMIN: {
    label: 'Central Command Admin',
    description:
      'Administrative access to central command functions. Can manage users and oversee election operations.',
    permissions: [
      'Manage users (except SUPER_ADMIN)',
      'Assign most roles',
      'Oversee elections',
      'Access reports',
      'Manage locations',
    ],
  },
  CENTRAL_COMMAND_USER: {
    label: 'Central Command User',
    description:
      'Central command user with limited administrative access. Can view and manage basic user information.',
    permissions: [
      'View user information',
      'Change user passwords',
      'Activate/deactivate users',
      'Access basic reports',
    ],
  },
  PRESIDENTIAL_ELECTION_OBSERVER: {
    label: 'Presidential Election Observer',
    description:
      'Observer for presidential elections with access to relevant polling stations and results.',
    permissions: [
      'View presidential election data',
      'Report incidents',
      'Access assigned polling stations',
      'Submit observations',
    ],
  },
  PARLIAMENTARY_ELECTION_OBSERVER: {
    label: 'Parliamentary Election Observer',
    description:
      'Observer for parliamentary elections with access to constituency-level data.',
    permissions: [
      'View parliamentary election data',
      'Report incidents',
      'Access assigned constituencies',
      'Submit observations',
    ],
  },
  LOCAL_GOVERNMENT_ELECTION_OBSERVER: {
    label: 'Local Government Election Observer',
    description:
      'Observer for local government elections with access to ward-level data.',
    permissions: [
      'View local government election data',
      'Report incidents',
      'Access assigned wards',
      'Submit observations',
    ],
  },
  SENATORIAL_ELECTION_OBSERVER: {
    label: 'Senatorial Election Observer',
    description:
      'Observer for senatorial elections with access to county-level data.',
    permissions: [
      'View senatorial election data',
      'Report incidents',
      'Access assigned counties',
      'Submit observations',
    ],
  },
  GUBERNATORIAL_ELECTION_OBSERVER: {
    label: 'Gubernatorial Election Observer',
    description:
      'Observer for gubernatorial elections with access to county-level data.',
    permissions: [
      'View gubernatorial election data',
      'Report incidents',
      'Access assigned counties',
      'Submit observations',
    ],
  },
  COUNTY_LEVEL_SUPERVISOR: {
    label: 'County Level Supervisor',
    description:
      'Supervisor responsible for overseeing election operations at the county level.',
    permissions: [
      'Supervise county operations',
      'Manage polling stations',
      'Review reports',
      'Coordinate observers',
    ],
  },
  CONSTITUENCY_LEVEL_SUPERVISOR: {
    label: 'Constituency Level Supervisor',
    description:
      'Supervisor responsible for overseeing election operations at the constituency level.',
    permissions: [
      'Supervise constituency operations',
      'Manage polling stations',
      'Review reports',
      'Coordinate observers',
    ],
  },
  COUNTY_ASSEMBLY_WARD_SUPERVISOR: {
    label: 'County Assembly Ward Supervisor',
    description:
      'Supervisor responsible for overseeing election operations at the ward level.',
    permissions: [
      'Supervise ward operations',
      'Manage polling stations',
      'Review reports',
      'Coordinate observers',
    ],
  },
};

// Utility functions
const getRoleLabel = (role: UserRole) => {
  return userRoles[role]?.label || role;
};

const getRoleDescription = (role: UserRole) => {
  return userRoles[role]?.description || 'No description available';
};

const getRolePermissions = (role: UserRole) => {
  return userRoles[role]?.permissions || [];
};

const getRoleBadgeClass = (role: UserRole) => {
  const classes = {
    SUPER_ADMIN: 'bg-red-100 text-red-800',
    CENTRAL_COMMAND_ADMIN: 'bg-yellow-100 text-yellow-800',
    CENTRAL_COMMAND_USER: 'bg-blue-100 text-blue-800',
    PRESIDENTIAL_ELECTION_OBSERVER: 'bg-purple-100 text-purple-800',
    PARLIAMENTARY_ELECTION_OBSERVER: 'bg-purple-100 text-purple-800',
    LOCAL_GOVERNMENT_ELECTION_OBSERVER: 'bg-purple-100 text-purple-800',
    SENATORIAL_ELECTION_OBSERVER: 'bg-purple-100 text-purple-800',
    GUBERNATORIAL_ELECTION_OBSERVER: 'bg-purple-100 text-purple-800',
    COUNTY_LEVEL_SUPERVISOR: 'bg-green-100 text-green-800',
    CONSTITUENCY_LEVEL_SUPERVISOR: 'bg-green-100 text-green-800',
    COUNTY_ASSEMBLY_WARD_SUPERVISOR: 'bg-green-100 text-green-800',
  };
  return classes[role] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDaysSinceCreated = () => {
  if (!user.value) return 0;
  const created = new Date(user.value.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getLastLoginDays = () => {
  if (!user.value || !user.value.lastLoginAt) return 'Never';
  const lastLogin = new Date(user.value.lastLoginAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Methods
const fetchUser = async () => {
  try {
    loading.value = true;
    error.value = null;

    const userId = route.params.id as string;
    if (!userId) {
      error.value = 'User ID is required';
      return;
    }

    // Fetch user from the store or API
    await userManagementStore.fetchUsers({ page: 1, limit: 1000 });
    const foundUser = userManagementStore.users.find((u) => u.id === userId);

    if (foundUser) {
      user.value = foundUser;
    } else {
      error.value = 'User not found';
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    error.value = 'Failed to load user details';
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  if (user.value) {
    // For now, navigate back to user management where edit can be handled
    router.push('/users');
  }
};

const handleDelete = () => {
  showDeleteConfirmation.value = true;
};

const handleDeleteConfirm = async () => {
  if (!user.value) return;

  try {
    deleteLoading.value = true;
    await userManagementStore.deleteUser(user.value.id);
    router.push('/users');
  } catch (err) {
    console.error('Error deleting user:', err);
    error.value = 'Failed to delete user';
  } finally {
    deleteLoading.value = false;
    showDeleteConfirmation.value = false;
  }
};

const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false;
};

// Lifecycle
onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
