<template>
  <div class="px-1 sm:px-1.5 lg:px-2">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 v-if="title" class="text-base font-semibold text-gray-900">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-2 text-sm text-gray-700">
          {{ subtitle }}
        </p>
        <slot name="header-content" />
      </div>
      <div v-if="showHeaderActions" class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <slot name="header-actions">
          <button
            v-if="addButtonText"
            type="button"
            class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="$emit('add')"
          >
            {{ addButtonText }}
          </button>
        </slot>
      </div>
    </div>

    <!-- Table Container -->
    <div class="mt-8 flow-root">
      <div class="-mx-1 -my-0.5 overflow-x-auto sm:-mx-1.5 lg:-mx-2">
        <div
          class="inline-block min-w-full py-0.5 align-middle sm:px-1.5 lg:px-2"
        >
          <div
            class="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg"
          >
            <table class="relative min-w-full divide-y divide-gray-300">
              <!-- Table Header -->
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    :scope="column.scope || 'col'"
                    :class="[
                      'py-1 text-left text-sm font-semibold text-gray-900',
                      column.headerClass || '',
                      column.width ? `w-${column.width}` : '',
                      column.key === columns[0].key
                        ? 'pr-1.5 pl-1.5 sm:pl-2'
                        : 'px-1.5',
                      column.key === columns[columns.length - 1].key &&
                      showActions
                        ? 'py-1 pr-1.5 pl-1.5 sm:pr-2'
                        : '',
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
                    class="py-1 pr-1.5 pl-1.5 sm:pr-2"
                  >
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <!-- Table Body -->
              <tbody class="divide-y divide-gray-200 bg-white">
                <!-- Loading State -->
                <tr v-if="loading">
                  <td :colspan="totalColumns" class="text-center py-2">
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
                    class="text-center py-2 text-gray-500"
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
                  v-for="(item, index) in displayData"
                  :key="getRowKey(item, index)"
                  :class="[
                    'hover:bg-gray-50',
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                    rowClass ? rowClass(item, index) : '',
                  ]"
                >
                  <td
                    v-for="column in columns"
                    :key="column.key"
                    :class="[
                      'py-1 text-sm whitespace-nowrap',
                      column.cellClass ? column.cellClass(item, index) : '',
                      column.width ? `w-${column.width}` : '',
                      column.key === columns[0].key
                        ? 'pr-1 pl-1 text-gray-900 font-medium sm:pl-1.5'
                        : 'px-1 text-gray-500',
                    ]"
                  >
                    <slot
                      :name="`cell-${column.key}`"
                      :item="item"
                      :index="index"
                      :value="getColumnValue(item, column.key)"
                    >
                      <component
                        :is="column.component"
                        v-if="column.component"
                        :item="item"
                        :value="getColumnValue(item, column.key)"
                        :index="index"
                      />
                      <span v-else>{{ formatColumnValue(item, column) }}</span>
                    </slot>
                  </td>

                  <!-- Actions Column -->
                  <td
                    v-if="showActions"
                    class="py-1 pr-1 pl-1 text-right text-sm font-medium whitespace-nowrap sm:pr-1.5"
                  >
                    <slot name="actions" :item="item" :index="index">
                      <a
                        href="#"
                        class="text-indigo-600 hover:text-indigo-900"
                        @click.prevent="handleAction('edit', item, index)"
                      >
                        Edit
                        <span class="sr-only"
                          >, {{ getColumnValue(item, columns[0].key) }}</span
                        >
                      </a>
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
    <div v-if="showPagination && pagination" class="mt-1.5">
      <slot
        name="pagination"
        :pagination="pagination"
        :change-page="changePage"
        :change-page-size="changePageSize"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              Showing
              {{ (pagination.page - 1) * pagination.limit + 1 }} to
              {{
                Math.min(pagination.page * pagination.limit, pagination.total)
              }}
              of {{ pagination.total }} results
            </div>
            <!-- Page Size Selector -->
            <div class="flex items-center space-x-2">
              <label for="page-size" class="text-sm text-gray-700">Show:</label>
              <select
                id="page-size"
                :value="pagination.limit"
                @change="handlePageSizeChange"
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
              </select>
              <span class="text-sm text-gray-700">per page</span>
            </div>
          </div>
          <nav class="flex space-x-2">
            <button
              class="px-1 py-0.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
            >
              Previous
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              class="px-1 py-0.5 text-sm font-medium border rounded-md"
              :class="
                page === pagination.page
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              "
              :disabled="page === '...'"
              @click="typeof page === 'number' && changePage(page)"
            >
              {{ page }}
            </button>
            <button
              class="px-1 py-0.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export interface SimpleTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  scope?: 'col' | 'row';
  headerClass?: string;
  cellClass?: (item: any, index: number) => string;
  component?: any;
  formatter?: (value: any, item: any) => string;
}

export interface SimpleTablePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SimpleTableProps {
  data: any[];
  columns: SimpleTableColumn[];
  title?: string;
  subtitle?: string;
  showHeaderActions?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  rowClass?: (item: any, index: number) => string;
  rowKey?: string | ((item: any) => string | number);
  pagination?: SimpleTablePagination;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  addButtonText?: string;
}

const props = withDefaults(defineProps<SimpleTableProps>(), {
  showHeaderActions: true,
  showActions: true,
  showPagination: true,
  loading: false,
  emptyMessage: 'No data available',
  rowKey: 'id',
  sortable: true,
  sortOrder: 'asc',
});

const emit = defineEmits<{
  action: [action: string, item: any, index: number];
  sort: [column: string, order: 'asc' | 'desc'];
  'page-change': [page: number];
  'page-size-change': [pageSize: number];
  add: [];
}>();

const sortBy = ref(props.sortBy);
const sortOrder = ref<'asc' | 'desc'>(props.sortOrder || 'asc');

const totalColumns = computed(() => {
  return props.columns.length + (props.showActions ? 1 : 0);
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

const displayData = computed(() => {
  // If we have server-side pagination, use the raw data
  // The server has already paginated the data
  if (props.pagination && props.pagination.totalPages > 1) {
    return sortedData.value;
  }
  // Otherwise, use client-side pagination
  return paginatedData.value;
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

const getColumnValue = (item: any, key: string): any => {
  return key.split('.').reduce((obj, k) => obj?.[k], item);
};

const formatColumnValue = (item: any, column: SimpleTableColumn): string => {
  const value = getColumnValue(item, column.key);

  if (column.formatter) {
    return column.formatter(value, item);
  }

  return value?.toString() || '';
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

const changePage = (page: number) => {
  emit('page-change', page);
};

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const pageSize = parseInt(target.value);
  emit('page-size-change', pageSize);
};
</script>
