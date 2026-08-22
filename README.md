# TaskFlow

TaskFlow is a full-stack project management SaaS built for teams to organize projects, manage tasks, collaborate with teammates, and track activity from one focused workspace.

It includes project and task management, Kanban workflows, detailed task management, team collaboration, file attachments, comments, checklists, activity tracking, realtime notifications, and Google OAuth authentication.

## Key Features

- Project creation and management
- Task creation, editing, assignment, priorities, statuses, and due dates
- Kanban workflow with drag-and-drop task movement
- Detailed task workspace with:
  - Labels
  - Checklists
  - Comments
  - Attachments
  - Activity history
- Task search, filtering, and sorting
- Team creation and member management
- Team invitations and role-based access
- Realtime notifications
- Project progress tracking and dashboard analytics
- Email/password authentication
- Google OAuth authentication
- Cloudinary-powered task attachments
- Responsive desktop and mobile UI

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- dnd-kit

### Backend

- Next.js App Router
- GraphQL
- GraphQL Yoga
- Apollo Client
- Prisma ORM 7.9.0
- MySQL
- JWT authentication
- bcryptjs

### Services

- Aiven MySQL
- Cloudinary
- Google OAuth
- Vercel

### Realtime

- Socket.IO
- Socket.IO Client

## Architecture

TaskFlow uses a full-stack Next.js architecture with GraphQL as the application API layer.

                    ┌──────────────────────┐
                    │      Next.js App     │
                    │   React + Tailwind   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Apollo Client     │
                    │      GraphQL API     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   GraphQL Yoga       │
                    │      Resolvers       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Prisma 7.9.0    │
                    │    MariaDB Adapter   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     MySQL / Aiven    │
                    └──────────────────────┘

        ┌─────────────────┐       ┌─────────────────┐
        │    Cloudinary   │       │ Google OAuth    │
        │ File Attachments│       │ Authentication  │
        └─────────────────┘       └─────────────────┘

                    ┌─────────────────┐
                    │    Socket.IO    │
                    │ Realtime Events │
                    └─────────────────┘

## Authentication

TaskFlow supports two authentication methods.

### Email and Password

Users can:

- Create an account with name, email, and password
- Sign in using email and password
- Receive a JWT after successful authentication

Passwords are hashed using `bcryptjs`, and JWTs are used to authenticate API requests.

### Google OAuth

TaskFlow also supports Google Sign-In and Sign-Up using:

- `@react-oauth/google`
- Google Identity Services
- Google OAuth credentials configured through environment variables

Google-authenticated users are integrated into the same TaskFlow user system, with OAuth account information stored separately.

## Database and Prisma Setup

TaskFlow uses **MySQL** with **Prisma ORM 7.9.0**.

The Prisma schema contains the main application entities:

- Users
- Projects
- Tasks
- Teams
- Team members
- Team invitations
- Comments
- Labels
- Attachments
- Checklist items
- Notifications
- Activities
- OAuth accounts

Prisma is configured through `prisma.config.ts`, with migrations stored in:

prisma/migrations
For local development, TaskFlow uses a local MySQL database.

Production uses a managed MySQL database hosted on Aiven.

Production database migrations are applied with:

npx prisma migrate deploy
Cloudinary Uploads

TaskFlow uses Cloudinary to store task attachments.

The upload flow is:

Task Details
↓
Upload API
↓
Cloudinary
↓
File URL + Metadata
↓
MySQL

Attachment metadata includes:

File name
File URL
File size
MIME type
Uploading user
Associated task

Cloudinary credentials are stored as environment variables and are not committed to the repository.

Realtime Notifications

TaskFlow uses Socket.IO for realtime notifications and application events.

Users can receive updates without manually refreshing the application.

Realtime functionality is used for:

Task activity
Team activity
Notifications
Collaboration events
Local Development Setup

1. Clone the repository
   git clone https://github.com/utsavanand131/taskflow.git
   cd taskflow
2. Install dependencies
   npm install

Prisma Client is generated automatically during installation.

You can also generate it manually:

npx prisma generate 3. Configure environment variables

Create a .env file in the project root and add the required environment variables.

4. Run Prisma migrations

For a local development database:

npx prisma migrate dev 5. Start the development server
npm run dev

Open:

http://localhost:3000 6. Create a production build locally
npm run build 7. Run the production build
npm start
Environment Variables

TaskFlow uses environment variables for database access, authentication, Google OAuth, and Cloudinary.

Database
DATABASE_URL=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
Authentication
JWT_SECRET=
Google OAuth
GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Never commit .env files or expose secret values in the repository.

For production, environment variables are configured through Vercel.

Deployment

TaskFlow is deployed using Vercel.

The production architecture is:

GitHub
↓
Vercel
↓
Next.js / GraphQL
├── Prisma 7.9.0
│ ↓
│ Aiven MySQL
│
├── Cloudinary
│
├── Google OAuth
│
└── Socket.IO

The production database is hosted on Aiven MySQL, while task attachments are stored using Cloudinary.
