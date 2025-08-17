# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create uploads directory and set permissions
RUN mkdir -p uploads && chown -R node:node /app

# Install production dependencies only
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
ENV JWT_SECRET=change_this_in_production

# Switch to non-root user
USER node

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["node", "server.js"]