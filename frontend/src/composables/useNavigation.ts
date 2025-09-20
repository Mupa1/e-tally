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
    },
    {
      name: 'County Management',
      href: '/counties',
      icon: 'fas fa-map-marker-alt',
    },
    {
      name: 'Constituency Management',
      href: '/constituencies',
      icon: 'fas fa-landmark',
    },
    {
      name: 'Polling Station Management',
      href: '/pollingstation',
      icon: 'fas fa-poll',
    },
  ];

  const navigation = computed(() =>
    navigationData.map((item) => ({
      ...item,
      current:
        route.name === item.name.replace(/\s+/g, '') ||
        (item.href === '/dashboard' && route.name === 'Dashboard') ||
        (item.href === '/users' && route.name === 'UserManagement') ||
        (item.href === '/counties' && route.name === 'CountyManagement') ||
        (item.href === '/constituencies' &&
          route.name === 'ConstituencyManagement') ||
        (item.href === '/pollingstation' &&
          route.name === 'PollingStationManagement'),
    }))
  );

  return {
    navigation,
  };
}
