<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-user me-2"></i>
            User Details
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4 text-center mb-4">
              <div class="user-avatar">
                <i class="fas fa-user-circle fa-5x text-muted"></i>
              </div>
              <h4 class="mt-3">{{ user.firstName }} {{ user.lastName }}</h4>
              <p class="text-muted">{{ user.email }}</p>
              <span class="badge fs-6" :class="getRoleBadgeClass(user.role)">
                {{ getRoleLabel(user.role) }}
              </span>
            </div>
            <div class="col-md-8">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Username</label>
                  <p class="form-control-plaintext">@{{ user.username }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Status</label>
                  <p>
                    <span
                      class="badge"
                      :class="user.isActive ? 'bg-success' : 'bg-danger'"
                    >
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Phone Number</label>
                  <p class="form-control-plaintext">
                    {{ user.phoneNumber || 'Not provided' }}
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">IMEI</label>
                  <p class="form-control-plaintext">
                    {{ user.imei || 'Not provided' }}
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Created</label>
                  <p class="form-control-plaintext">
                    {{ formatDate(user.createdAt) }}
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Last Updated</label>
                  <p class="form-control-plaintext">
                    {{ formatDate(user.updatedAt) }}
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Last Login</label>
                  <p class="form-control-plaintext">
                    {{
                      user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'
                    }}
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">User ID</label>
                  <p class="form-control-plaintext text-muted small">
                    {{ user.id }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Role Information -->
          <div class="card mt-4">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="fas fa-shield-alt me-2"></i>
                Role Information
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Role Description</h6>
                  <p class="text-muted">{{ getRoleDescription(user.role) }}</p>
                </div>
                <div class="col-md-6">
                  <h6>Permissions</h6>
                  <ul class="list-unstyled">
                    <li
                      v-for="permission in getRolePermissions(user.role)"
                      :key="permission"
                      class="mb-1"
                    >
                      <i class="fas fa-check text-success me-2"></i>
                      {{ permission }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Summary -->
          <div class="card mt-4">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="fas fa-chart-line me-2"></i>
                Activity Summary
              </h6>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-md-4">
                  <div class="stat-item">
                    <h4 class="text-primary">{{ getDaysSinceCreated() }}</h4>
                    <p class="text-muted mb-0">Days Active</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item">
                    <h4 class="text-success">
                      {{ user.isActive ? 'Yes' : 'No' }}
                    </h4>
                    <p class="text-muted mb-0">Currently Active</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item">
                    <h4 class="text-info">{{ getLastLoginDays() }}</h4>
                    <p class="text-muted mb-0">Days Since Last Login</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserRole } from '@/services/userService';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  close: [];
}>();

// User roles with descriptions
const userRoles = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description:
      'Full system access with all administrative privileges. Can manage all users, roles, and system settings.',
    permissions: [
      'Manage all users',
      'Assign any role',
      'Delete users',
      'Access all data',
      'System configuration',
      'Audit logs access',
    ],
  },
  CENTRAL_COMMAND_ADMIN: {
    label: 'Central Command Admin',
    description:
      'Administrative access to central command functions. Can manage users and oversee election operations.',
    permissions: [
      'Manage users (except SUPER_ADMIN)',
      'Assign most roles',
      'Oversee elections',
      'Access reports',
      'Manage locations',
    ],
  },
  CENTRAL_COMMAND_USER: {
    label: 'Central Command User',
    description:
      'Central command user with limited administrative access. Can view and manage basic user information.',
    permissions: [
      'View user information',
      'Change user passwords',
      'Activate/deactivate users',
      'Access basic reports',
    ],
  },
  PRESIDENTIAL_ELECTION_OBSERVER: {
    label: 'Presidential Election Observer',
    description:
      'Observer for presidential elections with access to relevant polling stations and results.',
    permissions: [
      'View presidential election data',
      'Report incidents',
      'Access assigned polling stations',
      'Submit observations',
    ],
  },
  PARLIAMENTARY_ELECTION_OBSERVER: {
    label: 'Parliamentary Election Observer',
    description:
      'Observer for parliamentary elections with access to constituency-level data.',
    permissions: [
      'View parliamentary election data',
      'Report incidents',
      'Access assigned constituencies',
      'Submit observations',
    ],
  },
  LOCAL_GOVERNMENT_ELECTION_OBSERVER: {
    label: 'Local Government Election Observer',
    description:
      'Observer for local government elections with access to ward-level data.',
    permissions: [
      'View local government election data',
      'Report incidents',
      'Access assigned wards',
      'Submit observations',
    ],
  },
  SENATORIAL_ELECTION_OBSERVER: {
    label: 'Senatorial Election Observer',
    description:
      'Observer for senatorial elections with access to county-level data.',
    permissions: [
      'View senatorial election data',
      'Report incidents',
      'Access assigned counties',
      'Submit observations',
    ],
  },
  GUBERNATORIAL_ELECTION_OBSERVER: {
    label: 'Gubernatorial Election Observer',
    description:
      'Observer for gubernatorial elections with access to county-level data.',
    permissions: [
      'View gubernatorial election data',
      'Report incidents',
      'Access assigned counties',
      'Submit observations',
    ],
  },
  COUNTY_LEVEL_SUPERVISOR: {
    label: 'County Level Supervisor',
    description:
      'Supervisor responsible for overseeing election operations at the county level.',
    permissions: [
      'Supervise county operations',
      'Manage polling stations',
      'Review reports',
      'Coordinate observers',
    ],
  },
  CONSTITUENCY_LEVEL_SUPERVISOR: {
    label: 'Constituency Level Supervisor',
    description:
      'Supervisor responsible for overseeing election operations at the constituency level.',
    permissions: [
      'Supervise constituency operations',
      'Manage polling stations',
      'Review reports',
      'Coordinate observers',
    ],
  },
  COUNTY_ASSEMBLY_WARD_SUPERVISOR: {
    label: 'County Assembly Ward Supervisor',
    description:
      'Supervisor responsible for overseeing election operations at the ward level.',
    permissions: [
      'Supervise ward operations',
      'Manage polling stations',
      'Review reports',
      'Coordinate observers',
    ],
  },
};

// Utility functions
const getRoleLabel = (role: UserRole) => {
  return userRoles[role]?.label || role;
};

const getRoleDescription = (role: UserRole) => {
  return userRoles[role]?.description || 'No description available';
};

const getRolePermissions = (role: UserRole) => {
  return userRoles[role]?.permissions || [];
};

const getRoleBadgeClass = (role: UserRole) => {
  const classes = {
    SUPER_ADMIN: 'bg-danger',
    CENTRAL_COMMAND_ADMIN: 'bg-warning',
    CENTRAL_COMMAND_USER: 'bg-info',
    PRESIDENTIAL_ELECTION_OBSERVER: 'bg-primary',
    PARLIAMENTARY_ELECTION_OBSERVER: 'bg-primary',
    LOCAL_GOVERNMENT_ELECTION_OBSERVER: 'bg-primary',
    SENATORIAL_ELECTION_OBSERVER: 'bg-primary',
    GUBERNATORIAL_ELECTION_OBSERVER: 'bg-primary',
    COUNTY_LEVEL_SUPERVISOR: 'bg-success',
    CONSTITUENCY_LEVEL_SUPERVISOR: 'bg-success',
    COUNTY_ASSEMBLY_WARD_SUPERVISOR: 'bg-success',
  };
  return classes[role] || 'bg-secondary';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDaysSinceCreated = () => {
  const created = new Date(props.user.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getLastLoginDays = () => {
  if (!props.user.lastLoginAt) return 'Never';
  const lastLogin = new Date(props.user.lastLoginAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-dialog {
  max-width: 800px;
}

.user-avatar {
  margin-bottom: 1rem;
}

.stat-item {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.stat-item h4 {
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.form-control-plaintext {
  padding: 0.375rem 0;
  margin-bottom: 0;
  line-height: 1.5;
  color: #495057;
  background-color: transparent;
  border: solid transparent;
  border-width: 1px 0;
}

.list-unstyled li {
  padding: 0.25rem 0;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}
</style>
