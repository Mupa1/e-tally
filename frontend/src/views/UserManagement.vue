<template>
  <div class="user-management-page">
    <!-- Top Navigation Bar -->
    <TopBar />

    <!-- Main Content -->
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <AppSidebar />

        <!-- Main Content Area -->
        <div class="col-md-9 col-lg-10 main-content">
          <div class="content-wrapper">
            <!-- Page Header -->
            <div class="page-header">
              <h1 class="page-title">User Management</h1>
              <p class="page-subtitle">Manage system users and permissions</p>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-end mb-4">
              <div class="header-actions">
                <button
                  class="btn btn-outline-primary me-2"
                  @click="showCreateModal = true"
                  :disabled="!canCreateUser"
                >
                  <i class="fas fa-plus me-1"></i>
                  Add User
                </button>
                <button
                  class="btn btn-outline-secondary"
                  @click="refreshUsers"
                  :disabled="loading"
                >
                  <i
                    class="fas fa-sync-alt me-1"
                    :class="{ 'fa-spin': loading }"
                  ></i>
                  Refresh
                </button>
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="row mb-4" v-if="stats">
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.totalUsers }}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-user-check"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.activeUsers }}</h3>
                    <p>Active Users</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-user-times"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.inactiveUsers }}</h3>
                    <p>Inactive Users</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-user-plus"></i>
                  </div>
                  <div class="stat-content">
                    <h3>{{ stats.recentUsers.length }}</h3>
                    <p>Recent Users</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filters and Search -->
            <div class="card mb-4">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Search Users</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Search by name, email, or username..."
                        v-model="searchTerm"
                        @input="handleSearch"
                      />
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
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
                  <div class="col-md-3 mb-3">
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
                  <div class="col-md-2 mb-3">
                    <label class="form-label">&nbsp;</label>
                    <button
                      class="btn btn-outline-secondary w-100"
                      @click="clearFilters"
                    >
                      <i class="fas fa-times me-1"></i>
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bulk Actions -->
            <div class="card mb-4" v-if="selectedUsers.length > 0">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">
                    <i class="fas fa-check-circle me-1"></i>
                    {{ selectedUsers.length }} user(s) selected
                  </span>
                  <div class="bulk-actions">
                    <button
                      class="btn btn-success btn-sm me-2"
                      @click="bulkActivate"
                      :disabled="loading"
                    >
                      <i class="fas fa-user-check me-1"></i>
                      Activate
                    </button>
                    <button
                      class="btn btn-warning btn-sm me-2"
                      @click="bulkDeactivate"
                      :disabled="loading"
                    >
                      <i class="fas fa-user-times me-1"></i>
                      Deactivate
                    </button>
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="deselectAllUsers"
                    >
                      <i class="fas fa-times me-1"></i>
                      Deselect All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Users Table -->
            <div class="card">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">
                    <i class="fas fa-users me-2"></i>
                    Users ({{ pagination.total }})
                  </h5>
                  <div class="table-actions">
                    <button
                      class="btn btn-outline-primary btn-sm me-2"
                      @click="selectAllUsers"
                      :disabled="users.length === 0"
                    >
                      <i class="fas fa-check-square me-1"></i>
                      Select All
                    </button>
                    <div class="btn-group" role="group">
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="changePageSize(10)"
                        :class="{ active: pagination.limit === 10 }"
                      >
                        10
                      </button>
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="changePageSize(25)"
                        :class="{ active: pagination.limit === 25 }"
                      >
                        25
                      </button>
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="changePageSize(50)"
                        :class="{ active: pagination.limit === 50 }"
                      >
                        50
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th width="50">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="
                              selectedUsers.length === users.length &&
                              users.length > 0
                            "
                            @change="toggleSelectAll"
                          />
                        </th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Login</th>
                        <th>Created</th>
                        <th width="150">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="7" class="text-center py-4">
                          <div
                            class="spinner-border text-primary"
                            role="status"
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-else-if="users.length === 0">
                        <td colspan="7" class="text-center py-4 text-muted">
                          <i class="fas fa-users fa-3x mb-3 d-block"></i>
                          No users found
                        </td>
                      </tr>
                      <tr v-else v-for="user in users" :key="user.id">
                        <td>
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="selectedUsers.includes(user.id)"
                            @change="toggleUserSelection(user.id)"
                          />
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="avatar me-3">
                              <i
                                class="fas fa-user-circle fa-2x text-muted"
                              ></i>
                            </div>
                            <div>
                              <div class="fw-bold">
                                {{ user.firstName }} {{ user.lastName }}
                              </div>
                              <div class="text-muted small">
                                {{ user.email }}
                              </div>
                              <div class="text-muted small">
                                @{{ user.username }}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            class="badge"
                            :class="getRoleBadgeClass(user.role)"
                          >
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
                          <span v-if="user.lastLoginAt" class="text-muted">
                            {{ formatDate(user.lastLoginAt) }}
                          </span>
                          <span v-else class="text-muted">Never</span>
                        </td>
                        <td>
                          <span class="text-muted">{{
                            formatDate(user.createdAt)
                          }}</span>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm" role="group">
                            <button
                              class="btn btn-outline-primary"
                              @click="viewUser(user)"
                              title="View User"
                            >
                              <i class="fas fa-eye"></i>
                            </button>
                            <button
                              class="btn btn-outline-secondary"
                              @click="editUser(user)"
                              :disabled="!canEditUser(user)"
                              title="Edit User"
                            >
                              <i class="fas fa-edit"></i>
                            </button>
                            <button
                              class="btn btn-outline-warning"
                              @click="changeUserPassword(user)"
                              :disabled="!canEditUser(user)"
                              title="Change Password"
                            >
                              <i class="fas fa-key"></i>
                            </button>
                            <button
                              class="btn btn-outline-danger"
                              @click="deleteUser(user)"
                              :disabled="!canDeleteUser(user)"
                              title="Delete User"
                            >
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="card-footer" v-if="pagination.totalPages > 1">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-muted">
                    Showing
                    {{ (pagination.page - 1) * pagination.limit + 1 }} to
                    {{
                      Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )
                    }}
                    of {{ pagination.total }} users
                  </div>
                  <nav>
                    <ul class="pagination pagination-sm mb-0">
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
          </div>
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
  </div>
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
import AppSidebar from '@/components/AppSidebar.vue';
import TopBar from '@/components/TopBar.vue';
import '@/assets/css/views.css';

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
