<template>
  <div class="simple-form-select">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :required="required"
      :disabled="disabled"
      :class="selectClasses"
      :value="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
    <div v-if="helpText" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults } from 'vue';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  id: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  required: false,
  disabled: false,
  error: '',
  helpText: '',
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const selectClasses = computed(() => {
  const baseClasses =
    'w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200';
  const errorClasses = props.error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : '';
  const disabledClasses = props.disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : '';

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return [
    baseClasses,
    sizeClasses[props.size],
    errorClasses,
    disabledClasses,
  ].join(' ');
});
</script>

<style scoped>
.simple-form-select {
  /* Add any specific styles here if needed */
}
</style>
