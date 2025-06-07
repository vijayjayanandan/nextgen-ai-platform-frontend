# NextGen AI Platform - Frontend

This is the frontend for the NextGen AI Platform, built with Next.js, React, and Tailwind CSS. It provides user authentication, a chat interface, document management, and user settings.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)
- [Core Features](#core-features)
- [Configuration](#configuration)
- [Technical Documentation for AI](#technical-documentation-for-ai)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js) or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd nextgen-ai-platform-frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To run the application in development mode:

```bash
npm run dev
```

This will start the development server, typically at `http://localhost:3000`.

## Available Scripts

-   `npm run dev`: Runs the app in development mode with hot reloading.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts a Next.js production server (requires a prior `npm run build`).
-   `npm run lint`: Lints the codebase using ESLint to identify and fix code style issues.
-   `npm run type-check`: Performs TypeScript type checking across the project without emitting JavaScript files.

## Project Structure

A detailed project structure can be found in `frontend-project-structure.txt`. Here's a summary:

-   `app/`: Core application routing and pages, leveraging Next.js App Router.
    -   `[locale]/`: Handles internationalization for routes (e.g., `en`, `fr`). Contains layouts and feature-specific pages.
        -   `layout.tsx`: Root layout, often including global providers.
        -   `page.tsx`: Home page for a given locale.
        -   `auth/`, `chat/`, `documents/`, `settings/`: Directories for feature-specific pages and sub-routes.
    -   `api/`: API route handlers for backend functionalities directly served by Next.js.
    -   `favicon.ico`: Application favicon.
-   `components/`: Reusable React components, organized by feature or type.
    -   `auth/`, `chat/`, `documents/`: Feature-specific components.
    -   `layout/`: Components related to overall page structure (e.g., header, footer, sidebar).
    -   `ui/`: Generic, reusable UI elements (e.g., buttons, inputs, modals).
-   `lib/`: Utility functions, API integration logic, authentication helpers, and internationalization setup.
    -   `api/`: Client-side functions for interacting with backend APIs.
    -   `auth/`: Authentication related utilities and configurations.
    -   `i18n/`: Internationalization setup and utilities.
    -   `utils/`: General utility functions.
-   `hooks/`: Custom React hooks for reusable stateful logic.
-   `context/`: React Context providers for global state management.
-   `types/`: TypeScript type definitions and interfaces.
-   `public/`: Static assets that are served directly (e.g., images, fonts).
-   `locales/`: Translation files (e.g., JSON) for different languages.
-   `middleware.ts`: Next.js middleware for handling requests, often used for authentication, redirects, or locale detection.
-   Configuration Files:
    -   `next.config.js`: Next.js specific configurations.
    -   `tailwind.config.js`: Tailwind CSS configuration and customizations.
    -   `tsconfig.json`: TypeScript compiler options.
    -   `package.json`: Project metadata, dependencies, and scripts.

## Key Technologies

-   **Framework**: Next.js (~15.3.2)
-   **UI Library**: React (~19.1.0)
-   **Styling**: Tailwind CSS (~3.4.17)
-   **Language**: TypeScript (~5.3.3)
-   **HTTP Client**: Axios (~1.9.0)
-   **Form Management**: React Hook Form (~7.49.2)
-   **Schema Validation**: Zod (~3.22.4)
-   **Markdown Rendering**: `react-markdown` (~9.1.0), `remark-gfm` (~4.0.1)
-   **Internationalization (i18n)**: `@formatjs/intl-localematcher` (~0.5.0), `negotiator` (~0.6.3)
-   **Linting**: ESLint (~8.55.0)
-   **Package Manager**: npm

## Core Features

Based on the project structure, the platform includes:

-   User Authentication (Login, potentially registration and session management)
-   Chat Interface
-   Document Management
-   User Settings
-   Internationalization (supporting multiple locales like English and French)

## Configuration

Environment-specific configurations should be managed using a `.env.local` file in the root of the project. This file is gitignored and should contain sensitive keys or environment-specific settings. An example `.env.example` or documentation on required variables should be provided if applicable.

## Technical Documentation for AI

This README, along with the `frontend-project-structure.txt` file, serves as the primary technical documentation for understanding this codebase.

To gain a comprehensive understanding:

1.  **Start with this README**: It provides a high-level overview, setup instructions, and key technology stack.
2.  **Review `frontend-project-structure.txt`**: This file details the organization of directories and files, explaining the purpose of each major part of the application.
3.  **Examine Key Directories for Logic Flow**:
    *   `app/[locale]/`: Understand routing, page composition, and how layouts are applied. Server Components and Client Components interplay will be evident here.
    *   `components/`: Analyze reusable UI components. Pay attention to props and how components are composed.
    *   `lib/`: Crucial for understanding business logic, API interactions (`lib/api/`), authentication (`lib/auth/`), and internationalization (`lib/i18n/`).
    *   `hooks/` and `context/`: For custom state management and shared logic across components.
    *   `middleware.ts`: Important for understanding request processing logic before pages are rendered (e.g., auth checks, locale redirects).
4.  **Understand Data Flow**: Trace how data is fetched (likely in `app/` using Server Components or in `lib/api/` for client-side calls via Axios), managed (React state, context, or hooks), and rendered in components.
5.  **Configuration Files**: `next.config.js`, `tailwind.config.js`, and `tsconfig.json` provide insights into the build process, styling setup, and TypeScript configurations.
6.  **Dependencies**: `package.json` lists all external libraries. Understanding the roles of major dependencies (listed in [Key Technologies](#key-technologies)) is essential.

By following these points, an AI can build a detailed mental model of the NextGen AI Platform Frontend.
