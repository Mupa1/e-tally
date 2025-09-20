import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useNavigation() {
  const route = useRoute();

  const navigationData = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'fas fa-tachometer-alt',
    },
    {
      name: 'User Management',
      href: '/users',
      icon: 'fas fa-users',
      children: [
        {
          name: 'User Management',
          href: '/users',
          icon: 'fas fa-users',
        },
        {
          name: 'Device Assignment',
          href: '/users/device-assignment',
          icon: 'fas fa-mobile-alt',
        },
        {
          name: 'Agents Management',
          href: '/users/agents',
          icon: 'fas fa-user-tie',
        },
      ],
    },
    {
      name: 'Election Hierarchy',
      href: '/election-hierarchy',
      icon: 'fas fa-sitemap',
      children: [
        {
          name: 'Overview',
          href: '/election-hierarchy/overview',
          icon: 'fas fa-chart-pie',
        },
        {
          name: 'Counties',
          href: '/counties',
          icon: 'fas fa-map-marker-alt',
        },
        {
          name: 'Constituency',
          href: '/constituencies',
          icon: 'fas fa-landmark',
        },
        {
          name: 'Wards CAW',
          href: '/wards',
          icon: 'fas fa-building',
        },
        {
          name: 'Polling Stations',
          href: '/pollingstation',
          icon: 'fas fa-poll',
        },
      ],
    },
  ];

  const navigation = computed(() =>
    navigationData.map((item) => {
      // Check if current item is active
      const isCurrentItem =
        route.name === item.name.replace(/\s+/g, '') ||
        (item.href === '/dashboard' && route.name === 'Dashboard') ||
        (item.href === '/users' && route.name === 'UserManagement') ||
        (item.href === '/counties' && route.name === 'CountyManagement') ||
        (item.href === '/constituencies' &&
          route.name === 'ConstituencyManagement') ||
        (item.href === '/election-hierarchy/overview' &&
          route.name === 'ElectionHierarchyOverview') ||
        (item.href === '/pollingstation' &&
          route.name === 'PollingStationManagement');

      // Check if any child is active
      const hasActiveChild = item.children?.some((child) => {
        if (child.href === '/users' && route.name === 'UserManagement')
          return true;
        if (
          child.href === '/election-hierarchy/overview' &&
          route.name === 'ElectionHierarchyOverview'
        )
          return true;
        if (child.href === '/counties' && route.name === 'CountyManagement')
          return true;
        if (
          child.href === '/constituencies' &&
          route.name === 'ConstituencyManagement'
        )
          return true;
        if (
          child.href === '/pollingstation' &&
          route.name === 'PollingStationManagement'
        )
          return true;
        return false;
      });

      return {
        ...item,
        current: isCurrentItem,
        expanded: hasActiveChild,
        children: item.children?.map((child) => ({
          ...child,
          current:
            (child.href === '/users' && route.name === 'UserManagement') ||
            (child.href === '/election-hierarchy/overview' &&
              route.name === 'ElectionHierarchyOverview') ||
            (child.href === '/counties' && route.name === 'CountyManagement') ||
            (child.href === '/constituencies' &&
              route.name === 'ConstituencyManagement') ||
            (child.href === '/pollingstation' &&
              route.name === 'PollingStationManagement'),
        })),
      };
    })
  );

  return {
    navigation,
  };
}
