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
  ];

  const navigation = computed(() =>
    navigationData.map((item) => {
      // Check if current item is active
      const isCurrentItem =
        route.name === item.name.replace(/\s+/g, '') ||
        (item.href === '/dashboard' && route.name === 'Dashboard') ||
        (item.href === '/users' && route.name === 'UserManagement');

      // Check if any child is active
      const hasActiveChild = item.children?.some((child) => {
        if (child.href === '/users' && route.name === 'UserManagement')
          return true;
        return false;
      });

      return {
        ...item,
        current: isCurrentItem,
        expanded: hasActiveChild,
        children: item.children?.map((child) => ({
          ...child,
          current: child.href === '/users' && route.name === 'UserManagement',
        })),
      };
    })
  );

  return {
    navigation,
  };
}
