<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <FormSelect
      v-model="selectedCAW"
      :options="cawOptions"
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
import { useCAWManagementStore } from '@/stores/cawManagement';
import FormSelect from '@/components/select/FormSelect.vue';
import type { SelectOption } from '@/components/select/Select.vue';

interface Props {
  modelValue?: SelectOption | null;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  buttonClass?: string;
  autoLoad?: boolean;
  constituencyId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'CAW',
  placeholder: 'All CAWs',
  disabled: false,
  buttonClass:
    'w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
  autoLoad: true,
  constituencyId: null,
});

interface Emits {
  (e: 'update:modelValue', value: SelectOption | null): void;
  (e: 'change', cawId: string | null): void;
}
const emit = defineEmits<Emits>();

const cawManagementStore = useCAWManagementStore();
const selectedCAW = ref<SelectOption | null>(props.modelValue || null);

const caws = computed(() => {
  if (props.constituencyId) {
    return cawManagementStore.caws.filter(
      (caw) => caw.constituencyId === props.constituencyId
    );
  }
  return cawManagementStore.caws;
});

const cawOptions = computed<SelectOption[]>(() => [
  { id: '', value: '', label: 'All CAWs' },
  ...caws.value.map((caw) => ({
    id: caw.id,
    value: caw.id,
    label: `${caw.name} (${caw.code})`,
  })),
]);

const handleChange = (option: SelectOption | null) => {
  selectedCAW.value = option;
  emit('update:modelValue', option);
  emit('change', option?.value || null);
};

onMounted(async () => {
  if (props.autoLoad) {
    // Only force refresh if we don't have any CAWs yet
    const shouldForceRefresh = caws.value.length === 0;
    await cawManagementStore.fetchCAWs({
      forceRefresh: shouldForceRefresh,
    });
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    selectedCAW.value = newValue;
  }
);

watch(
  () => props.constituencyId,
  () => {
    // Reset selection when constituency changes
    selectedCAW.value = null;
    emit('update:modelValue', null);
    emit('change', null);
  }
);
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
