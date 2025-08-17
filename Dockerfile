# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# --- Build Arguments for Secrets ---
# These ARGs must be passed in during the 'docker build' or 'gcloud builds submit' command.
# Example: --build-arg VITE_GEMINI_API_KEY="your_key"
ARG VITE_GEMINI_API_KEY
ARG VITE_GOOGLE_API_KEY
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_APP_VERSION
ARG VITE_BUILD_TIMESTAMP

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
RUN echo "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}" >> .env
RUN echo "VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}" >> .env
RUN echo "VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}" >> .env
RUN echo "VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}" >> .env
RUN echo "VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}" >> .env
RUN echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}" >> .env
RUN echo "VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}" >> .env
RUN echo "VITE_APP_VERSION=${VITE_APP_VERSION}" >> .env
RUN echo "VITE_BUILD_TIMESTAMP=${VITE_BUILD_TIMESTAMP}" >> .env

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration template and the startup script
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY start.sh /start.sh

# Install gettext for envsubst
RUN apk --no-cache add gettext

# Make the startup script executable
RUN chmod +x /start.sh

# Expose port 8080 and start the application using the script
EXPOSE 8080
CMD ["/start.sh"]
