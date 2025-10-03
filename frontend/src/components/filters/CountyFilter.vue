<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <FormSelect
      :model-value="props.modelValue"
      :options="countyOptions"
      :placeholder="placeholder"
      :disabled="loading"
      @update:model-value="handleCountyChange"
      :button-class="buttonClass"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCountyManagementStore } from '@/stores/countyManagement';
import type { SelectOption } from '@/components/select/Select.vue';
import FormSelect from '@/components/select/FormSelect.vue';

interface Props {
  modelValue?: SelectOption | null;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  buttonClass?: string;
  autoLoad?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: SelectOption | null): void;
  (e: 'change', countyId: string | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'County',
  placeholder: 'All Counties',
  disabled: false,
  buttonClass:
    'w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
  autoLoad: true,
});

const emit = defineEmits<Emits>();

const countyManagementStore = useCountyManagementStore();

// Computed
const counties = computed(() => countyManagementStore.counties);
const loading = computed(() => countyManagementStore.loading);

const countyOptions = computed(() => [
  { id: '', value: '', label: 'All Counties' },
  ...counties.value.map((county) => ({
    id: county.id,
    value: county.id,
    label: `${county.name} (${county.code})`,
  })),
]);

// Methods
const handleCountyChange = (value: SelectOption | null) => {
  emit('update:modelValue', value);
  emit('change', value?.value || null);
};

const loadCounties = async () => {
  // Only force refresh if we don't have any counties yet
  const shouldForceRefresh = counties.value.length === 0;
  await countyManagementStore.fetchCounties({
    limit: 1000,
    forceRefresh: shouldForceRefresh,
  });
};

// Lifecycle
onMounted(async () => {
  if (props.autoLoad) {
    await loadCounties();
  }
});
</script>
