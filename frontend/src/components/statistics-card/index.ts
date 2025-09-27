// Export all statistics card components
export { default as StatisticsCard } from './StatisticsCard.vue';
export { default as StatisticsCardEnhanced } from './StatisticsCardEnhanced.vue';
export { default as StatisticsGrid } from './StatisticsGrid.vue';
export { default as StatisticsCardCompact } from './StatisticsCardCompact.vue';

// Export types for TypeScript support
export interface StatItem {
  id: string | number;
  name: string;
  value: string | number;
  subtitle?: string;
  color?:
    | 'blue'
    | 'green'
    | 'red'
    | 'yellow'
    | 'purple'
    | 'indigo'
    | 'pink'
    | 'gray';
  format?: 'number' | 'currency' | 'percentage' | 'text';
}

export interface StatisticsCardProps {
  stats: StatItem[];
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  loading?: boolean;
}

export interface StatisticsCardCompactProps {
  name: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?:
    | 'blue'
    | 'green'
    | 'red'
    | 'yellow'
    | 'purple'
    | 'indigo'
    | 'pink'
    | 'orange';
  format?: 'number' | 'currency' | 'percentage' | 'text';
  loading?: boolean;
}

export interface StatisticsGridProps {
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}
