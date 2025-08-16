# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Add a build argument to bust cache for npm install
# This allows you to force a rebuild of this layer by passing a changing value
# during the build, e.g., --build-arg CACHE_BUST_NPM_INSTALL=$(date +%s)
ARG CACHE_BUST_NPM_INSTALL=1

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Add a build argument to bust cache for npm build
# This allows you to force a rebuild of this layer by passing a changing value
# during the build, e.g., --build-arg CACHE_BUST_NPM_BUILD=$(date +%s)
ARG CACHE_BUST_NPM_BUILD=1

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
