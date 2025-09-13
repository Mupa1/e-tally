# e-Tally Election Monitoring System

A comprehensive election monitoring system built with modern web technologies, designed for real-time election result reporting, incident tracking, and administrative oversight.

## 🏗️ Monorepo Structure

This is a monorepo containing three main applications:

```
e-Tally/
├── backend/          # Node.js TypeScript API server
├── frontend/         # Vue.js admin dashboard
├── mobile/           # React Native mobile app
└── shared/           # Shared types and utilities
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- For mobile development: React Native CLI, Android Studio, Xcode

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd e-Tally
```

2. **Install all dependencies:**

```bash
npm run install:all
```

3. **Set up environment variables:**

```bash
# Backend
cp backend/env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/env.example frontend/.env
# Edit frontend/.env with your configuration

# Mobile
cp mobile/env.example mobile/.env
# Edit mobile/.env with your configuration
```

4. **Start all services:**

```bash
# Development mode (backend + frontend)
npm run dev

# Or start individual services
npm run dev:backend
npm run dev:frontend
npm run dev:mobile
```

## 📱 Applications

### Backend API (`/backend`)

- **Technology**: Node.js, TypeScript, Express.js, PostgreSQL, Prisma
- **Port**: 3000
- **Features**:
  - JWT authentication with role-based access control
  - Geographic hierarchy management (County → Constituency → CAW)
  - Election result reporting and validation
  - Incident reporting with media upload
  - Comprehensive audit logging
  - Real-time data validation

### Frontend Admin Dashboard (`/frontend`)

- **Technology**: Vue.js 3, TypeScript, Vite, Bootstrap
- **Port**: 3001
- **Features**:
  - User management and role assignment
  - Geographic data management
  - Election monitoring dashboard
  - Real-time result visualization
  - Incident management
  - Audit log viewing

### Mobile App (`/mobile`)

- **Technology**: React Native, TypeScript
- **Features**:
  - Biometric authentication
  - GPS tracking
  - Election result submission
  - Photo/video incident reporting
  - Offline capability
  - Real-time synchronization

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                 # Start backend + frontend
npm run dev:backend        # Start backend only
npm run dev:frontend       # Start frontend only
npm run dev:mobile         # Start mobile development

# Building
npm run build              # Build all applications
npm run build:backend      # Build backend only
npm run build:frontend     # Build frontend only
npm run build:mobile       # Build mobile only

# Testing
npm run test               # Run all tests
npm run test:backend       # Test backend only
npm run test:frontend      # Test frontend only
npm run test:mobile        # Test mobile only

# Linting
npm run lint               # Lint all code
npm run lint:backend       # Lint backend only
npm run lint:frontend      # Lint frontend only
npm run lint:mobile        # Lint mobile only

# Utilities
npm run clean              # Clean all node_modules and dist
npm run install:all        # Install all dependencies
```

### Database Setup

1. **Using Docker Compose (Recommended):**

```bash
cd backend
docker-compose up -d
```

2. **Run migrations:**

```bash
cd backend
npm run migrate
```

3. **Generate Prisma client:**

```bash
cd backend
npm run generate
```

## 🐳 Docker Deployment

### Full Stack Deployment

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Service Deployment

```bash
# Backend only
cd backend
docker-compose up -d

# Frontend only
cd frontend
docker-compose up -d
```

## 📊 System Architecture

### User Roles

- **CENTRAL_COMMAND_ADMIN**: Full system access
- **PRESIDENTIAL_ELECTION_OBSERVER**: Presidential election monitoring
- **PARLIAMENTARY_ELECTION_OBSERVER**: Parliamentary election monitoring
- **LOCAL_GOVERNMENT_ELECTION_OBSERVER**: Local government election monitoring
- **SENATORIAL_ELECTION_OBSERVER**: Senatorial election monitoring
- **GUBERNATORIAL_ELECTION_OBSERVER**: Gubernatorial election monitoring
- **COUNTY_LEVEL_SUPERVISOR**: County-level supervision
- **CONSTITUENCY_LEVEL_SUPERVISOR**: Constituency-level supervision
- **COUNTY_ASSEMBLY_WARD_SUPERVISOR**: CAW-level supervision

### Geographic Hierarchy

- **County** → **Constituency** → **County Assembly Ward (CAW)**
- **Polling Stations** are assigned to specific CAWs
- **Users** can be assigned to different geographic levels based on their role

### Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- IMEI-based device registration for mobile
- Rate limiting and input validation
- Comprehensive audit logging
- Data encryption at rest and in transit

## 🔧 Configuration

### Environment Variables

Each application has its own `.env` file:

- `backend/.env` - Database, JWT secrets, server configuration
- `frontend/.env` - API endpoints, authentication settings
- `mobile/.env` - API endpoints, mobile-specific settings

### Database Schema

The system uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: Authentication and role management
- **Geographic**: Counties, Constituencies, CAWs, Polling Stations
- **Election**: Candidates, Results, Voter Registration
- **Incidents**: Reports with media attachments
- **Audit**: Complete action logging

## 📈 Monitoring

- **Health Checks**: Available at `/health` for each service
- **Logging**: Structured logging with Winston
- **Metrics**: Built-in performance monitoring
- **Audit Trail**: Complete user action tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation in each application folder

## 🗺️ Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline-first mobile app
- [ ] Integration with external election systems
- [ ] Advanced reporting features
- [ ] Performance optimizations
