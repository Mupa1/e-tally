<template>
  <MainLayout
    page-title="User Management"
    page-subtitle="Manage system users and permissions"
  >
    <!-- Action Buttons -->
    <div class="flex justify-end mb-6">
      <div class="flex space-x-3">
        <button
          class="btn-outline-primary"
          @click="showCreateModal = true"
          :disabled="!canCreateUser"
        >
          <i class="fas fa-plus mr-2"></i>
          Add User
        </button>
        <button
          class="btn-outline-secondary"
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
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.totalUsers }}
            </h3>
            <p class="text-gray-600">Total Users</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-user-check text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.activeUsers }}
            </h3>
            <p class="text-gray-600">Active Users</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-user-times text-red-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.inactiveUsers }}
            </h3>
            <p class="text-gray-600">Inactive Users</p>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-user-plus text-purple-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ stats.recentUsers.length }}
            </h3>
            <p class="text-gray-600">Recent Users</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="form-label">Search Users</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                class="form-control pl-10"
                placeholder="Search by name, email, or username..."
                v-model="searchTerm"
                @input="handleSearch"
              />
            </div>
          </div>
          <div>
            <FormSelect
              v-model="selectedRoleOption"
              :options="roleOptions"
              label="Filter by Role"
              placeholder="All Roles"
              @change="handleRoleFilterChange"
            />
          </div>
          <div>
            <FormSelect
              v-model="selectedStatusOption"
              :options="statusOptions"
              label="Filter by Status"
              placeholder="All Status"
              @change="handleStatusFilterChange"
            />
          </div>
          <div>
            <label class="form-label">&nbsp;</label>
            <button class="btn-outline-secondary w-full" @click="clearFilters">
              <i class="fas fa-times mr-2"></i>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <UserBulkTable
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
          <div class="flex border border-gray-300 rounded-md">
            <button
              class="px-3 py-1 text-sm border-r border-gray-300 hover:bg-gray-50"
              @click="changePageSize(10)"
              :class="{
                'bg-primary-500 text-white': pagination.limit === 10,
              }"
            >
              10
            </button>
            <button
              class="px-3 py-1 text-sm border-r border-gray-300 hover:bg-gray-50"
              @click="changePageSize(20)"
              :class="{
                'bg-primary-500 text-white': pagination.limit === 20,
              }"
            >
              20
            </button>
            <button
              class="px-3 py-1 text-sm border-r border-gray-300 hover:bg-gray-50"
              @click="changePageSize(50)"
              :class="{
                'bg-primary-500 text-white': pagination.limit === 50,
              }"
            >
              50
            </button>
          </div>
        </div>
      </template>
    </UserBulkTable>

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
import { UserBulkTable } from '@/components/table';

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

// Note: Selection management is now handled by the UserBulkTable component

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
