# e-Tally Election Monitoring System - Backend

A comprehensive Node.js TypeScript backend API for the e-Tally election monitoring system, built with Express.js, PostgreSQL, and Prisma ORM.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Geographic Hierarchy**: County → Constituency → County Assembly Ward (CAW) management
- **Election Management**: Polling stations, candidates, and voter registration
- **Result Reporting**: Real-time election result submission and validation
- **Incident Reporting**: Photo/video incident reporting with GPS tracking
- **Audit Logging**: Comprehensive audit trail for all system actions
- **Security**: Encryption at rest and in transit, rate limiting, input validation
- **Docker Support**: Containerized deployment with Docker Compose

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Joi
- **Logging**: Winston
- **Containerization**: Docker

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- Docker and Docker Compose (for containerized deployment)

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd e-tally-backend
```

2. Copy environment variables:

```bash
cp env.example .env
```

3. Update the `.env` file with your configuration:

```bash
# Database Configuration
DATABASE_URL="postgresql://etally_user:etally_password@localhost:5432/etally_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Encryption Configuration
ENCRYPTION_KEY="your-32-character-encryption-key-here"
```

4. Start the services:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
docker-compose exec backend npx prisma migrate deploy
```

6. Generate Prisma client:

```bash
docker-compose exec backend npx prisma generate
```

### Manual Setup

1. Install dependencies:

```bash
npm install
```

2. Set up PostgreSQL database and update `.env` file

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Start the development server:

```bash
npm run dev
```

## API Documentation

### Base URL

- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

### Authentication

All API endpoints (except `/health` and `/api/auth/login`) require authentication via JWT token.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/change-password` - Change password

#### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/activate` - Activate user (admin only)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin only)
- `POST /api/users/:id/assign-counties` - Assign user to counties
- `POST /api/users/:id/assign-constituencies` - Assign user to constituencies
- `POST /api/users/:id/assign-caws` - Assign user to CAWs

#### Geographic Hierarchy

- `GET /api/counties` - Get all counties
- `GET /api/counties/:id` - Get county by ID
- `POST /api/counties` - Create county (admin only)
- `PUT /api/counties/:id` - Update county (admin only)
- `DELETE /api/counties/:id` - Delete county (admin only)
- `POST /api/counties/bulk-import` - Bulk import counties (admin only)

- `GET /api/constituencies` - Get all constituencies
- `GET /api/constituencies/:id` - Get constituency by ID
- `POST /api/constituencies` - Create constituency (admin only)
- `PUT /api/constituencies/:id` - Update constituency (admin only)
- `DELETE /api/constituencies/:id` - Delete constituency (admin only)
- `POST /api/constituencies/bulk-import` - Bulk import constituencies (admin only)

- `GET /api/caws` - Get all CAWs
- `GET /api/caws/:id` - Get CAW by ID
- `POST /api/caws` - Create CAW (admin only)
- `PUT /api/caws/:id` - Update CAW (admin only)
- `DELETE /api/caws/:id` - Delete CAW (admin only)
- `POST /api/caws/bulk-import` - Bulk import CAWs (admin only)

#### Polling Stations

- `GET /api/polling-stations` - Get all polling stations
- `GET /api/polling-stations/:id` - Get polling station by ID
- `POST /api/polling-stations` - Create polling station (admin only)
- `PUT /api/polling-stations/:id` - Update polling station (admin only)
- `DELETE /api/polling-stations/:id` - Delete polling station (admin only)

#### Candidates

- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create candidate (admin only)
- `PUT /api/candidates/:id` - Update candidate (admin only)
- `DELETE /api/candidates/:id` - Delete candidate (admin only)

#### Election Results

- `GET /api/election-results` - Get all election results
- `GET /api/election-results/:id` - Get election result by ID
- `POST /api/election-results` - Submit election result (mobile app only)
- `PUT /api/election-results/:id` - Update election result (mobile app only)
- `PUT /api/election-results/:id/verify` - Verify election result (admin only)

#### Incidents

- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `POST /api/incidents` - Report incident (mobile app only)
- `PUT /api/incidents/:id` - Update incident (mobile app only)
- `PUT /api/incidents/:id/resolve` - Resolve incident (admin only)

#### Audit

- `GET /api/audit` - Get audit logs (admin only)
- `GET /api/audit/:id` - Get audit log by ID (admin only)
- `GET /api/audit/stats/overview` - Get audit statistics (admin only)

## User Roles

- **CENTRAL_COMMAND_ADMIN**: Full system access
- **PRESIDENTIAL_ELECTION_OBSERVER**: Presidential election monitoring
- **PARLIAMENTARY_ELECTION_OBSERVER**: Parliamentary election monitoring
- **LOCAL_GOVERNMENT_ELECTION_OBSERVER**: Local government election monitoring
- **SENATORIAL_ELECTION_OBSERVER**: Senatorial election monitoring
- **GUBERNATORIAL_ELECTION_OBSERVER**: Gubernatorial election monitoring
- **COUNTY_LEVEL_SUPERVISOR**: County-level supervision
- **CONSTITUENCY_LEVEL_SUPERVISOR**: Constituency-level supervision
- **COUNTY_ASSEMBLY_WARD_SUPERVISOR**: CAW-level supervision

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions based on user roles
- **IMEI Validation**: Mobile device registration and validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation using Joi
- **Audit Logging**: Complete audit trail for all actions
- **Encryption**: Data encryption at rest and in transit
- **CORS Protection**: Cross-origin resource sharing protection
- **Security Headers**: Security headers via Helmet.js

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client
- `npm run studio` - Open Prisma Studio

### Database Management

- **Migrations**: `npx prisma migrate dev`
- **Reset**: `npx prisma migrate reset`
- **Studio**: `npx prisma studio`
- **Generate**: `npx prisma generate`

## Deployment

### Production Environment Variables

Ensure the following environment variables are set in production:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment

1. Build and start services:

```bash
docker-compose up -d
```

2. Run migrations:

```bash
docker-compose exec backend npx prisma migrate deploy
```

3. Generate Prisma client:

```bash
docker-compose exec backend npx prisma generate
```

## Monitoring

- **Health Check**: `GET /health`
- **Logs**: Check container logs with `docker-compose logs backend`
- **Database**: Use Prisma Studio for database management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
