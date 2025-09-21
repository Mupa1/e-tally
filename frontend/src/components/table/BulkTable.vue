<template>
  <BulkSelectTable
    :data="users"
    :columns="userColumns"
    :title="title"
    :subtitle="subtitle"
    :show-header="showHeader"
    :show-header-actions="showHeaderActions"
    :show-actions="showActions"
    :show-selection="showSelection"
    :show-bulk-actions="showBulkActions"
    :show-pagination="showPagination"
    :loading="loading"
    :empty-message="emptyMessage"
    :row-class="rowClass"
    :row-key="rowKey"
    :pagination="pagination"
    :sortable="sortable"
    :sort-by="sortBy"
    :sort-order="sortOrder"
    @action="handleAction"
    @bulk-action="handleBulkAction"
    @sort="handleSort"
    @page-change="handlePageChange"
    @selection-change="handleSelectionChange"
  >
    <!-- User Name Cell -->
    <template #cell-avatar="{ item, selected }">
      <div
        class="font-medium"
        :class="selected ? 'text-indigo-600' : 'text-gray-900'"
      >
        {{ item.firstName }} {{ item.lastName }}
      </div>
    </template>

    <!-- Email Cell -->
    <template #cell-email="{ item }">
      <div class="text-sm text-gray-900">{{ item.email }}</div>
    </template>

    <!-- Role Cell -->
    <template #cell-role="{ item }">
      <span
        class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
        :class="getRoleBadgeClass(item.role)"
      >
        {{ getRoleLabel(item.role) }}
      </span>
    </template>

    <!-- Status Cell -->
    <template #cell-status="{ item }">
      <span
        class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
        :class="
          item.isActive
            ? 'bg-green-50 text-green-700 ring-green-600/20'
            : 'bg-red-50 text-red-700 ring-red-600/20'
        "
      >
        {{ item.isActive ? 'Active' : 'Inactive' }}
      </span>
    </template>

    <!-- Last Login Cell -->
    <template #cell-lastLogin="{ item }">
      <span v-if="item.lastLoginAt" class="text-gray-500">
        {{ formatDate(item.lastLoginAt) }}
      </span>
      <span v-else class="text-gray-500">Never</span>
    </template>

    <!-- Created At Cell -->
    <template #cell-createdAt="{ item }">
      <span class="text-gray-500">{{ formatDate(item.createdAt) }}</span>
    </template>

    <!-- Actions Cell -->
    <template #actions="{ item, index }">
      <div class="flex space-x-1">
        <button
          class="text-indigo-600 hover:text-indigo-900 p-1"
          @click="handleAction('view', item, index)"
          title="View User"
        >
          <i class="fas fa-eye text-sm"></i>
        </button>
        <button
          class="text-indigo-600 hover:text-indigo-900 p-1"
          @click="handleAction('edit', item, index)"
          :disabled="!canEditUser(item)"
          title="Edit User"
        >
          <i class="fas fa-edit text-sm"></i>
        </button>
        <button
          class="text-indigo-600 hover:text-indigo-900 p-1"
          @click="handleAction('password', item, index)"
          :disabled="!canEditUser(item)"
          title="Change Password"
        >
          <i class="fas fa-key text-sm"></i>
        </button>
        <button
          class="text-red-600 hover:text-red-900 p-1"
          @click="handleAction('delete', item, index)"
          :disabled="!canDeleteUser(item)"
          title="Delete User"
        >
          <i class="fas fa-trash text-sm"></i>
        </button>
      </div>
    </template>

    <!-- Bulk Actions -->
    <template #bulk-actions="{ selectedItems, clearSelection }">
      <button
        type="button"
        class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
        @click="handleBulkAction('activate', selectedItems)"
        :disabled="!canBulkActivate"
      >
        <i class="fas fa-user-check mr-1"></i>
        Activate
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
        @click="handleBulkAction('deactivate', selectedItems)"
        :disabled="!canBulkDeactivate"
      >
        <i class="fas fa-user-times mr-1"></i>
        Deactivate
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
        @click="handleBulkAction('delete', selectedItems)"
        :disabled="!canBulkDelete"
      >
        <i class="fas fa-trash mr-1"></i>
        Delete
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
        @click="clearSelection"
      >
        <i class="fas fa-times mr-1"></i>
        Clear
      </button>
    </template>
  </BulkSelectTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BulkSelectTable from './BulkSelectTable.vue';
import type { TableColumn, TablePagination } from './Table.vue';
import type { User } from '@/services/userService';

export interface BulkTableProps {
  users: User[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showHeaderActions?: boolean;
  showActions?: boolean;
  showSelection?: boolean;
  showBulkActions?: boolean;
  showPagination?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  rowClass?: (item: User, index: number) => string;
  rowKey?: string | ((item: User) => string | number);
  pagination?: TablePagination;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  canEditUser?: (user: User) => boolean;
  canDeleteUser?: (user: User) => boolean;
  canBulkActivate?: boolean;
  canBulkDeactivate?: boolean;
  canBulkDelete?: boolean;
}

const props = withDefaults(defineProps<BulkTableProps>(), {
  showHeader: true,
  showHeaderActions: true,
  showActions: true,
  showSelection: true,
  showBulkActions: true,
  showPagination: true,
  loading: false,
  emptyMessage: 'No users found',
  rowKey: 'id',
  sortable: true,
  sortOrder: 'asc',
  canEditUser: () => true,
  canDeleteUser: () => true,
  canBulkActivate: true,
  canBulkDeactivate: true,
  canBulkDelete: true,
});

const emit = defineEmits<{
  action: [action: string, item: User, index: number];
  'bulk-action': [action: string, items: User[]];
  sort: [column: string, order: 'asc' | 'desc'];
  'page-change': [page: number];
  'selection-change': [selectedItems: User[]];
}>();

const userColumns = computed<TableColumn[]>(() => [
  {
    key: 'avatar',
    label: 'Name',
    width: '48',
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    width: '48',
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    width: '32',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '24',
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    sortable: true,
    width: '32',
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    width: '32',
  },
]);

const handleAction = (action: string, item: User, index: number) => {
  emit('action', action, item, index);
};

const handleBulkAction = (action: string, items: any[]) => {
  emit('bulk-action', action, items);
};

const handleSort = (column: string, order: 'asc' | 'desc') => {
  emit('sort', column, order);
};

const handlePageChange = (page: number) => {
  emit('page-change', page);
};

const handleSelectionChange = (selectedItems: any[]) => {
  emit('selection-change', selectedItems);
};

const getRoleLabel = (role: string): string => {
  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    CENTRAL_COMMAND_ADMIN: 'Central Command Admin',
    CENTRAL_COMMAND_USER: 'Central Command User',
    PRESIDENTIAL_ELECTION_OBSERVER: 'Presidential Election Observer',
    PARLIAMENTARY_ELECTION_OBSERVER: 'Parliamentary Election Observer',
    LOCAL_GOVERNMENT_ELECTION_OBSERVER: 'Local Government Election Observer',
    SENATORIAL_ELECTION_OBSERVER: 'Senatorial Election Observer',
    GUBERNATORIAL_ELECTION_OBSERVER: 'Gubernatorial Election Observer',
    COUNTY_LEVEL_SUPERVISOR: 'County Level Supervisor',
    CONSTITUENCY_LEVEL_SUPERVISOR: 'Constituency Level Supervisor',
    COUNTY_ASSEMBLY_WARD_SUPERVISOR: 'County Assembly Ward Supervisor',
  };
  return roleLabels[role] || role;
};

const getRoleBadgeClass = (role: string): string => {
  const classes: Record<string, string> = {
    SUPER_ADMIN: 'bg-red-50 text-red-700 ring-red-600/20',
    CENTRAL_COMMAND_ADMIN: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
    CENTRAL_COMMAND_USER: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    PRESIDENTIAL_ELECTION_OBSERVER:
      'bg-purple-50 text-purple-700 ring-purple-600/20',
    PARLIAMENTARY_ELECTION_OBSERVER:
      'bg-purple-50 text-purple-700 ring-purple-600/20',
    LOCAL_GOVERNMENT_ELECTION_OBSERVER:
      'bg-purple-50 text-purple-700 ring-purple-600/20',
    SENATORIAL_ELECTION_OBSERVER:
      'bg-purple-50 text-purple-700 ring-purple-600/20',
    GUBERNATORIAL_ELECTION_OBSERVER:
      'bg-purple-50 text-purple-700 ring-purple-600/20',
    COUNTY_LEVEL_SUPERVISOR: 'bg-green-50 text-green-700 ring-green-600/20',
    CONSTITUENCY_LEVEL_SUPERVISOR:
      'bg-green-50 text-green-700 ring-green-600/20',
    COUNTY_ASSEMBLY_WARD_SUPERVISOR:
      'bg-green-50 text-green-700 ring-green-600/20',
  };
  return classes[role] || 'bg-gray-50 text-gray-700 ring-gray-600/20';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
