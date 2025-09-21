<template>
  <MainLayout
    page-title="User Management"
    page-subtitle="Manage system users and permissions"
  >
    <!-- Action Buttons -->
    <div class="flex justify-end mb-6">
      <div class="flex space-x-3">
        <button
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          @click="showCreateModal = true"
          :disabled="!canCreateUser"
        >
          <i class="fas fa-plus mr-2"></i>
          Add User
        </button>
        <button
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          @click="refreshUsers"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      v-if="stats"
    >
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center ring-1 ring-blue-100"
            >
              <i class="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.totalUsers }}
            </h3>
            <p class="text-sm text-gray-600 font-medium">Total Users</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center ring-1 ring-green-100"
            >
              <i class="fas fa-user-check text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.activeUsers }}
            </h3>
            <p class="text-sm text-gray-600 font-medium">Active Users</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center ring-1 ring-red-100"
            >
              <i class="fas fa-user-times text-red-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.inactiveUsers }}
            </h3>
            <p class="text-sm text-gray-600 font-medium">Inactive Users</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center ring-1 ring-purple-100"
            >
              <i class="fas fa-user-plus text-purple-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.recentUsers.length }}
            </h3>
            <p class="text-sm text-gray-600 font-medium">Recent Users</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col">
            <label class="block text-sm font-semibold text-gray-700 mb-[12px]"
              >Search Users</label
            >
            <div class="relative flex-1">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                class="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Search by name, email, or username..."
                v-model="searchTerm"
                @input="handleSearch"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="space-y-0">
              <FormSelect
                v-model="selectedRoleOption"
                :options="roleOptions"
                label="Filter by Role"
                placeholder="All Roles"
                button-class="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                @change="handleRoleFilterChange"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="space-y-0">
              <FormSelect
                v-model="selectedStatusOption"
                :options="statusOptions"
                label="Filter by Status"
                placeholder="All Status"
                button-class="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                @change="handleStatusFilterChange"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <label class="block text-sm font-semibold text-gray-700 mb-[12px]"
              >&nbsp;</label
            >
            <button
              class="w-full h-12 inline-flex items-center justify-center px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              @click="clearFilters"
            >
              <i class="fas fa-times mr-2"></i>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <BulkTable
      :users="users"
      :pagination="pagination"
      :loading="loading"
      :can-edit-user="canEditUser"
      :can-delete-user="canDeleteUser"
      :can-bulk-activate="canBulkActivate"
      :can-bulk-deactivate="canBulkDeactivate"
      :can-bulk-delete="canBulkDelete"
      title="Users"
      :subtitle="`${pagination.total} users in your account`"
      @action="handleUserAction"
      @bulk-action="handleBulkAction"
      @page-change="changePage"
      @selection-change="handleSelectionChange"
    >
      <!-- Header Actions -->
      <template #header-actions>
        <div class="flex items-center space-x-3">
          <div class="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              class="px-3 py-2 text-sm font-medium border-r border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 transition-colors duration-200"
              @click="changePageSize(10)"
              :class="{
                'bg-indigo-600 text-white hover:bg-indigo-700':
                  pagination.limit === 10,
                'bg-white text-gray-700': pagination.limit !== 10,
              }"
            >
              10
            </button>
            <button
              class="px-3 py-2 text-sm font-medium border-r border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 transition-colors duration-200"
              @click="changePageSize(20)"
              :class="{
                'bg-indigo-600 text-white hover:bg-indigo-700':
                  pagination.limit === 20,
                'bg-white text-gray-700': pagination.limit !== 20,
              }"
            >
              20
            </button>
            <button
              class="px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 transition-colors duration-200"
              @click="changePageSize(50)"
              :class="{
                'bg-indigo-600 text-white hover:bg-indigo-700':
                  pagination.limit === 50,
                'bg-white text-gray-700': pagination.limit !== 50,
              }"
            >
              50
            </button>
          </div>
        </div>
      </template>
    </BulkTable>

    <!-- Create User Modal -->
    <CreateUserModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />

    <!-- Edit User Modal -->
    <EditUserModal
      v-if="showEditModal && selectedUser"
      :user="selectedUser"
      @close="showEditModal = false"
      @updated="handleUserUpdated"
    />

    <!-- Change Password Modal -->
    <ChangePasswordModal
      v-if="showPasswordModal && selectedUser"
      :user="selectedUser"
      @close="showPasswordModal = false"
      @updated="handlePasswordChanged"
    />

    <!-- View User Modal -->
    <ViewUserModal
      v-if="showViewModal && selectedUser"
      :user="selectedUser"
      @close="showViewModal = false"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserManagementStore } from '@/stores/userManagement';
import type { User, UserRole } from '@/services/userService';
import CreateUserModal from '@/components/pages/users/CreateUserModal.vue';
import EditUserModal from '@/components/pages/users/EditUserModal.vue';
import ChangePasswordModal from '@/components/pages/users/ChangePasswordModal.vue';
import ViewUserModal from '@/components/pages/users/ViewUserModal.vue';
import MainLayout from '@/components/MainLayout.vue';
import { FormSelect, type SelectOption } from '@/components/select';
import { BulkTable } from '@/components/table';

const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();

// Reactive data
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const showViewModal = ref(false);
const selectedUser = ref<User | null>(null);
const searchTerm = ref('');
const selectedRoleOption = ref<SelectOption | null>(null);
const selectedStatusOption = ref<SelectOption | null>(null);

// Computed properties
const user = computed(() => authStore.user);
const users = computed(() => userManagementStore.users);
const stats = computed(() => userManagementStore.stats);
const loading = computed(() => userManagementStore.loading);
const pagination = computed(() => userManagementStore.pagination);
const selectedUsers = computed(() => userManagementStore.selectedUsers);

// User roles for dropdown
const userRoles = computed(() => [
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
]);

// Options for select components
const roleOptions = computed<SelectOption[]>(() => [
  { id: '', label: 'All Roles' },
  ...userRoles.value.map((role) => ({
    id: role.value,
    label: role.label,
    value: role.value,
  })),
]);

const statusOptions = computed<SelectOption[]>(() => [
  { id: '', label: 'All Status' },
  { id: 'true', label: 'Active', value: 'true' },
  { id: 'false', label: 'Inactive', value: 'false' },
]);

// Permission checks
const canCreateUser = computed(() => {
  return (
    user.value?.role === 'SUPER_ADMIN' ||
    user.value?.role === 'CENTRAL_COMMAND_ADMIN'
  );
});

const canEditUser = (targetUser: User) => {
  if (!user.value) return false;
  if (user.value.role === 'SUPER_ADMIN') return true;
  if (user.value.role === 'CENTRAL_COMMAND_ADMIN') return true;
  if (user.value.role === 'CENTRAL_COMMAND_USER') return true;
  return false;
};

const canDeleteUser = (targetUser: User) => {
  if (!user.value) return false;
  if (user.value.role !== 'SUPER_ADMIN') return false;
  if (targetUser.id === user.value.id) return false; // Can't delete self
  return true;
};

// Bulk operation permissions
const canBulkActivate = computed(() => {
  return (
    user.value?.role === 'SUPER_ADMIN' ||
    user.value?.role === 'CENTRAL_COMMAND_ADMIN'
  );
});

const canBulkDeactivate = computed(() => {
  return (
    user.value?.role === 'SUPER_ADMIN' ||
    user.value?.role === 'CENTRAL_COMMAND_ADMIN'
  );
});

const canBulkDelete = computed(() => {
  return user.value?.role === 'SUPER_ADMIN';
});

// Pagination
const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const current = pagination.value.page;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total);
  } else if (total > 1) {
    rangeWithDots.push(total);
  }

  return rangeWithDots;
});

// Methods
const refreshUsers = async () => {
  await userManagementStore.fetchUsers();
  await userManagementStore.fetchStats();
};

const handleSearch = () => {
  userManagementStore.searchUsers(searchTerm.value);
};

const handleRoleFilterChange = (option: SelectOption | null) => {
  const roleValue = option?.value || '';
  userManagementStore.filterByRole(roleValue);
};

const handleStatusFilterChange = (option: SelectOption | null) => {
  if (!option || option.value === '') {
    // Clear status filter by fetching all users
    userManagementStore.fetchUsers({ page: 1 });
  } else {
    const isActive = option.value === 'true';
    userManagementStore.filterByStatus(isActive);
  }
};

const clearFilters = async () => {
  searchTerm.value = '';
  selectedRoleOption.value = null;
  selectedStatusOption.value = null;
  await userManagementStore.clearFilters();
};

const changePage = (page: number | string) => {
  userManagementStore.fetchUsers({ page: Number(page) });
};

const changePageSize = (limit: number) => {
  userManagementStore.fetchUsers({ limit, page: 1 });
};

// Note: Selection management is now handled by the BulkTable component

const viewUser = (user: User) => {
  selectedUser.value = user;
  showViewModal.value = true;
};

const editUser = (user: User) => {
  selectedUser.value = user;
  showEditModal.value = true;
};

const changeUserPassword = (user: User) => {
  selectedUser.value = user;
  showPasswordModal.value = true;
};

const deleteUser = async (user: User) => {
  if (
    confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
    )
  ) {
    await userManagementStore.deleteUser(user.id);
  }
};

const handleUserCreated = () => {
  showCreateModal.value = false;
  refreshUsers();
};

const handleUserUpdated = () => {
  showEditModal.value = false;
  selectedUser.value = null;
  refreshUsers();
};

const handlePasswordChanged = () => {
  showPasswordModal.value = false;
  selectedUser.value = null;
};

const handleUserAction = (action: string, user: User, index: number) => {
  switch (action) {
    case 'view':
      viewUser(user);
      break;
    case 'edit':
      editUser(user);
      break;
    case 'password':
      changeUserPassword(user);
      break;
    case 'delete':
      deleteUser(user);
      break;
  }
};

const handleBulkAction = async (action: string, selectedUsers: User[]) => {
  const selectedUserIds = selectedUsers.map((user) => user.id);

  switch (action) {
    case 'activate':
      await userManagementStore.bulkActivateUsers(selectedUserIds);
      break;
    case 'deactivate':
      await userManagementStore.bulkDeactivateUsers(selectedUserIds);
      break;
    case 'delete':
      if (
        confirm(
          `Are you sure you want to delete ${selectedUsers.length} users?`
        )
      ) {
        // For now, delete users one by one since bulkDeleteUsers doesn't exist
        for (const user of selectedUsers) {
          await userManagementStore.deleteUser(user.id);
        }
      }
      break;
  }
};

const handleSelectionChange = (selectedUsers: User[]) => {
  // Update the store with the selected user IDs
  const selectedUserIds = selectedUsers.map((user) => user.id);
  userManagementStore.selectedUsers = selectedUserIds;
};

// Utility functions (kept for compatibility with other parts of the component)
const getRoleLabel = (role: UserRole) => {
  const roleObj = userRoles.value.find((r) => r.value === role);
  return roleObj ? roleObj.label : role;
};

// Lifecycle
onMounted(async () => {
  await refreshUsers();
});
</script>

<style scoped>
/* Override FormSelect spacing to align with other elements */
.space-y-0 :deep(.space-y-1) {
  gap: 0;
}

.space-y-0 :deep(.mt-2) {
  margin-top: 0.5rem; /* 8px - same as mb-2 on labels */
}

.space-y-0 :deep(.space-y-1 > div) {
  margin-top: 0;
}
</style>
