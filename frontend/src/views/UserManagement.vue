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
            <label class="form-label">Filter by Role</label>
            <select
              class="form-select"
              v-model="selectedRole"
              @change="handleRoleFilter"
            >
              <option value="">All Roles</option>
              <option
                v-for="role in userRoles"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">Filter by Status</label>
            <select
              class="form-select"
              v-model="selectedStatus"
              @change="handleStatusFilter"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
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

    <!-- Bulk Actions -->
    <div class="card mb-6" v-if="selectedUsers.length > 0">
      <div class="card-body">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            <i class="fas fa-check-circle mr-2"></i>
            {{ selectedUsers.length }} user(s) selected
          </span>
          <div class="flex space-x-2">
            <button
              class="btn-primary text-sm px-3 py-1"
              @click="bulkActivate"
              :disabled="loading"
            >
              <i class="fas fa-user-check mr-1"></i>
              Activate
            </button>
            <button
              class="btn-outline-warning text-sm px-3 py-1"
              @click="bulkDeactivate"
              :disabled="loading"
            >
              <i class="fas fa-user-times mr-1"></i>
              Deactivate
            </button>
            <button
              class="btn-outline-secondary text-sm px-3 py-1"
              @click="deselectAllUsers"
            >
              <i class="fas fa-times mr-1"></i>
              Deselect All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-header">
        <div class="flex justify-between items-center">
          <h5 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-users mr-2"></i>
            Users ({{ pagination.total }})
          </h5>
          <div class="flex items-center space-x-3">
            <button
              class="btn-outline-primary text-sm px-3 py-1"
              @click="selectAllUsers"
              :disabled="users.length === 0"
            >
              <i class="fas fa-check-square mr-1"></i>
              Select All
            </button>
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
                @click="changePageSize(25)"
                :class="{
                  'bg-primary-500 text-white': pagination.limit === 25,
                }"
              >
                25
              </button>
              <button
                class="px-3 py-1 text-sm hover:bg-gray-50"
                @click="changePageSize(50)"
                :class="{
                  'bg-primary-500 text-white': pagination.limit === 50,
                }"
              >
                50
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="w-12">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="
                    selectedUsers.length === users.length && users.length > 0
                  "
                  @change="toggleSelectAll"
                />
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
              <th class="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-8">
                <div class="spinner-border text-primary-500" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500">
                <i class="fas fa-users text-4xl mb-4 block"></i>
                No users found
              </td>
            </tr>
            <tr
              v-else
              v-for="user in users"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td>
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="selectedUsers.includes(user.id)"
                  @change="toggleUserSelection(user.id)"
                />
              </td>
              <td>
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3"
                  >
                    <i class="fas fa-user-circle text-gray-600 text-xl"></i>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.email }}
                    </div>
                    <div class="text-sm text-gray-500">
                      @{{ user.username }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="user.isActive ? 'bg-success' : 'bg-danger'"
                >
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <span v-if="user.lastLoginAt" class="text-gray-500">
                  {{ formatDate(user.lastLoginAt) }}
                </span>
                <span v-else class="text-gray-500">Never</span>
              </td>
              <td>
                <span class="text-gray-500">{{
                  formatDate(user.createdAt)
                }}</span>
              </td>
              <td>
                <div class="flex space-x-1">
                  <button
                    class="btn-outline-primary p-2"
                    @click="viewUser(user)"
                    title="View User"
                  >
                    <i class="fas fa-eye text-sm"></i>
                  </button>
                  <button
                    class="btn-outline-secondary p-2"
                    @click="editUser(user)"
                    :disabled="!canEditUser(user)"
                    title="Edit User"
                  >
                    <i class="fas fa-edit text-sm"></i>
                  </button>
                  <button
                    class="btn-outline-warning p-2"
                    @click="changeUserPassword(user)"
                    :disabled="!canEditUser(user)"
                    title="Change Password"
                  >
                    <i class="fas fa-key text-sm"></i>
                  </button>
                  <button
                    class="btn-outline-danger p-2"
                    @click="deleteUser(user)"
                    :disabled="!canDeleteUser(user)"
                    title="Delete User"
                  >
                    <i class="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer" v-if="pagination.totalPages > 1">
        <div class="flex justify-between items-center">
          <div class="text-gray-600">
            Showing
            {{ (pagination.page - 1) * pagination.limit + 1 }} to
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
            of {{ pagination.total }} users
          </div>
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ disabled: pagination.page === 1 }"
              >
                <button
                  class="page-link"
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                >
                  Previous
                </button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === pagination.page }"
              >
                <button class="page-link" @click="changePage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled: pagination.page === pagination.totalPages,
                }"
              >
                <button
                  class="page-link"
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page === pagination.totalPages"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

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
import CreateUserModal from '@/components/CreateUserModal.vue';
import EditUserModal from '@/components/EditUserModal.vue';
import ChangePasswordModal from '@/components/ChangePasswordModal.vue';
import ViewUserModal from '@/components/ViewUserModal.vue';
import MainLayout from '@/components/MainLayout.vue';

const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();

// Reactive data
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const showViewModal = ref(false);
const selectedUser = ref<User | null>(null);
const searchTerm = ref('');
const selectedRole = ref('');
const selectedStatus = ref('');

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

const handleRoleFilter = () => {
  userManagementStore.filterByRole(selectedRole.value);
};

const handleStatusFilter = () => {
  if (selectedStatus.value === '') {
    // Clear status filter by fetching all users
    userManagementStore.fetchUsers({ page: 1 });
  } else {
    const isActive = selectedStatus.value === 'true';
    userManagementStore.filterByStatus(isActive);
  }
};

const clearFilters = async () => {
  searchTerm.value = '';
  selectedRole.value = '';
  selectedStatus.value = '';
  await userManagementStore.clearFilters();
};

const changePage = (page: number | string) => {
  userManagementStore.fetchUsers({ page: Number(page) });
};

const changePageSize = (limit: number) => {
  userManagementStore.fetchUsers({ limit, page: 1 });
};

const toggleSelectAll = () => {
  if (selectedUsers.value.length === users.value.length) {
    userManagementStore.deselectAllUsers();
  } else {
    userManagementStore.selectAllUsers();
  }
};

const toggleUserSelection = (id: string) => {
  userManagementStore.toggleUserSelection(id);
};

const selectAllUsers = () => {
  userManagementStore.selectAllUsers();
};

const deselectAllUsers = () => {
  userManagementStore.deselectAllUsers();
};

const bulkActivate = async () => {
  await userManagementStore.bulkActivateUsers(selectedUsers.value);
  deselectAllUsers();
};

const bulkDeactivate = async () => {
  await userManagementStore.bulkDeactivateUsers(selectedUsers.value);
  deselectAllUsers();
};

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

// Utility functions
const getRoleLabel = (role: UserRole) => {
  const roleObj = userRoles.value.find((r) => r.value === role);
  return roleObj ? roleObj.label : role;
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Lifecycle
onMounted(async () => {
  await refreshUsers();
});
</script>
