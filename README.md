# Project Name

This is a simple project template initialized with Vite, TypeScript, and React.

## Introduction

This project is a basic setup for building React applications using Vite. It includes TypeScript for type-checking and React for building user interfaces.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/)

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd project-directory
   ```
3. Install dependencies:
   ```bash
   yarn
   ```

### Development

To start the development server, run:

    yarn dev

This will start Vite development server on http://localhost:3000.

### Build

To build the project for production, run:

    yarn build

## Project Structure

The project structure is organized as follows:

```
|-- src/
    |-- apis/               # Declare API functions
    |-- assets/             # Asset files (images, fonts, icons, etc.)
    |-- components/         # Reusable React components
    |-- constants/          # Constants files
    |-- types/              # Define type
    |-- hooks/              # Custom React hooks
    |-- layouts/            # Layout components
    |-- pages/              # React page components
    |-- lib/                # Store library or module external
    |-- providers/          # Providers (theme, store, etc.)
    |-- store/              # State management (Redux, MobX, etc.)
    |-- styles/             # Global styles or CSS modules
    |-- utils/              # Utility/helper functions
    |-- App.tsx             # Defines the main interface structure
    |-- routes.tsx          # Define route
```
