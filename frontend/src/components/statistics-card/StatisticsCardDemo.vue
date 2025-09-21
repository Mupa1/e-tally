<template>
  <div class="space-y-12">
    <!-- Basic Statistics Card -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Basic Statistics Card
      </h2>
      <StatisticsCard :stats="basicStats" />
    </section>

    <!-- Enhanced Statistics Card -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Enhanced Statistics Card
      </h2>
      <StatisticsCardEnhanced
        :stats="enhancedStats"
        title="Election Dashboard"
        description="Comprehensive overview of election statistics"
        :columns="4"
        :loading="loading"
      />
    </section>

    <!-- Compact Statistics Cards -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Compact Statistics Cards
      </h2>
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
    </section>

    <!-- Mixed Format Statistics -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Mixed Format Statistics
      </h2>
      <StatisticsGrid :columns="3">
        <StatisticsCardCompact
          name="Revenue"
          :value="1234567"
          format="currency"
          icon="fas fa-dollar-sign"
          color="green"
          subtitle="Last 30 days"
        />
        <StatisticsCardCompact
          name="Growth Rate"
          :value="12.5"
          format="percentage"
          icon="fas fa-chart-line"
          color="blue"
          subtitle="Month over month"
        />
        <StatisticsCardCompact
          name="Status"
          value="Active"
          format="text"
          icon="fas fa-check-circle"
          color="green"
          subtitle="System status"
        />
      </StatisticsGrid>
    </section>

    <!-- Loading State Demo -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Loading State Demo</h2>
      <div class="flex gap-4">
        <button
          @click="toggleLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {{ loading ? 'Stop Loading' : 'Start Loading' }}
        </button>
      </div>
      <div class="mt-4">
        <StatisticsGrid :columns="3">
          <StatisticsCardCompact
            name="Loading Example"
            :value="1234"
            format="number"
            icon="fas fa-spinner"
            color="blue"
            :loading="loading"
          />
          <StatisticsCardCompact
            name="Another Stat"
            :value="5678"
            format="number"
            icon="fas fa-chart-bar"
            color="green"
            :loading="loading"
          />
          <StatisticsCardCompact
            name="Third Stat"
            :value="9012"
            format="number"
            icon="fas fa-trophy"
            color="purple"
            :loading="loading"
          />
        </StatisticsGrid>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  StatisticsCard,
  StatisticsCardEnhanced,
  StatisticsCardCompact,
  StatisticsGrid,
} from './index';

// Demo data
const basicStats = [
  { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
  { id: 2, name: 'Assets under holding', value: '$119 trillion' },
  { id: 3, name: 'New users annually', value: '46,000' },
];

const enhancedStats = [
  {
    id: 1,
    name: 'Total Counties',
    value: 49,
    format: 'number',
    color: 'blue',
    subtitle: 'Administrative divisions',
  },
  {
    id: 2,
    name: 'Constituencies',
    value: 292,
    format: 'number',
    color: 'green',
    subtitle: 'Electoral areas',
  },
  {
    id: 3,
    name: 'Polling Stations',
    value: 37133,
    format: 'number',
    color: 'orange',
    subtitle: 'Voting locations',
  },
  {
    id: 4,
    name: 'Registered Voters',
    value: 18142062,
    format: 'number',
    color: 'pink',
    subtitle: 'Eligible voters',
  },
];

const hierarchyStats = {
  totalCounties: 49,
  totalConstituencies: 292,
  totalWards: 1460,
  totalPollingStations: 37133,
  totalRegisteredVoters: 18142062,
};

const loading = ref(false);

const toggleLoading = () => {
  loading.value = !loading.value;
  if (loading.value) {
    setTimeout(() => {
      loading.value = false;
    }, 3000);
  }
};
</script>
