import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.vue';
import { routes } from './router';
import './assets/css/main.css';
import './assets/css/sidebar.css';
import './assets/css/page-header.css';
import './assets/css/bulk-upload-modal.css';
import './assets/css/change-password-modal.css';
import './assets/css/create-user-modal.css';
import './assets/css/edit-user-modal.css';
import './assets/css/view-user-modal.css';

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
