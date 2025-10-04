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
  ];

  const navigation = computed(() =>
    navigationData.map((item) => {
      // Check if current item is active
      const isCurrentItem =
        route.name === item.name.replace(/\s+/g, '') ||
        (item.href === '/dashboard' && route.name === 'Dashboard');

      return {
        ...item,
        current: isCurrentItem,
      };
    })
  );

  return {
    navigation,
  };
}
