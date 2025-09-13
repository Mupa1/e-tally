import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Lazy load components
const Login = () => import('@/views/Login.vue');
const Home = () => import('@/views/Home.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const UserManagement = () => import('@/views/UserManagement.vue');
const CountyManagement = () => import('@/views/CountyManagement.vue');

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false,
      title: 'e-Tally - Election Monitoring System',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, title: 'Login - e-Tally' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, title: 'Dashboard - e-Tally' },
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, title: 'User Management - e-Tally' },
  },
  {
    path: '/counties',
    name: 'CountyManagement',
    component: CountyManagement,
    meta: { requiresAuth: true, title: 'County Management - e-Tally' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
];

// Navigation guard
export function setupRouterGuards(router: any) {
  router.beforeEach((to: any, from: any, next: any) => {
    const authStore = useAuthStore();

    // Set page title
    if (to.meta.title) {
      document.title = to.meta.title;
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login');
      return;
    }

    // Redirect authenticated users away from login page
    if (to.name === 'Login' && authStore.isAuthenticated) {
      next('/dashboard');
      return;
    }

    next();
  });
}
