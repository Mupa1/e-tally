<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed top-0 w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link
            to="/"
            class="flex items-center text-xl font-bold text-slate-600"
          >
            <i class="fas fa-vote-yea mr-2 text-blue-600"></i>
            e-Tally
          </router-link>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>

          <!-- Desktop menu -->
          <div class="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >Features</a
            >
            <a
              href="#about"
              class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >About</a
            >
            <a
              href="#contact"
              class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >Contact</a
            >
            <router-link to="/login" class="btn-outline-primary">
              <i class="fas fa-sign-in-alt mr-2"></i>
              Login
            </router-link>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-show="mobileMenuOpen" class="md:hidden">
          <div
            class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200"
          >
            <a
              href="#features"
              class="block px-3 py-2 text-gray-600 hover:text-blue-600"
              >Features</a
            >
            <a
              href="#about"
              class="block px-3 py-2 text-gray-600 hover:text-blue-600"
              >About</a
            >
            <a
              href="#contact"
              class="block px-3 py-2 text-gray-600 hover:text-blue-600"
              >Contact</a
            >
            <router-link
              to="/login"
              class="block px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              Login
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section
      class="bg-gradient-to-br from-slate-600 to-blue-600 text-white pt-20 pb-16"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="fade-in">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              e-Tally Election Monitoring System
            </h1>
            <p class="text-xl text-blue-100 mb-8 leading-relaxed">
              Comprehensive, secure, and transparent election monitoring
              solution for Kenya's democratic process.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link
                to="/login"
                class="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <i class="fas fa-sign-in-alt mr-3"></i>
                Access System
              </router-link>
              <a
                href="#features"
                class="btn-outline-secondary text-lg px-8 py-4 inline-flex items-center justify-center bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600"
              >
                <i class="fas fa-info-circle mr-3"></i>
                Learn More
              </a>
            </div>
          </div>
          <div class="slide-in-right">
            <div class="hero-card">
              <i class="fas fa-vote-yea hero-icon"></i>
              <h3 class="text-2xl font-bold mb-4">Secure & Transparent</h3>
              <p class="text-lg text-blue-100">
                Real-time election monitoring with complete audit trails
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-slate-600 mb-4">Key Features</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced election monitoring capabilities designed for transparency
            and security
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="card feature-card h-full"
            :class="`slide-in-${index % 2 === 0 ? 'left' : 'right'}`"
          >
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-3">
              {{ feature.title }}
            </h4>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-slate-600 mb-6">
              About e-Tally
            </h2>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              e-Tally is a comprehensive election monitoring system designed
              specifically for Kenya's electoral process. Built with security,
              transparency, and reliability in mind.
            </p>
            <ul class="space-y-4">
              <li class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
                <span class="text-gray-700">Real-time result reporting</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
                <span class="text-gray-700"
                  >Secure authentication and authorization</span
                >
              </li>
              <li class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
                <span class="text-gray-700">Comprehensive audit logging</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
                <span class="text-gray-700">Mobile and web access</span>
              </li>
            </ul>
          </div>
          <div>
            <div class="stats-card">
              <div class="grid grid-cols-2 gap-8 text-center">
                <div>
                  <h3 class="text-4xl font-bold text-slate-600 mb-2">47</h3>
                  <p class="text-gray-600">Counties</p>
                </div>
                <div>
                  <h3 class="text-4xl font-bold text-slate-600 mb-2">290</h3>
                  <p class="text-gray-600">Constituencies</p>
                </div>
                <div>
                  <h3 class="text-4xl font-bold text-slate-600 mb-2">1,450</h3>
                  <p class="text-gray-600">Wards</p>
                </div>
                <div>
                  <h3 class="text-4xl font-bold text-slate-600 mb-2">
                    40,000+
                  </h3>
                  <p class="text-gray-600">Polling Stations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-slate-600 mb-4">Get in Touch</h2>
          <p class="text-xl text-gray-600 mb-12">
            Questions about e-Tally? We're here to help.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <i class="fas fa-envelope text-4xl text-blue-600 mb-4"></i>
              <h5 class="text-xl font-semibold text-gray-900 mb-2">Email</h5>
              <p class="text-gray-600">support@etally.ke</p>
            </div>
            <div class="text-center">
              <i class="fas fa-phone text-4xl text-blue-600 mb-4"></i>
              <h5 class="text-xl font-semibold text-gray-900 mb-2">Phone</h5>
              <p class="text-gray-600">+254 700 000 000</p>
            </div>
            <div class="text-center">
              <i class="fas fa-map-marker-alt text-4xl text-blue-600 mb-4"></i>
              <h5 class="text-xl font-semibold text-gray-900 mb-2">Address</h5>
              <p class="text-gray-600">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-600 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h5 class="text-2xl font-bold mb-4 flex items-center">
              <i class="fas fa-vote-yea mr-3"></i>
              e-Tally
            </h5>
            <p class="text-gray-300 mb-6 leading-relaxed">
              Secure, transparent, and reliable election monitoring system for
              Kenya's democratic process.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 class="text-lg font-semibold mb-4">Quick Links</h6>
              <ul class="space-y-2">
                <li>
                  <a
                    href="#features"
                    class="text-gray-300 hover:text-white transition-colors"
                    >Features</a
                  >
                </li>
                <li>
                  <a
                    href="#about"
                    class="text-gray-300 hover:text-white transition-colors"
                    >About</a
                  >
                </li>
                <li>
                  <a
                    href="#contact"
                    class="text-gray-300 hover:text-white transition-colors"
                    >Contact</a
                  >
                </li>
              </ul>
            </div>
            <div>
              <h6 class="text-lg font-semibold mb-4">System</h6>
              <ul class="space-y-2">
                <li>
                  <router-link
                    to="/login"
                    class="text-gray-300 hover:text-white transition-colors"
                    >Login</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/dashboard"
                    class="text-gray-300 hover:text-white transition-colors"
                    >Dashboard</router-link
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr class="my-8 border-gray-500" />
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-300 mb-4 md:mb-0">
            &copy; 2024 e-Tally. All rights reserved.
          </p>
          <p class="text-gray-300">Built with ❤️ for Kenya's Democracy</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const mobileMenuOpen = ref(false);

const features = ref([
  {
    icon: 'fas fa-shield-alt',
    title: 'Secure Authentication',
    description:
      'JWT-based authentication with role-based access control and secure session management.',
  },
  {
    icon: 'fas fa-users',
    title: 'User Management',
    description:
      'Complete user management system with role assignments, search, and pagination.',
  },
  {
    icon: 'fas fa-map-marker-alt',
    title: 'County Management',
    description:
      'Comprehensive county management with CRUD operations, search, and real-time updates.',
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Real-time Monitoring',
    description:
      'Live election results and incident reporting with instant notifications.',
  },
  {
    icon: 'fas fa-database',
    title: 'Data Integrity',
    description:
      'Immutable audit logs and encrypted data storage with backup systems.',
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Mobile Access',
    description:
      'Native mobile apps for Android and iOS with offline capability.',
  },
]);

onMounted(() => {
  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href')!);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        mobileMenuOpen.value = false; // Close mobile menu after clicking
      }
    });
  });
});
</script>

<style scoped>
.hero-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.feature-icon {
  font-size: 2.5rem;
  color: #2563eb;
  margin-bottom: 1rem;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stats-card h3 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

/* Custom animations */
.fade-in {
  animation: fadeIn 0.6s ease-in;
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
