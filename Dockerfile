# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# --- Build Arguments for Secrets ---
# These ARGs must be passed in during the 'docker build' or 'gcloud builds submit' command.
# Example: --build-arg VITE_GEMINI_API_KEY="your_key"
ARG VITE_GEMINI_API_KEY
ARG VITE_GOOGLE_API_KEY

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# --- Create a temporary .env file from build arguments ---
# This command writes the build arguments into a .env file that Vite will use.
# This file will only exist within this build stage and won't be in the final image.
RUN echo "VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}" > .env
RUN echo "VITE_GOOGLE_API_KEY=${VITE_GOOGLE_API_KEY}" >> .env

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
