<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!-- Background overlay -->
      <Overlay @close="$emit('close')" />

      <!-- Modal panel -->
      <div
        class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
      >
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <i class="fas fa-user text-indigo-600"></i>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                User Details
              </h3>
              <button
                type="button"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                @click="$emit('close')"
              >
                <i class="fas fa-times"></i>
              </button>
              <div class="space-y-6">
                <div class="text-center">
                  <div
                    class="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <i class="fas fa-user-circle text-5xl text-gray-400"></i>
                  </div>
                  <h4 class="mt-4 text-xl font-semibold text-gray-900">
                    {{ user.firstName }} {{ user.lastName }}
                  </h4>
                  <p class="text-gray-600">{{ user.email }}</p>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-2"
                    :class="getRoleBadgeClass(user.role)"
                  >
                    {{ getRoleLabel(user.role) }}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >Username</label
                      >
                      <p class="mt-1 text-sm text-gray-900">
                        @{{ user.username }}
                      </p>
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

                  <div class="space-y-4">
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
                        {{
                          user.lastLoginAt
                            ? formatDate(user.lastLoginAt)
                            : 'Never'
                        }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >User ID</label
                      >
                      <p class="mt-1 text-xs text-gray-500">
                        {{ user.id }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Role Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h6 class="text-lg font-medium text-gray-900 mb-4">
                  <i class="fas fa-shield-alt mr-2"></i>
                  Role Information
                </h6>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 class="text-sm font-medium text-gray-700">
                      Role Description
                    </h6>
                    <p class="mt-1 text-sm text-gray-600">
                      {{ getRoleDescription(user.role) }}
                    </p>
                  </div>
                  <div>
                    <h6 class="text-sm font-medium text-gray-700">
                      Permissions
                    </h6>
                    <ul class="mt-1 space-y-1">
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

              <!-- Activity Summary -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h6 class="text-lg font-medium text-gray-900 mb-4">
                  <i class="fas fa-chart-line mr-2"></i>
                  Activity Summary
                </h6>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div class="bg-white rounded-lg p-4">
                    <h4 class="text-2xl font-bold text-indigo-600">
                      {{ getDaysSinceCreated() }}
                    </h4>
                    <p class="text-sm text-gray-600">Days Active</p>
                  </div>
                  <div class="bg-white rounded-lg p-4">
                    <h4
                      class="text-2xl font-bold"
                      :class="user.isActive ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ user.isActive ? 'Yes' : 'No' }}
                    </h4>
                    <p class="text-sm text-gray-600">Currently Active</p>
                  </div>
                  <div class="bg-white rounded-lg p-4">
                    <h4 class="text-2xl font-bold text-blue-600">
                      {{ getLastLoginDays() }}
                    </h4>
                    <p class="text-sm text-gray-600">Days Since Last Login</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserRole } from '@/services/userService';
import Overlay from '../../Overlay.vue';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  close: [];
}>();

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
    SUPER_ADMIN: 'bg-danger',
    CENTRAL_COMMAND_ADMIN: 'bg-warning',
    CENTRAL_COMMAND_USER: 'bg-info',
    PRESIDENTIAL_ELECTION_OBSERVER: 'bg-primary',
    PARLIAMENTARY_ELECTION_OBSERVER: 'bg-primary',
    LOCAL_GOVERNMENT_ELECTION_OBSERVER: 'bg-primary',
    SENATORIAL_ELECTION_OBSERVER: 'bg-primary',
    GUBERNATORIAL_ELECTION_OBSERVER: 'bg-primary',
    COUNTY_LEVEL_SUPERVISOR: 'bg-success',
    CONSTITUENCY_LEVEL_SUPERVISOR: 'bg-success',
    COUNTY_ASSEMBLY_WARD_SUPERVISOR: 'bg-success',
  };
  return classes[role] || 'bg-secondary';
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
  const created = new Date(props.user.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getLastLoginDays = () => {
  if (!props.user.lastLoginAt) return 'Never';
  const lastLogin = new Date(props.user.lastLoginAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
</script>

<style scoped>
/* View user modal styles are now globally available via main.ts */
</style>
