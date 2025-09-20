import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import { routes } from './router';
import './assets/css/main.css';

const app = createApp(App);

// Create Pinia store
const pinia = createPinia();
app.use(pinia);

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Setup router guards before using the router
import { setupRouterGuards } from './router';
setupRouterGuards(router);

app.use(router);

// Setup toastification
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
});

app.mount('#app');
