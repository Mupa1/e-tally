# Statistics Card Components

A collection of reusable Vue 3 components for displaying statistics and metrics in various layouts.

## Components

### 1. StatisticsCard

Basic statistics display component based on the original design.

```vue
<template>
  <StatisticsCard :stats="stats" />
</template>

<script setup>
import { StatisticsCard } from '@/components/statistics-card';

const stats = [
  { id: 1, name: 'Total Users', value: '1,234' },
  { id: 2, name: 'Active Sessions', value: '567' },
  { id: 3, name: 'Revenue', value: '$12,345' },
];
</script>
```

### 2. StatisticsCardEnhanced

Enhanced version with more customization options.

```vue
<template>
  <StatisticsCardEnhanced
    :stats="stats"
    title="Dashboard Overview"
    description="Key metrics for your application"
    :columns="4"
    :loading="isLoading"
  />
</template>

<script setup>
import { StatisticsCardEnhanced } from '@/components/statistics-card';

const stats = [
  {
    id: 1,
    name: 'Total Revenue',
    value: 1234567,
    format: 'currency',
    color: 'green',
    subtitle: 'Last 30 days',
  },
  {
    id: 2,
    name: 'Growth Rate',
    value: 12.5,
    format: 'percentage',
    color: 'blue',
  },
];
</script>
```

### 3. StatisticsCardCompact

Compact card format for dashboard tiles.

```vue
<template>
  <StatisticsCardCompact
    name="Total Users"
    :value="1234"
    format="number"
    icon="fas fa-users"
    color="blue"
    subtitle="Active users"
  />
</template>

<script setup>
import { StatisticsCardCompact } from '@/components/statistics-card';
</script>
```

### 4. StatisticsGrid

Grid wrapper for organizing multiple statistics cards.

```vue
<template>
  <StatisticsGrid title="Election Statistics" :columns="5" gap="lg">
    <StatisticsCardCompact
      v-for="stat in stats"
      :key="stat.id"
      :name="stat.name"
      :value="stat.value"
      :icon="stat.icon"
      :color="stat.color"
    />
  </StatisticsGrid>
</template>

<script setup>
import {
  StatisticsGrid,
  StatisticsCardCompact,
} from '@/components/statistics-card';
</script>
```

## Props

### StatisticsCard

- `stats: StatItem[]` - Array of statistics to display

### StatisticsCardEnhanced

- `stats: StatItem[]` - Array of statistics to display
- `title?: string` - Optional title
- `description?: string` - Optional description
- `columns?: 1 | 2 | 3 | 4 | 5 | 6` - Number of columns (default: 3)
- `loading?: boolean` - Show loading state (default: false)

### StatisticsCardCompact

- `name: string` - Statistic name
- `value: string | number` - Statistic value
- `subtitle?: string` - Optional subtitle
- `icon?: string` - FontAwesome icon class (default: 'fas fa-chart-bar')
- `color?: string` - Color theme (default: 'blue')
- `format?: string` - Value format (default: 'text')
- `loading?: boolean` - Show loading state (default: false)

### StatisticsGrid

- `title?: string` - Optional title
- `description?: string` - Optional description
- `columns?: 1 | 2 | 3 | 4 | 5 | 6` - Number of columns (default: 3)
- `gap?: 'sm' | 'md' | 'lg' | 'xl'` - Grid gap size (default: 'lg')
- `padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'` - Container padding (default: 'lg')

## Value Formats

- `text` - Display as-is (default)
- `number` - Format with thousand separators
- `currency` - Format as USD currency
- `percentage` - Add % suffix

## Color Themes

Available colors: `blue`, `green`, `red`, `yellow`, `purple`, `indigo`, `pink`, `orange`, `gray`

## Usage in Election Hierarchy

```vue
<template>
  <StatisticsGrid title="Election Hierarchy Overview" :columns="5">
    <StatisticsCardCompact
      name="Counties"
      :value="hierarchyStats.totalCounties"
      format="number"
      icon="fas fa-landmark"
      color="blue"
    />
    <StatisticsCardCompact
      name="Constituencies"
      :value="hierarchyStats.totalConstituencies"
      format="number"
      icon="fas fa-building"
      color="green"
    />
    <StatisticsCardCompact
      name="Wards"
      :value="hierarchyStats.totalWards"
      format="number"
      icon="fas fa-map-marker-alt"
      color="purple"
    />
    <StatisticsCardCompact
      name="Polling Stations"
      :value="hierarchyStats.totalPollingStations"
      format="number"
      icon="fas fa-poll"
      color="orange"
    />
    <StatisticsCardCompact
      name="Registered Voters"
      :value="hierarchyStats.totalRegisteredVoters"
      format="number"
      icon="fas fa-users"
      color="pink"
    />
  </StatisticsGrid>
</template>
```
