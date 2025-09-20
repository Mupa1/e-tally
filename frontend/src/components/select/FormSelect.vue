<template>
  <div class="space-y-1">
    <Select
      v-model="selectedValue"
      :options="options"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :key-field="keyField"
      :label-field="labelField"
      :button-class="buttonClass"
      :options-class="optionsClass"
      @update:model-value="handleChange"
    />

    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>

    <p v-if="help && !error" class="text-sm text-gray-500">
      {{ help }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Select, { type SelectOption } from './Select.vue';

export interface FormSelectProps {
  modelValue: SelectOption | null;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  help?: string;
  keyField?: string;
  labelField?: string;
  buttonClass?: string;
  optionsClass?: string;
}

const props = defineProps<FormSelectProps>();

const emit = defineEmits<{
  'update:modelValue': [value: SelectOption | null];
  change: [value: SelectOption | null];
}>();

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleChange = (value: SelectOption | null) => {
  emit('change', value);
};
</script>
