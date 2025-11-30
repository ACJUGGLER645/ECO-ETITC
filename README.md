# Eco Awareness PWA Platform

This project is a Progressive Web App (PWA) for environmental awareness, built with a containerized architecture using Docker, Python (Flask), React (Vite), and PostgreSQL.

## Architecture

The project consists of 3 Docker containers running on Alpine Linux for maximum efficiency:

1.  **App Server (`backend`)**: Python Flask application handling business logic, authentication, and comments.
2.  **Web Server/Proxy (`frontend`)**: Nginx server serving the React PWA static files and proxying API requests to the backend.
3.  **Database (`db`)**: PostgreSQL database for storing users and comments.

## Features

-   **PWA**: Fully offline-capable with Service Worker caching.
-   **Design**: Glassmorphism UI with Tailwind CSS, Dark/Light mode toggle, and Emerald Green theme.
-   **Functionality**:
    -   User Registration and Login.
    -   Blog Post (cached for offline reading).
    -   Comments section (requires login).
-   **Accessibility**: ARIA labels and high contrast support.

## Prerequisites

-   Docker and Docker Compose installed.

## How to Run

1.  Build and start the containers:
    ```bash
    docker-compose up --build
    ```

2.  Access the application at:
    `http://localhost`

## Development

-   **Frontend**: Located in `frontend/`. Built with Vite + React + Tailwind.
-   **Backend**: Located in `backend/`. Built with Flask + SQLAlchemy.

## Notes

-   The application uses a self-contained PostgreSQL instance. Data is persisted in a Docker volume.
-   The PWA is installable on mobile and desktop devices.
