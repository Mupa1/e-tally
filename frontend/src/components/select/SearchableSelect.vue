<template>
  <Listbox as="div" v-model="selectedValue" :disabled="disabled">
    <ListboxLabel
      v-if="label"
      :class="['block text-sm/6 font-medium', labelClass]"
    >
      {{ label }}
    </ListboxLabel>

    <div class="relative mt-2">
      <ListboxButton
        :class="[
          'grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          buttonClass,
        ]"
        @click="isOpen = !isOpen"
      >
        <span class="col-start-1 row-start-1 truncate pr-6">
          {{ displayValue }}
        </span>
        <ChevronUpDownIcon
          class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          aria-hidden="true"
        />
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class=""
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          v-show="isOpen"
          :class="[
            'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 sm:text-sm',
            optionsClass,
          ]"
        >
          <!-- Search Input -->
          <div class="px-3 py-2 border-b border-gray-200">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full border-0 text-sm focus:ring-0 focus:outline-none"
              @click.stop
            />
          </div>

          <!-- Options -->
          <ListboxOption
            as="template"
            v-for="option in filteredOptions"
            :key="getOptionKey(option)"
            :value="option"
            v-slot="{ active, selected }"
            :disabled="option.disabled"
          >
            <li
              :class="[
                active
                  ? 'bg-indigo-600 text-white outline-hidden'
                  : 'text-gray-900',
                option.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-default',
                'relative py-2 pr-9 pl-3 select-none',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-semibold' : 'font-normal',
                  'block truncate',
                ]"
              >
                {{ getOptionLabel(option) }}
              </span>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-indigo-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon class="size-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>

          <!-- No results -->
          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-2 text-sm text-gray-500"
          >
            No options found
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/16/solid';
import { CheckIcon } from '@heroicons/vue/20/solid';
import { type SelectOption } from './Select.vue';

export interface SearchableSelectProps {
  modelValue: SelectOption | null;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  labelClass?: string;
  buttonClass?: string;
  optionsClass?: string;
  keyField?: string;
  labelField?: string;
  searchFields?: string[];
}

const props = withDefaults(defineProps<SearchableSelectProps>(), {
  placeholder: 'Select an option...',
  disabled: false,
  labelClass: 'text-gray-900',
  buttonClass: '',
  optionsClass: '',
  keyField: 'id',
  labelField: 'label',
  searchFields: ['label'],
});

const emit = defineEmits<{
  'update:modelValue': [value: SelectOption | null];
}>();

const searchQuery = ref('');
const isOpen = ref(false);
const searchInput = ref<HTMLInputElement>();

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const displayValue = computed(() => {
  if (selectedValue.value) {
    return getOptionLabel(selectedValue.value);
  }
  return props.placeholder;
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options;
  }

  const query = searchQuery.value.toLowerCase();
  return props.options.filter((option) => {
    return props.searchFields!.some((field) => {
      const value = option[field];
      return value && value.toString().toLowerCase().includes(query);
    });
  });
});

const getOptionKey = (option: SelectOption): string | number => {
  return option[props.keyField] || option.id;
};

const getOptionLabel = (option: SelectOption): string => {
  return option[props.labelField] || option.label;
};

// Focus search input when dropdown opens
watch(isOpen, async (newValue) => {
  if (newValue && searchInput.value) {
    await nextTick();
    searchInput.value.focus();
  }
});

// Clear search when dropdown closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchQuery.value = '';
  }
});
</script>
