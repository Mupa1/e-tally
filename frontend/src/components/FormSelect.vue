<template>
  <div class="flex flex-col">
    <div class="space-y-0">
      <BaseFormSelect
        v-model="modelValue"
        :options="options"
        :label="label"
        :placeholder="placeholder"
        :button-class="buttonClass"
        :disabled="disabled"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults } from 'vue';
import {
  FormSelect as BaseFormSelect,
  type SelectOption,
} from '@/components/select';

interface Props {
  modelValue: SelectOption | null;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  buttonClass?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Select an option',
  buttonClass: '',
  disabled: false,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: SelectOption | null];
  change: [value: SelectOption | null];
}>();

const buttonClass = computed(() => {
  if (props.buttonClass) {
    return props.buttonClass;
  }

  const baseClasses =
    'w-full px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200';

  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14',
  };

  return [baseClasses, sizeClasses[props.size]].join(' ');
});

const handleChange = (value: SelectOption | null) => {
  emit('update:modelValue', value);
  emit('change', value);
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
