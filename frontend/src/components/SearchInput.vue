<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      class="block text-sm font-semibold text-gray-700 mb-[12px]"
    >
      {{ label }}
    </label>
    <div class="relative flex-1">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <i :class="iconClass"></i>
      </div>
      <input
        :type="type"
        :class="inputClasses"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
      />
      <div
        v-if="showClearButton && modelValue"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          @click="handleClear"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  icon?: string;
  disabled?: boolean;
  showClearButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Search...',
  type: 'text',
  icon: 'fas fa-search text-gray-400',
  disabled: false,
  showClearButton: true,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  enter: [event: KeyboardEvent];
  clear: [];
}>();

const iconClass = computed(() => props.icon);

const inputClasses = computed(() => {
  const baseClasses =
    'w-full border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200';

  const sizeClasses = {
    sm: 'h-10 pl-10 pr-4',
    md: 'h-12 pl-10 pr-4',
    lg: 'h-14 pl-12 pr-4 text-base',
  };

  const disabledClasses = props.disabled
    ? 'bg-gray-50 cursor-not-allowed opacity-60'
    : 'bg-white';

  return [baseClasses, sizeClasses[props.size], disabledClasses].join(' ');
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleEnter = (event: KeyboardEvent) => {
  emit('enter', event);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
