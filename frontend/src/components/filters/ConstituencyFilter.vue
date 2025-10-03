<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <FormSelect
      v-model="selectedConstituency"
      :options="constituencyOptions"
      :placeholder="placeholder"
      :button-class="buttonClass"
      :disabled="disabled"
      @update:model-value="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  watch,
  withDefaults,
  defineProps,
  defineEmits,
} from 'vue';
import { useConstituencyManagementStore } from '@/stores/constituencyManagement';
import FormSelect from '@/components/select/FormSelect.vue';
import type { SelectOption } from '@/components/select/Select.vue';

interface Props {
  modelValue?: SelectOption | null;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  buttonClass?: string;
  autoLoad?: boolean;
  countyId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Constituency',
  placeholder: 'All Constituencies',
  disabled: false,
  buttonClass:
    'w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
  autoLoad: true,
  countyId: null,
});

interface Emits {
  (e: 'update:modelValue', value: SelectOption | null): void;
  (e: 'change', constituencyId: string | null): void;
}
const emit = defineEmits<Emits>();

const constituencyManagementStore = useConstituencyManagementStore();
const selectedConstituency = ref<SelectOption | null>(props.modelValue || null);

const constituencies = computed(() => {
  if (props.countyId) {
    return constituencyManagementStore.constituencies.filter(
      (constituency) => constituency.countyId === props.countyId
    );
  }
  return constituencyManagementStore.constituencies;
});

const constituencyOptions = computed<SelectOption[]>(() => [
  { id: '', value: '', label: 'All Constituencies' },
  ...constituencies.value.map((constituency) => ({
    id: constituency.id,
    value: constituency.id,
    label: `${constituency.name} (${constituency.code})`,
  })),
]);

const handleChange = (option: SelectOption | null) => {
  selectedConstituency.value = option;
  emit('update:modelValue', option);
  emit('change', option?.value || null);
};

onMounted(async () => {
  if (props.autoLoad) {
    // Only force refresh if we don't have any constituencies yet
    const shouldForceRefresh = constituencies.value.length === 0;
    await constituencyManagementStore.fetchConstituencies({
      forceRefresh: shouldForceRefresh,
    });
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    selectedConstituency.value = newValue;
  }
);

watch(
  () => props.countyId,
  () => {
    // Reset selection when county changes
    selectedConstituency.value = null;
    emit('update:modelValue', null);
    emit('change', null);
  }
);
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
