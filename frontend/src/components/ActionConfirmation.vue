<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!-- Background overlay -->
      <Overlay @close="handleCancel" />

      <!-- Modal panel -->
      <div
        class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
      >
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="iconContainerClasses"
            >
              <i :class="iconClasses"></i>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3
                class="text-base font-semibold leading-6 text-gray-900"
                id="modal-title"
              >
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">{{ message }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            @click="handleConfirm"
            :class="confirmButtonClasses"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ confirmText }}
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            :disabled="loading"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults } from 'vue';
import Overlay from './Overlay.vue';

interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  actionType?: 'delete' | 'deactivate' | 'activate' | 'custom';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  actionType: 'custom',
  loading: false,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const iconContainerClasses = computed(() => {
  const typeClasses = {
    delete: 'bg-red-100',
    deactivate: 'bg-yellow-100',
    activate: 'bg-green-100',
    custom: 'bg-blue-100',
  };
  return typeClasses[props.actionType];
});

const iconClasses = computed(() => {
  const typeClasses = {
    delete: 'fas fa-exclamation-triangle text-red-600',
    deactivate: 'fas fa-user-times text-yellow-600',
    activate: 'fas fa-user-check text-green-600',
    custom: 'fas fa-question-circle text-blue-600',
  };
  return typeClasses[props.actionType];
});

const confirmButtonClasses = computed(() => {
  const baseClasses =
    'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:ml-3 sm:w-auto';

  const typeClasses = {
    delete: 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
    deactivate:
      'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600',
    activate: 'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600',
    custom:
      'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
  };

  const disabledClasses = props.loading ? 'opacity-50 cursor-not-allowed' : '';

  return [baseClasses, typeClasses[props.actionType], disabledClasses].join(
    ' '
  );
});

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm');
  }
};

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel');
  }
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
