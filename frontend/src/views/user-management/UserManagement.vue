<template>
  <MainLayout
    page-title="User Management"
    page-subtitle="Manage system users and permissions"
  >
    <!-- Action Buttons -->
    <div class="flex justify-end mb-6">
      <div class="flex space-x-3">
        <Button
          text="Add User"
          icon="fas fa-plus"
          icon-position="left"
          variant="secondary"
          size="md"
          :disabled="!canCreateUser"
          @click="showCreateModal = true"
        />
        <Button
          text="Refresh"
          icon="fas fa-sync-alt"
          icon-position="left"
          variant="secondary"
          size="md"
          :disabled="loading"
          :loading="loading"
          loading-text="Refreshing..."
          @click="refreshUsers"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <StatisticsGrid
      :columns="4"
      gap="lg"
      padding="none"
      class="mb-6"
      v-if="stats"
    >
      <StatisticsCardCompact
        name="Total Users"
        :value="stats.totalUsers"
        format="number"
        icon="fas fa-users"
        color="blue"
      />
      <StatisticsCardCompact
        name="Active Users"
        :value="stats.activeUsers"
        format="number"
        icon="fas fa-user-check"
        color="green"
      />
      <StatisticsCardCompact
        name="Inactive Users"
        :value="stats.inactiveUsers"
        format="number"
        icon="fas fa-user-times"
        color="red"
      />
      <StatisticsCardCompact
        name="Recent Users"
        :value="stats.recentUsers.length"
        format="number"
        icon="fas fa-user-plus"
        color="purple"
      />
    </StatisticsGrid>

    <!-- Filters and Search -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 relative"
    >
      <!-- Clear Button -->
      <ClearButton :show="hasActiveFilters" @click="clearFilters" />

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchInput
            v-model="searchTerm"
            label="Search Users"
            placeholder="Search by name, email, or username..."
            @input="handleSearch"
          />
          <FormSelect
            v-model="selectedRoleOption"
            :options="roleOptions"
            label="Filter by Role"
            placeholder="All Roles"
            @change="handleRoleFilterChange"
          />
          <FormSelect
            v-model="selectedStatusOption"
            :options="statusOptions"
            label="Filter by Status"
            placeholder="All Status"
            @change="handleStatusFilterChange"
          />
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <BulkTable
      :users="users"
      :pagination="pagination"
      :loading="loading"
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
        <PageSizeSelector
          :current-page-size="pagination.limit"
          @page-size-change="changePageSize"
        />
      </template>
    </BulkTable>

    <!-- Create User Modal -->
    <CreateUserModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />

    <!-- Bulk Action Confirmations -->
    <ActionConfirmation
      :show="showBulkDeleteConfirmation"
      title="Delete Users"
      :message="`Are you sure you want to delete ${
        pendingBulkAction?.users.length || 0
      } users? This action cannot be undone.`"
      confirm-text="Delete"
      action-type="delete"
      :loading="bulkActionLoading"
      @confirm="handleBulkActionConfirm"
      @cancel="handleBulkActionCancel"
    />

    <ActionConfirmation
      :show="showBulkActivateConfirmation"
      title="Activate Users"
      :message="`Are you sure you want to activate ${
        pendingBulkAction?.users.length || 0
      } users?`"
      confirm-text="Activate"
      action-type="activate"
      :loading="bulkActionLoading"
      @confirm="handleBulkActionConfirm"
      @cancel="handleBulkActionCancel"
    />

    <ActionConfirmation
      :show="showBulkDeactivateConfirmation"
      title="Deactivate Users"
      :message="`Are you sure you want to deactivate ${
        pendingBulkAction?.users.length || 0
      } users?`"
      confirm-text="Deactivate"
      action-type="deactivate"
      :loading="bulkActionLoading"
      @confirm="handleBulkActionConfirm"
      @cancel="handleBulkActionCancel"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserManagementStore } from '@/stores/userManagement';
import type { User, UserRole } from '@/services/userService';
import CreateUserModal from '@/components/pages/users/CreateUserModal.vue';
import MainLayout from '@/components/MainLayout.vue';
import { type SelectOption } from '@/components/select';
import { BulkTable } from '@/components/table';
import {
  StatisticsGrid,
  StatisticsCardCompact,
} from '@/components/statistics-card';
import Button from '@/components/Button.vue';
import SearchInput from '@/components/SearchInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import PageSizeSelector from '@/components/PageSizeSelector.vue';
import ClearButton from '@/components/ClearButton.vue';
import ActionConfirmation from '@/components/ActionConfirmation.vue';

const router = useRouter();
const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();

// Reactive data
const showCreateModal = ref(false);
const searchTerm = ref('');
const selectedRoleOption = ref<SelectOption | null>(null);
const selectedStatusOption = ref<SelectOption | null>(null);

// Bulk action confirmation states
const showBulkDeleteConfirmation = ref(false);
const showBulkActivateConfirmation = ref(false);
const showBulkDeactivateConfirmation = ref(false);
const pendingBulkAction = ref<{
  action: string;
  users: User[];
} | null>(null);
const bulkActionLoading = ref(false);

// Computed properties
const user = computed(() => authStore.user);
const users = computed(() => userManagementStore.users);
const stats = computed(() => userManagementStore.stats);
const loading = computed(() => userManagementStore.loading);
const pagination = computed(() => userManagementStore.pagination);
const selectedUsers = computed(() => userManagementStore.selectedUsers);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    searchTerm.value.trim() !== '' ||
    selectedRoleOption.value !== null ||
    selectedStatusOption.value !== null
  );
});

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

// Removed canEditUser and canDeleteUser as they're no longer needed

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
  router.push(`/users/${user.id}`);
};

// Removed editUser, changeUserPassword, and deleteUser methods as they're no longer needed

const handleUserCreated = () => {
  showCreateModal.value = false;
  refreshUsers();
};

const handleUserAction = (action: string, user: User, index: number) => {
  switch (action) {
    case 'view':
      viewUser(user);
      break;
    // Removed other actions as they're no longer available in the UI
  }
};

const handleBulkAction = async (action: string, selectedUsers: User[]) => {
  // Store the pending action and show appropriate confirmation
  pendingBulkAction.value = { action, users: selectedUsers };

  switch (action) {
    case 'activate':
      showBulkActivateConfirmation.value = true;
      break;
    case 'deactivate':
      showBulkDeactivateConfirmation.value = true;
      break;
    case 'delete':
      showBulkDeleteConfirmation.value = true;
      break;
  }
};

const handleBulkActionConfirm = async () => {
  if (!pendingBulkAction.value) return;

  const { action, users } = pendingBulkAction.value;
  const selectedUserIds = users.map((user) => user.id);

  bulkActionLoading.value = true;

  try {
    switch (action) {
      case 'activate':
        await userManagementStore.bulkActivateUsers(selectedUserIds);
        showBulkActivateConfirmation.value = false;
        break;
      case 'deactivate':
        await userManagementStore.bulkDeactivateUsers(selectedUserIds);
        showBulkDeactivateConfirmation.value = false;
        break;
      case 'delete':
        // For now, delete users one by one since bulkDeleteUsers doesn't exist
        for (const user of users) {
          await userManagementStore.deleteUser(user.id);
        }
        showBulkDeleteConfirmation.value = false;
        break;
    }
  } catch (error) {
    console.error('Error performing bulk action:', error);
  } finally {
    bulkActionLoading.value = false;
    pendingBulkAction.value = null;
  }
};

const handleBulkActionCancel = () => {
  showBulkDeleteConfirmation.value = false;
  showBulkActivateConfirmation.value = false;
  showBulkDeactivateConfirmation.value = false;
  pendingBulkAction.value = null;
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
