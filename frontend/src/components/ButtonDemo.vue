<template>
  <div class="p-8 space-y-8">
    <div>
      <h2 class="text-2xl font-bold mb-4">Button Component Demo</h2>

      <!-- Sizes -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Sizes</h3>
        <div class="flex items-center gap-4">
          <Button
            text="Small Button"
            size="sm"
            icon="fas fa-check"
            @click="handleClick"
          />
          <Button
            text="Medium Button"
            size="md"
            icon="fas fa-check"
            @click="handleClick"
          />
          <Button
            text="Large Button"
            size="lg"
            icon="fas fa-check"
            @click="handleClick"
          />
        </div>
      </div>

      <!-- Variants -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Variants</h3>
        <div class="flex items-center gap-4">
          <Button
            text="Primary"
            variant="primary"
            icon="fas fa-check"
            @click="handleClick"
          />
          <Button
            text="Secondary"
            variant="secondary"
            icon="fas fa-check"
            @click="handleClick"
          />
          <Button
            text="Success"
            variant="success"
            icon="fas fa-check"
            @click="handleClick"
          />
          <Button
            text="Danger"
            variant="danger"
            icon="fas fa-check"
            @click="handleClick"
          />
          <Button
            text="Warning"
            variant="warning"
            icon="fas fa-check"
            @click="handleClick"
          />
          <Button
            text="Info"
            variant="info"
            icon="fas fa-check"
            @click="handleClick"
          />
        </div>
      </div>

      <!-- Icon Positions -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Icon Positions</h3>
        <div class="flex items-center gap-4">
          <Button
            text="Left Icon"
            icon="fas fa-arrow-left"
            icon-position="left"
            @click="handleClick"
          />
          <Button
            text="Right Icon"
            icon="fas fa-arrow-right"
            icon-position="right"
            @click="handleClick"
          />
        </div>
      </div>

      <!-- States -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">States</h3>
        <div class="flex items-center gap-4">
          <Button text="Normal" icon="fas fa-check" @click="handleClick" />
          <Button
            text="Disabled"
            icon="fas fa-check"
            disabled
            @click="handleClick"
          />
          <Button
            text="Loading"
            icon="fas fa-spinner fa-spin"
            loading
            @click="handleClick"
          />
        </div>
      </div>

      <!-- Without Icon -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Without Icon</h3>
        <div class="flex items-center gap-4">
          <Button text="Simple Button" @click="handleClick" />
          <Button
            text="Submit"
            type="submit"
            variant="success"
            @click="handleClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';

const handleClick = (event: MouseEvent) => {
  console.log('Button clicked!', event);
  alert('Button clicked!');
};
</script>
