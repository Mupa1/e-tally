<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :class="buttonClasses"
    @click="handleClick"
  >
    <i v-if="icon" :class="iconClasses"></i>
    <span v-if="text" class="ml-2">{{ text }}</span>
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';

interface QuickActionButtonProps {
  text?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  to?: string;
  href?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<QuickActionButtonProps>(), {
  text: '',
  icon: '',
  variant: 'primary',
  to: '',
  href: '',
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const componentType = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});

const buttonClasses = computed(() => {
  const baseClasses = 'w-full text-center inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'btn-outline-primary',
    secondary: 'btn-outline-secondary', 
    success: 'btn-outline-success',
    danger: 'btn-outline-danger',
    warning: 'btn-outline-warning',
    info: 'btn-outline-info',
  };
  
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return [baseClasses, variantClasses[props.variant], disabledClasses].join(' ');
});

const iconClasses = computed(() => {
  return `fas ${props.icon}`;
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
