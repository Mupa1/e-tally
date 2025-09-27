<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="icon && iconPosition === 'left'" :class="iconClasses">
      <i :class="icon"></i>
    </span>
    <span v-if="text">{{ text }}</span>
    <span v-if="icon && iconPosition === 'right'" :class="iconClasses">
      <i :class="icon"></i>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ButtonProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  iconPosition: 'right',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const buttonClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-200';

  // Size classes
  const sizeClasses = {
    sm: 'gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm',
    md: 'gap-x-1.5 rounded-md px-3 py-2 text-sm',
    lg: 'gap-x-2 rounded-md px-3.5 py-2.5 text-sm',
  };

  // Variant classes
  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
    secondary: 'bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600',
    success: 'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600',
    danger: 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
    warning:
      'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600',
    info: 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600',
  };

  // Disabled classes
  const disabledClasses =
    props.disabled || props.loading
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    disabledClasses,
  ].join(' ');
});

const iconClasses = computed(() => {
  const baseIconClasses = 'size-5';
  const positionClasses = props.iconPosition === 'left' ? '' : '-mr-0.5';
  return [baseIconClasses, positionClasses].join(' ');
});
</script>
