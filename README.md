# biggboss-taskmanager

A full-stack, containerized task management application designed to help users create, manage, and track their daily tasks efficiently. This application features secure user authentication, an admin dashboard for user management, and a robust backend built with Node.js, Express, and MongoDB.

# BIGGBOSS Task Manager

A full-stack, containerized task management application designed to help users create, manage, and track their daily tasks efficiently. This application features secure user authentication, an admin dashboard for user management, and a robust backend built with Node.js, Express, and MongoDB.

![Application Screenshot](https://via.placeholder.com/800x400.png?text=Your+App+Screenshot+Here)

[Watch a Demo Video](https://www.example.com/your-video-link-here)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Authentication Flow](#authentication-flow)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
  - [Running Locally Without Docker](#running-locally-without-docker)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

## Features

- **User Authentication:** Secure user registration and login with password hashing (`bcryptjs`) and JSON Web Tokens (JWT).
- **Task Management:** Create, view, update, and delete daily tasks.
- **Admin Dashboard:** A special view for administrators to manage users, including verifying new accounts.
- **Role-Based Access Control (RBAC):** Differentiated access levels for regular users and administrators.
- **API Caching:** Utilizes Redis for caching API responses to improve performance.
- **Containerized:** Fully containerized with Docker for consistent development and easy deployment.

## Tech Stack

The application is built with a modern and robust set of technologies:

### Backend

| Package                | Version   | Description                                                        |
| :--------------------- | :-------- | :----------------------------------------------------------------- |
| **Express**            | `^5.1.0`  | Fast, unopinionated, minimalist web framework for Node.js.         |
| **Mongoose**           | `^8.19.1` | Elegant MongoDB object modeling for Node.js.                       |
| **Redis**              | `^5.8.3`  | High-performance in-memory data structure store, used for caching. |
| **jsonwebtoken (JWT)** | `^9.0.2`  | Used for creating and verifying access tokens for authentication.  |
| **bcryptjs**           | `^3.0.2`  | Library for hashing passwords securely.                            |
| **cookie-parser**      | `^1.4.7`  | Middleware to parse `Cookie` header and populate `req.cookies`.    |
| **dotenv**             | `^17.2.3` | Loads environment variables from a `.env` file into `process.env`. |

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**

### Development & Testing

| Package    | Version   | Description                                                   |
| :--------- | :-------- | :------------------------------------------------------------ |
| **Docker** |           | Containerization platform to package and run the application. |
| **Jest**   | `^30.0.0` | A delightful JavaScript Testing Framework.                    |

## Authentication Flow

This application uses JSON Web Tokens (JWT) for stateless authentication.

1.  **User Login:** When a user logs in with a correct email and password, the server generates a signed JWT. This token contains a payload with the user's ID and role.
2.  **Token Storage:** The JWT is sent to the client and stored in an `httpOnly` cookie. This makes it secure against XSS attacks as it cannot be accessed by client-side JavaScript.
3.  **Authenticated Requests:** For every subsequent request to a protected route, the browser automatically sends the cookie containing the JWT.
4.  **Server-Side Verification:** An authentication middleware on the server intercepts these requests. It verifies the token's signature using the secret key (`JWT_SECRET`).
5.  **Access Control:** If the token is valid, the middleware decodes the payload to identify the user and their role. This information is attached to the `request` object (`req.user`) and used to authorize access to specific resources (e.g., only an admin can access the `/api/users/all` route).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or later)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A `.env` file in the root directory with the following variables:

## Running the Project with Docker

This project is containerized using Docker and Docker Compose. Follow these instructions to build and run the application and its dependencies.

### Project-Specific Requirements

- **Node.js version:** 22.13.1 (as specified in the Dockerfile)
- **Docker Compose uses a custom Dockerfile name:** `dokerfile` (not the default `Dockerfile`)
- **Redis** is required and provided as a service in the Compose file

### Environment Variables

- The application expects environment variables to be defined in a `.env` file at the project root. The Compose file references this file via `env_file: ./.env`.
- If you do not have a `.env` file, either create one or comment out the `env_file` line in `docker-compose.yml`.

### Build and Run Instructions

1. **Build and start the services:**

   ```sh
   docker compose up --build
   ```

   This will build the Node.js app using the `dokerfile` and start both the app and Redis services.

2. **Access the application:**
   - The Node.js app will be available on [http://localhost:3000](http://localhost:3000)

### Ports

- **js-app:** Exposes port `3000` (mapped to host `3000`)
- **redis:** Exposes the default Redis port internally (not mapped to host by default)

### Special Configuration

- The Docker Compose file uses a custom-named Dockerfile: `dokerfile`. Do not rename this file unless you also update the Compose file.
- Redis persistence is **not enabled by default**. To persist Redis data, uncomment the `volumes` section for `redis` in the Compose file.
- The application runs as a non-root user for improved security.

### Summary

- Ensure you have a `.env` file if your app requires environment variables.
- Use `docker compose up --build` to start the app and Redis together.
- The app is available on port 3000.
- Redis is required and automatically started as a dependency.
