// Shared types for the e-Tally monorepo

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

export enum UserRole {
  CENTRAL_COMMAND_ADMIN = 'CENTRAL_COMMAND_ADMIN',
  PRESIDENTIAL_ELECTION_OBSERVER = 'PRESIDENTIAL_ELECTION_OBSERVER',
  PARLIAMENTARY_ELECTION_OBSERVER = 'PARLIAMENTARY_ELECTION_OBSERVER',
  LOCAL_GOVERNMENT_ELECTION_OBSERVER = 'LOCAL_GOVERNMENT_ELECTION_OBSERVER',
  SENATORIAL_ELECTION_OBSERVER = 'SENATORIAL_ELECTION_OBSERVER',
  GUBERNATORIAL_ELECTION_OBSERVER = 'GUBERNATORIAL_ELECTION_OBSERVER',
  COUNTY_LEVEL_SUPERVISOR = 'COUNTY_LEVEL_SUPERVISOR',
  CONSTITUENCY_LEVEL_SUPERVISOR = 'CONSTITUENCY_LEVEL_SUPERVISOR',
  COUNTY_ASSEMBLY_WARD_SUPERVISOR = 'COUNTY_ASSEMBLY_WARD_SUPERVISOR',
}

export interface County {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Constituency {
  id: string;
  code: string;
  name: string;
  countyId: string;
  county?: County;
  createdAt: string;
  updatedAt: string;
}

export interface CAW {
  id: string;
  code: string;
  name: string;
  constituencyId: string;
  constituency?: Constituency;
  createdAt: string;
  updatedAt: string;
}

export interface PollingStation {
  id: string;
  code: string;
  name: string;
  constituencyId: string;
  cawId: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  isActive: boolean;
  constituency?: Constituency;
  caw?: CAW;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  party?: string;
  electionType: ElectionType;
  constituencyId?: string;
  cawId?: string;
  isActive: boolean;
  constituency?: Constituency;
  caw?: CAW;
  createdAt: string;
  updatedAt: string;
}

export enum ElectionType {
  PRESIDENTIAL = 'PRESIDENTIAL',
  PARLIAMENTARY = 'PARLIAMENTARY',
  LOCAL_GOVERNMENT = 'LOCAL_GOVERNMENT',
  SENATORIAL = 'SENATORIAL',
  GUBERNATORIAL = 'GUBERNATORIAL',
  COUNTY_ASSEMBLY_REPRESENTATIVE = 'COUNTY_ASSEMBLY_REPRESENTATIVE',
  WOMENS_REPRESENTATIVE = 'WOMENS_REPRESENTATIVE',
}

export interface ElectionResult {
  id: string;
  pollingStationId: string;
  candidateId: string;
  votes: number;
  spoiltVotes: number;
  totalVotes: number;
  voterTurnout: number;
  isVerified: boolean;
  reportedAt: string;
  verifiedAt?: string;
  pollingStation?: PollingStation;
  candidate?: Candidate;
  reporter?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  pollingStationId: string;
  title: string;
  description?: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  latitude?: number;
  longitude?: number;
  isResolved: boolean;
  resolvedAt?: string;
  pollingStation?: PollingStation;
  reporter?: User;
  media?: IncidentMedia[];
  createdAt: string;
  updatedAt: string;
}

export enum IncidentType {
  VIOLENCE = 'VIOLENCE',
  VOTER_INTIMIDATION = 'VOTER_INTIMIDATION',
  EQUIPMENT_FAILURE = 'EQUIPMENT_FAILURE',
  IRREGULARITY = 'IRREGULARITY',
  OTHER = 'OTHER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface IncidentMedia {
  id: string;
  incidentId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface VoterRegistration {
  id: string;
  pollingStationId: string;
  registeredVoters: number;
  source: string;
  isActive: boolean;
  pollingStation?: PollingStation;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  user?: User;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Authentication types
export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
  imei?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  imei?: string;
  role: UserRole;
}

// Geographic assignment types
export interface UserCounty {
  id: string;
  userId: string;
  countyId: string;
  county: County;
  createdAt: string;
}

export interface UserConstituency {
  id: string;
  userId: string;
  constituencyId: string;
  constituency: Constituency;
  createdAt: string;
}

export interface UserCAW {
  id: string;
  userId: string;
  cawId: string;
  caw: CAW;
  createdAt: string;
}

export interface UserAssignments {
  counties: County[];
  constituencies: Constituency[];
  caws: CAW[];
}


