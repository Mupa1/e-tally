<template>
  <Table
    :data="data"
    :columns="columns"
    :title="title"
    :subtitle="subtitle"
    :show-header="showHeader"
    :show-header-actions="showHeaderActions"
    :show-actions="showActions"
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
    @sort="handleSort"
    @page-change="handlePageChange"
  >
    <!-- Header Actions Slot -->
    <template #header-actions>
      <slot name="header-actions" />
    </template>

    <!-- Custom Cell Slots -->
    <template
      v-for="column in columns"
      :key="`cell-${column.key}`"
      #[`cell-${column.key}`]="{ item, index, value }"
    >
      <slot
        :name="`cell-${column.key}`"
        :item="item"
        :index="index"
        :value="value"
      >
        <!-- Default cell rendering -->
        <component
          :is="column.component"
          v-if="column.component"
          :item="item"
          :value="value"
          :index="index"
        />
        <span v-else>{{ formatValue(value, column) }}</span>
      </slot>
    </template>

    <!-- Actions Slot -->
    <template #actions="{ item, index }">
      <slot name="actions" :item="item" :index="index">
        <div class="flex space-x-2">
          <button
            class="text-indigo-600 hover:text-indigo-900 text-sm"
            @click="handleAction('view', item, index)"
          >
            View
          </button>
          <button
            class="text-indigo-600 hover:text-indigo-900 text-sm"
            @click="handleAction('edit', item, index)"
          >
            Edit
          </button>
        </div>
      </slot>
    </template>

    <!-- Empty State Slot -->
    <template #empty-state>
      <slot name="empty-state">
        <i class="fas fa-inbox text-4xl mb-4 block text-gray-400"></i>
        <p class="text-gray-500">{{ emptyMessage }}</p>
      </slot>
    </template>

    <!-- Pagination Slot -->
    <template
      #pagination="{ pagination: paginationData, changePage: changePageFn }"
    >
      <slot
        name="pagination"
        :pagination="paginationData"
        :change-page="changePageFn"
      >
        <!-- Default pagination is handled by Table component -->
      </slot>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Table, { type TableColumn, type TablePagination } from './Table.vue';

export interface DataTableProps {
  data: any[];
  columns: TableColumn[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showHeaderActions?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  rowClass?: (item: any, index: number) => string;
  rowKey?: string | ((item: any) => string | number);
  pagination?: TablePagination;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const props = defineProps<DataTableProps>();

const emit = defineEmits<{
  action: [action: string, item: any, index: number];
  sort: [column: string, order: 'asc' | 'desc'];
  'page-change': [page: number];
}>();

const handleAction = (action: string, item: any, index: number) => {
  emit('action', action, item, index);
};

const handleSort = (column: string, order: 'asc' | 'desc') => {
  emit('sort', column, order);
};

const handlePageChange = (page: number) => {
  emit('page-change', page);
};

const formatValue = (value: any, column: TableColumn): string => {
  if (column.formatter) {
    return column.formatter(value, {});
  }
  return value?.toString() || '';
};
</script>
