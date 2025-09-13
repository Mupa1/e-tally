# e-Tally Frontend

Vue.js frontend application for the e-Tally Election Monitoring System.

## Features

- **Modern Vue 3** with Composition API and TypeScript
- **Responsive Design** with Bootstrap 5
- **Authentication** with JWT tokens and role-based access control
- **State Management** with Pinia
- **Routing** with Vue Router
- **HTTP Client** with Axios and automatic token refresh
- **Notifications** with Vue Toastification
- **Icons** with Font Awesome

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable Vue components
│   ├── views/              # Page components
│   │   ├── Home.vue        # Landing page
│   │   ├── Login.vue       # Login page
│   │   └── Dashboard.vue   # Main dashboard
│   ├── stores/             # Pinia stores
│   │   └── auth.ts         # Authentication store
│   ├── services/           # API services
│   │   └── authService.ts  # Authentication API
│   ├── types/              # TypeScript type definitions
│   │   └── auth.ts         # Authentication types
│   ├── router/             # Vue Router configuration
│   │   └── index.ts        # Routes and guards
│   ├── assets/             # Static assets
│   │   └── css/            # Stylesheets
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── package.json
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── index.html              # HTML template
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 3000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The frontend runs on `http://localhost:3001` and automatically proxies API requests to the backend on `http://localhost:3000`.

## Pages

### Landing Page (`/`)

- Hero section with system overview
- Feature highlights
- About section with statistics
- Contact information
- Navigation to login

### Login Page (`/login`)

- Secure authentication form
- Demo credentials display
- Form validation
- Error handling
- Remember me functionality

### Dashboard (`/dashboard`)

- Main admin interface
- Statistics overview
- Recent activity feed
- System status
- Navigation sidebar
- User profile dropdown

## Authentication

The frontend uses JWT-based authentication with:

- **Access Tokens** for API requests
- **Refresh Tokens** for token renewal
- **Automatic Token Refresh** via Axios interceptors
- **Role-Based Access Control** with different user roles
- **Persistent Login** with localStorage

### User Roles

- `SUPER_ADMIN` - Full system access
- `CENTRAL_COMMAND_ADMIN` - Administrative access
- `CENTRAL_COMMAND_USER` - Limited access
- Various election observer roles

## API Integration

The frontend communicates with the backend through:

- **Axios HTTP Client** with base configuration
- **Request Interceptors** for adding auth tokens
- **Response Interceptors** for token refresh
- **Error Handling** with user-friendly messages
- **Type Safety** with TypeScript interfaces

## Styling

- **Bootstrap 5** for responsive layout and components
- **Custom CSS** with CSS variables for theming
- **Font Awesome** for icons
- **Responsive Design** for mobile and desktop
- **Modern UI** with glassmorphism effects

## State Management

Uses Pinia for state management with:

- **Auth Store** for user authentication state
- **Reactive State** with Vue 3 reactivity
- **Computed Properties** for derived state
- **Actions** for async operations
- **Persistence** with localStorage

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Environment Variables

The frontend uses Vite environment variables:

- `VITE_API_BASE_URL` - Backend API base URL (default: `/api`)
- `VITE_APP_TITLE` - Application title

## Deployment

The frontend can be deployed as a static site:

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your web server
3. Configure reverse proxy for API requests
4. Set up HTTPS for production

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test your changes thoroughly
5. Update documentation as needed
