<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="emit('close')">
      <Overlay @close="emit('close')" />

      <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
                >
                  <i class="fas fa-eye text-blue-600 text-xl"></i>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Constituency Details</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Viewing details for
                      {{ constituency?.name || 'this constituency' }}.
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="constituency" class="mt-5 sm:mt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Basic Information -->
                  <div class="space-y-4">
                    <h4
                      class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2"
                    >
                      <i class="fas fa-info-circle mr-2 text-indigo-600"></i>
                      Basic Information
                    </h4>

                    <div>
                      <label class="block text-sm font-medium text-gray-500"
                        >Code</label
                      >
                      <p class="mt-1 text-sm text-gray-900">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {{ constituency.code }}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-500"
                        >Name</label
                      >
                      <p class="mt-1 text-sm text-gray-900 font-medium">
                        {{ constituency.name }}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-500"
                        >County</label
                      >
                      <p class="mt-1 text-sm text-gray-900">
                        <span class="font-medium">{{
                          constituency.county.name
                        }}</span>
                        <span class="text-gray-500 ml-2"
                          >({{ constituency.county.code }})</span
                        >
                      </p>
                    </div>
                  </div>

                  <!-- Statistics -->
                  <div class="space-y-4">
                    <h4
                      class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2"
                    >
                      <i class="fas fa-chart-bar mr-2 text-green-600"></i>
                      Statistics
                    </h4>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-blue-50 rounded-lg p-4">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <i class="fas fa-building text-blue-600"></i>
                          </div>
                          <div class="ml-3">
                            <p class="text-sm font-medium text-blue-900">
                              Wards
                            </p>
                            <p class="text-2xl font-semibold text-blue-600">
                              {{ constituency._count?.caws || 0 }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="bg-green-50 rounded-lg p-4">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <i class="fas fa-poll text-green-600"></i>
                          </div>
                          <div class="ml-3">
                            <p class="text-sm font-medium text-green-900">
                              Polling Stations
                            </p>
                            <p class="text-2xl font-semibold text-green-600">
                              {{ constituency._count?.pollingStations || 0 }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-500"
                        >Created</label
                      >
                      <p class="mt-1 text-sm text-gray-900">
                        {{ formatDate(constituency.createdAt) }}
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-500"
                        >Last Updated</label
                      >
                      <p class="mt-1 text-sm text-gray-900">
                        {{ formatDate(constituency.updatedAt) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <h4 class="text-lg font-medium text-gray-900 mb-4">
                    <i class="fas fa-bolt mr-2 text-gray-600"></i>
                    Quick Actions
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      @click="handleEdit"
                      class="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                        >
                          <i class="fas fa-edit text-yellow-600"></i>
                        </div>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-sm font-medium text-gray-900">
                          Edit Constituency
                        </h4>
                        <p class="text-sm text-gray-500">
                          Modify constituency details
                        </p>
                      </div>
                    </button>

                    <button
                      @click="handleViewWards"
                      class="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                        >
                          <i class="fas fa-building text-blue-600"></i>
                        </div>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-sm font-medium text-gray-900">
                          View Wards
                        </h4>
                        <p class="text-sm text-gray-500">
                          Manage constituency wards
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              >
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  @click="emit('close')"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="handleEdit"
                >
                  <i class="fas fa-edit mr-2"></i>
                  Edit Constituency
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import Overlay from '../../Overlay.vue';
import type { Constituency } from '@/services/constituencyService';

// Props and Emits
const props = defineProps<{
  isOpen: boolean;
  constituency: Constituency | null;
}>();

const emit = defineEmits<{
  close: [];
  edit: [constituency: Constituency];
}>();

// Methods
const handleEdit = () => {
  if (props.constituency) {
    emit('edit', props.constituency);
  }
};

const handleViewWards = () => {
  // TODO: Navigate to wards management for this constituency
  console.log('Navigate to wards for constituency:', props.constituency?.id);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
