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
              class="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100"
                >
                  <i class="fas fa-edit text-yellow-600 text-xl"></i>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Edit Constituency</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Update the details for
                      {{ constituency?.name || 'this constituency' }}.
                    </p>
                  </div>
                </div>
              </div>
              <form @submit.prevent="handleSubmit" class="mt-5 sm:mt-6">
                <div class="mb-4">
                  <label
                    for="editConstituencyCode"
                    class="block text-sm font-medium text-gray-700"
                    >Constituency Code *</label
                  >
                  <input
                    type="text"
                    id="editConstituencyCode"
                    v-model="form.code"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label
                    for="editConstituencyName"
                    class="block text-sm font-medium text-gray-700"
                    >Constituency Name *</label
                  >
                  <input
                    type="text"
                    id="editConstituencyName"
                    v-model="form.name"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label
                    for="editCountySelect"
                    class="block text-sm font-medium text-gray-700"
                    >County *</label
                  >
                  <FormSelect
                    v-model="form.countyId"
                    :options="countyOptions"
                    placeholder="Select a county"
                    required
                    button-class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div
                  class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
                >
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="
                      loading || !form.code || !form.name || !form.countyId
                    "
                  >
                    <i class="fas fa-spinner fa-spin mr-2" v-if="loading"></i>
                    <i class="fas fa-save mr-2" v-else></i>
                    Update Constituency
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="emit('close')"
                    ref="cancelButtonRef"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import Overlay from '../../Overlay.vue';
import FormSelect from '../../select/FormSelect.vue';
import type { Constituency } from '@/services/constituencyService';
import { useCountyManagementStore } from '@/stores/countyManagement';

const countyManagementStore = useCountyManagementStore();

// Form data
const form = ref({
  code: '',
  name: '',
  countyId: '',
});

// Props and Emits
const props = defineProps<{
  isOpen: boolean;
  constituency: Constituency | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: { code: string; name: string; countyId: string }];
}>();

// Computed
const countyOptions = computed(() =>
  countyManagementStore.counties.map((county) => ({
    value: county.id,
    label: `${county.name} (${county.code})`,
  }))
);

// Watch for constituency prop changes to populate form
watch(
  () => props.constituency,
  (newConstituency) => {
    if (newConstituency) {
      form.value = {
        code: newConstituency.code,
        name: newConstituency.name,
        countyId: newConstituency.countyId,
      };
    }
  },
  { immediate: true }
);

// Methods
const handleSubmit = () => {
  if (form.value.code && form.value.name && form.value.countyId) {
    emit('submit', { ...form.value });
  }
};
</script>
