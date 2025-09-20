import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Lazy load components
const Login = () => import('@/views/Login.vue');
const Home = () => import('@/views/Home.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const UserManagement = () => import('@/views/UserManagement.vue');
const CountyManagement = () => import('@/views/CountyManagement.vue');
const ConstituencyManagement = () =>
  import('@/views/ConstituencyManagement.vue');
const ElectionHierarchy = () => import('@/views/ElectionHierarchy.vue');
const UploadErrors = () => import('@/views/UploadErrors.vue');

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
    path: '/constituencies',
    name: 'ConstituencyManagement',
    component: ConstituencyManagement,
    meta: { requiresAuth: true, title: 'Constituency Management - e-Tally' },
  },
  {
    path: '/pollingstation',
    name: 'PollingStationManagement',
    component: ElectionHierarchy,
    meta: { requiresAuth: true, title: 'Polling Station Management - e-Tally' },
  },
  {
    path: '/election-overview',
    name: 'ElectionHierarchyOverview',
    component: ElectionHierarchy,
    meta: {
      requiresAuth: true,
      title: 'Election Hierarchy Overview - e-Tally',
    },
  },
  {
    path: '/upload-errors',
    name: 'UploadErrors',
    component: UploadErrors,
    meta: { requiresAuth: true, title: 'Upload Errors - e-Tally' },
  },
  // Catch-all route must be last
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

    // Debug logging
    console.log('Navigating to:', to.path, 'Name:', to.name);
    console.log('Requires auth:', to.meta.requiresAuth);
    console.log('Is authenticated:', authStore.isAuthenticated);

    // Set page title
    if (to.meta.title) {
      document.title = to.meta.title;
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      console.log('Redirecting to login - not authenticated');
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
