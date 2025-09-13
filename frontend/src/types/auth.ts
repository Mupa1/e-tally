export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  imei?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'CENTRAL_COMMAND_ADMIN'
  | 'CENTRAL_COMMAND_USER'
  | 'PRESIDENTIAL_ELECTION_OBSERVER'
  | 'PARLIAMENTARY_ELECTION_OBSERVER'
  | 'LOCAL_GOVERNMENT_ELECTION_OBSERVER'
  | 'SENATORIAL_ELECTION_OBSERVER'
  | 'GUBERNATORIAL_ELECTION_OBSERVER'
  | 'COUNTY_LEVEL_SUPERVISOR'
  | 'CONSTITUENCY_LEVEL_SUPERVISOR'
  | 'COUNTY_ASSEMBLY_WARD_SUPERVISOR';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
  };
}
