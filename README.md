# Project Management

A comprehensive project and task management application with a modern web interface built with Nuxt.js and backed by a powerful Node.js API.

## Features

- **User Authentication**: Secure login, registration, and token management
- **Team Collaboration**: Create teams and manage memberships with role-based permissions
- **Project Management**: Organize work with customizable projects
- **Task Tracking**: Comprehensive task management with statuses, priorities, and types
- **Notes**: Notion-like document workspace for knowledge sharing and documentation
- **Time Management**: Track time spent on tasks with start/stop functionality
- **Real-time Updates**: Instant notifications and updates via Socket.IO
- **Google Drive**: Upload and manage files on Google Drive with Google account
- **Comments & Checklists**: Collaborate with comments and track progress with checklists

The application supports multiple views for tasks including list, board, calendar, and timeline views. All data is updated in real-time across all connected clients, ensuring team members always see the most current information.

## Screenshots

![Project Dashboard](/screenshots/01.png)
*Project Dashboard with task overview and activity feed*

![Kanban Board](/screenshots/02.png)
*board view with draggable tasks and status columns*

![Document Workspace](/screenshots/03.png)
*Analyze your work data with charts and graphs and reports*


## Technology Stack

### Frontend
- **Nuxt 3**: Vue.js framework for server-side rendering
- **Pinia**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MySQL**: Database
- **Sequelize**: ORM for database modeling
- **Socket.IO**: Real-time bidirectional event-based communication
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Joi**: Request validation
- **Winston**: Logging
- **Multer**: File uploads handling

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MySQL (v8.0 or later)

### Installation

#### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/project-management.git
   cd project-management
   ```

2. Set up the backend:
   ```
   cd api
   npm install
   ```

3. Create a `.env` file in the API directory with your configuration:
   ```
   # Application
   NODE_ENV=development
   PORT=3001

   # Database
   DB_HOST=your_db_host
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name

   # Authentication
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d

   # CORS
   CORS_ORIGIN=http://localhost:3001
   FRONTEND_URL=http://localhost:3000

   # Logging
   LOG_LEVEL=debug

   # File Upload
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880  # 5MB in bytes
   ```

4. Create the database and run migrations:
   ```
   mysql -u root -p -e "CREATE DATABASE project_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   npm run migrate
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   npm install
   ```

2. Create a `.env` file with your configuration:
   ```
   NUXT_PUBLIC_API_BASE=http://localhost:3001/api
   NUXT_PUBLIC_WS_BASE=http://localhost:3001
   
   # For Google authentication (if using)
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Project Structure

### Frontend Structure

```
frontend/
├── assets/              # Static assets (CSS, images)
├── components/          # Reusable Vue components
├── composables/         # Reusable Vue composition functions
├── layouts/             # Application layouts
├── pages/               # Application pages/routes
├── plugins/             # Nuxt plugins
├── public/              # Public static files
├── stores/              # Pinia state stores
├── nuxt.config.ts       # Nuxt configuration
└── package.json         # Project dependencies
```

### Backend Structure

```
api/
├── config/              # Configuration files
├── controllers/         # Request handlers
├── middleware/          # Middleware functions
├── models/              # Database models
├── routes/              # API routes
├── services/            # Business logic
├── utils/               # Utility functions
├── socket/              # Socket.IO handlers
├── .env                 # Environment variables
└── server.js            # Application entry point
```

## Database Schema

The application uses a MySQL database with the following main tables:
- `users`: User accounts and profiles
- `teams`: Project teams
- `team_members`: User-team relationships
- `projects`: Project information
- `task_statuses`: Custom statuses for each project
- `tasks`: Task information
- `comments`: Task comments
- `time_entries`: Time tracking records
- `attachments`: File attachments
- `checklists`: Task checklists
- `notifications`: User notifications

## API Documentation

### Authentication

| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| POST   | /api/auth/register      | Register new user              |
| POST   | /api/auth/login         | Login user                     |
| GET    | /api/auth/me            | Get current user               |
| POST   | /api/auth/refresh-token | Refresh JWT token              |

### Users, Teams, Projects, and Tasks

The API provides comprehensive endpoints for managing users, teams, projects, and tasks. See the API README for complete documentation.

### Socket.IO Events

The application uses Socket.IO for real-time updates, including:
- Task creation and updates
- Comments
- Notifications
- Time tracking

## Development

### Running Tests

```
# Backend tests
cd api
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```
# Build the frontend
cd frontend
npm run build

# Start the backend in production mode
cd ../api
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License

## Credits

Developed by Piti Phanthasombath