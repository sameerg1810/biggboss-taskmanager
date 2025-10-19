# syntax=docker/dockerfile:1

# Use a slim Node.js base image for smaller size
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies using cache for faster builds
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Copy the rest of the application source code
COPY . .

# Copy the .env file into the container
# COPY .env .env

# Create a non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
