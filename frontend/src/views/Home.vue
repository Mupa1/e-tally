<template>
  <div class="home-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <i class="fas fa-vote-yea me-2"></i>
          e-Tally
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#features">Features</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#contact">Contact</a>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link">
                <i class="fas fa-sign-in-alt me-1"></i>
                Login
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="hero-content fade-in">
              <h1>e-Tally Election Monitoring System</h1>
              <p class="lead">
                Comprehensive, secure, and transparent election monitoring
                solution for Kenya's democratic process.
              </p>
              <div class="hero-buttons">
                <router-link to="/login" class="btn btn-light btn-lg me-3">
                  <i class="fas fa-sign-in-alt me-2"></i>
                  Access System
                </router-link>
                <a href="#features" class="btn btn-outline-light btn-lg">
                  <i class="fas fa-info-circle me-2"></i>
                  Learn More
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image slide-in-right">
              <div class="hero-card">
                <i class="fas fa-vote-yea hero-icon"></i>
                <h3>Secure & Transparent</h3>
                <p>Real-time election monitoring with complete audit trails</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="section-title">Key Features</h2>
            <p class="section-subtitle">
              Advanced election monitoring capabilities designed for
              transparency and security
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div
            class="col-md-4"
            v-for="(feature, index) in features"
            :key="index"
          >
            <div
              class="card feature-card h-100"
              :class="`slide-in-${index % 2 === 0 ? 'left' : 'right'}`"
            >
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="mb-4">About e-Tally</h2>
            <p class="lead">
              e-Tally is a comprehensive election monitoring system designed
              specifically for Kenya's electoral process. Built with security,
              transparency, and reliability in mind.
            </p>
            <ul class="list-unstyled">
              <li class="mb-2">
                <i class="fas fa-check-circle text-success me-2"></i>
                Real-time result reporting
              </li>
              <li class="mb-2">
                <i class="fas fa-check-circle text-success me-2"></i>
                Secure authentication and authorization
              </li>
              <li class="mb-2">
                <i class="fas fa-check-circle text-success me-2"></i>
                Comprehensive audit logging
              </li>
              <li class="mb-2">
                <i class="fas fa-check-circle text-success me-2"></i>
                Mobile and web access
              </li>
            </ul>
          </div>
          <div class="col-lg-6">
            <div class="about-image">
              <div class="stats-card">
                <div class="row text-center">
                  <div class="col-6">
                    <h3 class="text-primary">47</h3>
                    <p>Counties</p>
                  </div>
                  <div class="col-6">
                    <h3 class="text-primary">290</h3>
                    <p>Constituencies</p>
                  </div>
                  <div class="col-6">
                    <h3 class="text-primary">1,450</h3>
                    <p>Wards</p>
                  </div>
                  <div class="col-6">
                    <h3 class="text-primary">40,000+</h3>
                    <p>Polling Stations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="mb-4">Get in Touch</h2>
            <p class="lead mb-4">
              Questions about e-Tally? We're here to help.
            </p>
            <div class="contact-info">
              <div class="row">
                <div class="col-md-4">
                  <i class="fas fa-envelope fa-2x text-primary mb-3"></i>
                  <h5>Email</h5>
                  <p>support@etally.ke</p>
                </div>
                <div class="col-md-4">
                  <i class="fas fa-phone fa-2x text-primary mb-3"></i>
                  <h5>Phone</h5>
                  <p>+254 700 000 000</p>
                </div>
                <div class="col-md-4">
                  <i class="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
                  <h5>Address</h5>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <h5 class="mb-3">
              <i class="fas fa-vote-yea me-2"></i>
              e-Tally
            </h5>
            <p class="mb-3">
              Secure, transparent, and reliable election monitoring system for
              Kenya's democratic process.
            </p>
          </div>
          <div class="col-lg-6">
            <div class="row">
              <div class="col-md-6">
                <h6>Quick Links</h6>
                <ul class="list-unstyled">
                  <li><a href="#features" class="text-light">Features</a></li>
                  <li><a href="#about" class="text-light">About</a></li>
                  <li><a href="#contact" class="text-light">Contact</a></li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6>System</h6>
                <ul class="list-unstyled">
                  <li>
                    <router-link to="/login" class="text-light"
                      >Login</router-link
                    >
                  </li>
                  <li>
                    <router-link to="/dashboard" class="text-light"
                      >Dashboard</router-link
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr class="my-4" />
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0">&copy; 2024 e-Tally. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">Built with ❤️ for Kenya's Democracy</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

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
      }
    });
  });
});
</script>

<style scoped>
.hero-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
}

.stats-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.stats-card h3 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.contact-info i {
  display: block;
  margin-bottom: 1rem;
}

.hero-buttons {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 0 60px;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
