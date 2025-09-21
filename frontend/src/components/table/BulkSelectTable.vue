<template>
  <div>
    <!-- Header Section -->
    <div v-if="showHeader && showHeaderActions" class="flex justify-end">
      <slot name="header-actions" />
    </div>

    <!-- Table Container -->
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div
            class="group/table relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <!-- Bulk Actions Bar -->
            <div
              v-if="showBulkActions && selectedItems.length > 0"
              class="absolute top-0 left-14 z-10 flex h-12 items-center space-x-3 bg-white sm:left-12"
            >
              <slot
                name="bulk-actions"
                :selected-items="selectedItems"
                :clear-selection="clearSelection"
              >
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-colors duration-200"
                  @click="handleBulkAction('edit', selectedItems)"
                >
                  Bulk edit
                </button>
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-colors duration-200"
                  @click="handleBulkAction('delete', selectedItems)"
                >
                  Delete all
                </button>
              </slot>
            </div>

            <table
              class="relative min-w-full table-fixed divide-y divide-gray-300"
            >
              <!-- Table Header -->
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-if="showSelection"
                    scope="col"
                    class="relative px-7 sm:w-12 sm:px-6"
                  >
                    <div
                      class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1"
                    >
                      <input
                        type="checkbox"
                        class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        :checked="isAllSelected"
                        :indeterminate="isIndeterminate"
                        @change="toggleSelectAll"
                      />
                      <svg
                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          class="opacity-0 group-has-checked:opacity-100"
                          d="M3 8L6 11L11 3.5"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          class="opacity-0 group-has-indeterminate:opacity-100"
                          d="M3 7H11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </th>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    :scope="column.scope || 'col'"
                    :class="[
                      'py-3.5 text-left text-sm font-semibold text-gray-900',
                      column.headerClass || '',
                      column.width ? `w-${column.width}` : '',
                    ]"
                  >
                    <div class="flex items-center">
                      <span>{{ column.label }}</span>
                      <button
                        v-if="column.sortable"
                        @click="handleSort(column.key)"
                        class="ml-2 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <i
                          :class="[
                            'fas fa-sort text-xs',
                            {
                              'text-indigo-600': sortBy === column.key,
                              'fa-sort-up':
                                sortBy === column.key && sortOrder === 'asc',
                              'fa-sort-down':
                                sortBy === column.key && sortOrder === 'desc',
                            },
                          ]"
                        />
                      </button>
                    </div>
                  </th>
                  <th
                    v-if="showActions"
                    scope="col"
                    class="py-3.5 pr-4 pl-3 sm:pr-3"
                  >
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <!-- Table Body -->
              <tbody class="divide-y divide-gray-200 bg-white">
                <!-- Loading State -->
                <tr v-if="loading">
                  <td :colspan="totalColumns" class="text-center py-8">
                    <div class="flex justify-center">
                      <div class="spinner-border text-indigo-600" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="data.length === 0">
                  <td
                    :colspan="totalColumns"
                    class="text-center py-8 text-gray-500"
                  >
                    <slot name="empty-state">
                      <i class="fas fa-inbox text-4xl mb-4 block"></i>
                      {{ emptyMessage }}
                    </slot>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr
                  v-else
                  v-for="(item, index) in paginatedData"
                  :key="getRowKey(item, index)"
                  :class="[
                    'group has-checked:bg-gray-50',
                    rowClass ? rowClass(item, index) : '',
                    isSelected(item) ? 'has-checked' : '',
                  ]"
                >
                  <!-- Selection Column -->
                  <td
                    v-if="showSelection"
                    class="relative px-7 sm:w-12 sm:px-6"
                  >
                    <div
                      v-if="isSelected(item)"
                      class="hidden group-has-checked:block absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                    />
                    <div
                      class="absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1"
                    >
                      <input
                        type="checkbox"
                        class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        :value="getItemKey(item)"
                        v-model="selectedItems"
                        @change="
                          handleItemSelection(
                            item,
                            ($event.target as HTMLInputElement)?.checked ||
                              false
                          )
                        "
                      />
                      <svg
                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          class="opacity-0 group-has-checked:opacity-100"
                          d="M3 8L6 11L11 3.5"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          class="opacity-0 group-has-indeterminate:opacity-100"
                          d="M3 7H11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </td>

                  <!-- Data Columns -->
                  <td
                    v-for="column in columns"
                    :key="column.key"
                    :class="[
                      'py-4 text-sm whitespace-nowrap',
                      column.cellClass ? column.cellClass(item, index) : '',
                      column.width ? `w-${column.width}` : '',
                      isSelected(item) ? 'text-indigo-600' : 'text-gray-900',
                    ]"
                  >
                    <slot
                      :name="`cell-${column.key}`"
                      :item="item"
                      :index="index"
                      :value="getColumnValue(item, column.key)"
                      :selected="isSelected(item)"
                    >
                      <component
                        :is="column.component"
                        v-if="column.component"
                        :item="item"
                        :value="getColumnValue(item, column.key)"
                        :index="index"
                        :selected="isSelected(item)"
                      />
                      <span v-else>{{ formatColumnValue(item, column) }}</span>
                    </slot>
                  </td>

                  <!-- Actions Column -->
                  <td
                    v-if="showActions"
                    class="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3"
                  >
                    <slot
                      name="actions"
                      :item="item"
                      :index="index"
                      :selected="isSelected(item)"
                    >
                      <button
                        class="text-indigo-600 hover:text-indigo-900"
                        @click="handleAction('edit', item, index)"
                      >
                        Edit
                        <span class="sr-only"
                          >, {{ getRowKey(item, index) }}</span
                        >
                      </button>
                    </slot>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && pagination" class="mt-6">
      <slot
        name="pagination"
        :pagination="pagination"
        :change-page="changePage"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing
            {{ (pagination.page - 1) * pagination.limit + 1 }} to
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
            of {{ pagination.total }} results
          </div>
          <nav class="flex space-x-2">
            <button
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
            >
              Previous
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              class="px-3 py-2 text-sm font-medium border rounded-lg transition-colors duration-200"
              :class="
                page === pagination.page
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              "
              :disabled="page === '...'"
              @click="typeof page === 'number' ? changePage(page) : undefined"
            >
              {{ page }}
            </button>
            <button
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="pagination.page === pagination.totalPages"
              @click="changePage(pagination.page + 1)"
            >
              Next
            </button>
          </nav>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TableColumn, TablePagination } from './Table.vue';

export interface BulkSelectTableProps {
  data: any[];
  columns: TableColumn[];
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
  rowClass?: (item: any, index: number) => string;
  rowKey?: string | ((item: any) => string | number);
  pagination?: TablePagination;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const props = withDefaults(defineProps<BulkSelectTableProps>(), {
  showHeader: true,
  showHeaderActions: true,
  showActions: true,
  showSelection: true,
  showBulkActions: true,
  showPagination: true,
  loading: false,
  emptyMessage: 'No data available',
  rowKey: 'id',
  sortable: true,
  sortOrder: 'asc',
});

const emit = defineEmits<{
  action: [action: string, item: any, index: number];
  'bulk-action': [action: string, items: any[]];
  sort: [column: string, order: 'asc' | 'desc'];
  'page-change': [page: number];
  'selection-change': [selectedItems: any[]];
}>();

const selectedItems = ref<string[]>([]);
const sortBy = ref(props.sortBy);
const sortOrder = ref<'asc' | 'desc'>(props.sortOrder || 'asc');

const totalColumns = computed(() => {
  return (
    props.columns.length +
    (props.showActions ? 1 : 0) +
    (props.showSelection ? 1 : 0)
  );
});

const isAllSelected = computed(() => {
  return (
    props.data.length > 0 && selectedItems.value.length === props.data.length
  );
});

const isIndeterminate = computed(() => {
  return (
    selectedItems.value.length > 0 &&
    selectedItems.value.length < props.data.length
  );
});

const sortedData = computed(() => {
  if (!props.sortable || !sortBy.value) return props.data;

  return [...props.data].sort((a, b) => {
    const aValue = getColumnValue(a, sortBy.value!);
    const bValue = getColumnValue(b, sortBy.value!);

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const paginatedData = computed(() => {
  if (!props.pagination) return sortedData.value;

  const start = (props.pagination.page - 1) * props.pagination.limit;
  const end = start + props.pagination.limit;
  return sortedData.value.slice(start, end);
});

const visiblePages = computed(() => {
  if (!props.pagination) return [];

  const total = props.pagination.totalPages;
  const current = props.pagination.page;
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

const getRowKey = (item: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item);
  }
  return item[props.rowKey] || index;
};

const getItemKey = (item: any): string => {
  return getRowKey(item, 0).toString();
};

const getColumnValue = (item: any, key: string): any => {
  return key.split('.').reduce((obj, k) => obj?.[k], item);
};

const formatColumnValue = (item: any, column: TableColumn): string => {
  const value = getColumnValue(item, column.key);

  if (column.formatter) {
    return column.formatter(value, item);
  }

  return value?.toString() || '';
};

const isSelected = (item: any): boolean => {
  return selectedItems.value.includes(getItemKey(item));
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = props.data.map((item) => getItemKey(item));
  }
  emit('selection-change', selectedItems.value);
};

const handleItemSelection = (item: any, checked: boolean) => {
  const itemKey = getItemKey(item);
  if (checked) {
    if (!selectedItems.value.includes(itemKey)) {
      selectedItems.value.push(itemKey);
    }
  } else {
    selectedItems.value = selectedItems.value.filter((key) => key !== itemKey);
  }
  emit('selection-change', selectedItems.value);
};

const clearSelection = () => {
  selectedItems.value = [];
  emit('selection-change', selectedItems.value);
};

const handleSort = (columnKey: string) => {
  if (!props.sortable) return;

  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = columnKey;
    sortOrder.value = 'asc';
  }

  emit('sort', columnKey, sortOrder.value);
};

const handleAction = (action: string, item: any, index: number) => {
  emit('action', action, item, index);
};

const handleBulkAction = (action: string, items: any[]) => {
  emit('bulk-action', action, items);
};

const changePage = (page: number) => {
  emit('page-change', page);
};
</script>
