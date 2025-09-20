<template>
  <Menu as="div" class="relative inline-block">
    <MenuButton
      :class="[
        'inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50',
        buttonClass,
      ]"
    >
      <slot name="button">
        {{ buttonText }}
        <ChevronDownIcon
          class="-mr-1 size-5 text-gray-400"
          aria-hidden="true"
        />
      </slot>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        :class="[
          'absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5',
          positionClass,
        ]"
      >
        <div
          v-for="(group, groupIndex) in items"
          :key="groupIndex"
          class="py-1"
        >
          <MenuItem
            v-for="item in group"
            :key="item.id"
            v-slot="{ active }"
            :disabled="item.disabled"
          >
            <component
              :is="item.href ? 'a' : 'button'"
              :href="item.href"
              :type="item.href ? undefined : 'button'"
              :disabled="item.disabled"
              :class="[
                active && !item.disabled
                  ? 'bg-gray-100 text-gray-900 outline-hidden'
                  : 'text-gray-700',
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer',
                'block w-full text-left px-4 py-2 text-sm',
              ]"
              @click="handleItemClick(item)"
            >
              <div class="flex items-center">
                <i
                  v-if="item.icon"
                  :class="[item.icon, 'mr-3 size-4']"
                  aria-hidden="true"
                />
                <span>{{ item.label }}</span>
                <i v-if="item.shortcut" class="ml-auto text-xs text-gray-400">{{
                  item.shortcut
                }}</i>
              </div>
            </component>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

export interface DropdownItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  action?: () => void;
}

export interface DropdownProps {
  items: DropdownItem[][];
  buttonText?: string;
  buttonClass?: string;
  position?: 'left' | 'right';
}

const props = withDefaults(defineProps<DropdownProps>(), {
  buttonText: 'Options',
  buttonClass: 'bg-white text-gray-900',
  position: 'right',
});

const emit = defineEmits<{
  'item-click': [item: DropdownItem];
}>();

const positionClass = computed(() => {
  return props.position === 'left'
    ? 'left-0 origin-top-left'
    : 'right-0 origin-top-right';
});

const handleItemClick = (item: DropdownItem) => {
  if (item.disabled) return;

  if (item.action) {
    item.action();
  }

  emit('item-click', item);
};
</script>
