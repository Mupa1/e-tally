# Use Node.js 22 Alpine image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache make g++ openssl openssl-dev

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Create uploads directory
RUN mkdir -p uploads logs
RUN chown -R nodejs:nodejs uploads logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
