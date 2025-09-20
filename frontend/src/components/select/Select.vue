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
          :class="[
            'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 sm:text-sm',
            optionsClass,
          ]"
        >
          <ListboxOption
            as="template"
            v-for="option in options"
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
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/16/solid';
import { CheckIcon } from '@heroicons/vue/20/solid';

export interface SelectOption {
  id: string | number;
  label: string;
  value?: any;
  disabled?: boolean;
  [key: string]: any;
}

export interface SelectProps {
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
}

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option...',
  disabled: false,
  labelClass: 'text-gray-900',
  buttonClass: '',
  optionsClass: '',
  keyField: 'id',
  labelField: 'label',
});

const emit = defineEmits<{
  'update:modelValue': [value: SelectOption | null];
}>();

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

const getOptionKey = (option: SelectOption): string | number => {
  return option[props.keyField] || option.id;
};

const getOptionLabel = (option: SelectOption): string => {
  return option[props.labelField] || option.label;
};
</script>
