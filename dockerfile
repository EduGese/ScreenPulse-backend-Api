# ----------- STAGE 1: Build the app -----------
FROM node:20.11.1-alpine3.19 AS build

# Install dumb-init for PID 1 signal handling and process reaping
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package.json and lock file for caching dependencies
COPY package*.json ./

# Install all dependencies for build
RUN npm ci

# Copy the remaining application code
COPY . .

# Build TypeScript sources
RUN npm run build

# ----------- STAGE 2: Set up minimal production image -----------
FROM node:20.11.1-alpine3.19

# Install dumb-init
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create and use non-root user for security best practices
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001 -G nodejs

WORKDIR /app

# Copy only the compiled output, docs, and package definitions from builder image
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/docs ./docs

# Install only prod dependencies in runtime image
RUN npm ci --omit=dev && npm cache clean --force

# Ensure proper ownership for the non-root user
RUN chown -R nodeuser:nodejs /app

USER nodeuser

# Expose application port
EXPOSE 9000

# Start the node process with dumb-init for proper signal handling
CMD ["dumb-init", "npm", "start"]
