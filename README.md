# DNALCA

DNALCA is a modern web application designed for managing DNA sample submissions, user authentication, and administrative tasks. Built with Next.js 15, React 19, and TypeScript, it provides a seamless experience for users to submit samples, track progress, and manage their data.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

### Sample Submission:

- Step-by-step submission process
- Address confirmation and order review
- Test form and booking details

### User Authentication:

- Secure login and registration
- Password reset and email verification
- Role-based access control

### Dashboard:

- Sample management with detailed views
- Reports and updates
- Settings and profile management

### UI/UX:

- Responsive design with mobile optimization
- Interactive forms and modals
- Rich text editing and file uploads

## Tech Stack

### Core Framework

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript

### UI Components

- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: Component system built on Radix UI

### Form Management

- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **React Dropzone**: File upload handling

### State Management

- **Zustand**: Client state management
- **Iron Session**: Session handling

### Authentication

- **Iron Session**: Secure, encrypted session management

## Installation

To set up the DNALCA project locally, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yourusername/dnalca.git
   cd dnalca
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Environment Setup**:
   Follow the [Environment Setup](#environment-setup) instructions below.

4. **Start Development Server**:

   ```sh
   npm run dev
   ```

5. Access the application at http://localhost:3002.

## Environment Setup

1. **Copy the example environment file**:

   ```sh
   cp env.local.example .env.local
   ```

2. **Edit the `.env.local` file** and update the values with your actual configuration:

   ```env
   NEXT_PUBLIC_BASE_URL=https://dna.center.koinoniamessages.com/api
   SECRET_KEY=your_secret_key_here
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3002
   ```

3. **Important**: Make sure `.env.local` is added to your `.gitignore` file to prevent sensitive information from being committed to your repository.

## Development

- **Start Development Server**:

  ```sh
  npm run dev
  ```

- **Build for Production**:

  ```sh
  npm run build
  ```

- **Start Production Server**:

  ```sh
  npm run start
  ```

- **Lint Code**:
  ```sh
  npm run lint
  ```

## Project Structure

The project follows Next.js 15 App Router conventions with a well-organized structure:

```
dnalca/
├── app/                   # Next.js app directory
│   ├── (auth)/            # Auth-related routes
│   ├── (dashboard)/       # Dashboard routes
│   │   ├── sample-management/  # Sample management
│   │   ├── sample-submission/  # Sample submission process
│   │   └── settings/      # User settings
│   ├── actions/           # Server actions
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── dialogs/           # Modal dialogs
│   ├── forms/             # Form components
│   ├── pages/             # Page-specific components
│   ├── shared/            # Shared components
│   ├── tables/            # Data tables
│   └── ui/                # Base UI components
├── constants/             # App constants
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
│   └── assets/            # Static images and files
├── store/                 # Zustand store
├── styles/                # Global styles
├── types/                 # TypeScript definitions
├── .gitignore             # Git ignore file
├── env.local.example      # Example environment variables
└── README.md              # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Follow TypeScript best practices
- Use ESLint configurations
- Maintain proper documentation

For additional support or questions, please contact the development team.
