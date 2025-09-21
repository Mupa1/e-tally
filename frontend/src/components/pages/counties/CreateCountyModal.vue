<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <Overlay @close="$emit('close')" />

    <!-- Modal Panel -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
      >
        <!-- Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-plus mr-2 text-indigo-600"></i>
              Add New County
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="bg-white px-6 py-4">
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <!-- County Code -->
              <div>
                <label
                  for="countyCode"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  County Code *
                </label>
                <input
                  type="text"
                  id="countyCode"
                  v-model="form.code"
                  placeholder="e.g., 001"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>

              <!-- County Name -->
              <div>
                <label
                  for="countyName"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  County Name *
                </label>
                <input
                  type="text"
                  id="countyName"
                  v-model="form.name"
                  placeholder="e.g., Nairobi County"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div
          class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="loading || !form.code || !form.name"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <i class="fas fa-spinner fa-spin mr-2" v-if="loading"></i>
            <i class="fas fa-plus mr-2" v-else></i>
            Create County
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Overlay from '../../Overlay.vue';

// Form data
const form = ref({
  code: '',
  name: '',
});

// Props and Emits
const props = defineProps<{
  isOpen: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: { code: string; name: string }];
}>();

// Methods
const handleSubmit = () => {
  if (form.value.code && form.value.name) {
    emit('submit', { ...form.value });
  }
};

// Reset form when modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      form.value = { code: '', name: '' };
    }
  }
);
</script>
