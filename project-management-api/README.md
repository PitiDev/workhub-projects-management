# Project Management API

A powerful RESTful API for project and task management built with Node.js, Express, MySQL, and Socket.IO.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **User Management**: Create and manage users with different roles
- **Team Management**: Create teams and manage team memberships
- **Project Management**: Create, update, and delete projects with various configurations
- **Task Management**: Comprehensive task tracking with statuses, priorities, due dates, etc.
- **Time Tracking**: Track time spent on tasks with start/stop functionality
- **Comments**: Add comments to tasks for team collaboration
- **Checklists**: Create checklists with items for task completion tracking
- **File Attachments**: Upload and manage file attachments for tasks
- **Real-time Updates**: Socket.IO integration for real-time notifications and updates

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MySQL**: Database
- **Sequelize**: ORM for database modeling and queries
- **Socket.IO**: Real-time bidirectional event-based communication
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Joi**: Request validation
- **Winston**: Logging
- **Multer**: File uploads handling

## Prerequisites

- Node.js (v18 or later)
- MySQL (v8.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/project-management-api.git
   cd project-management-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your configuration:
   ```
   # Application
   NODE_ENV=development
   PORT=3000

   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=project_management
   DB_USER=root
   DB_PASSWORD=your_password

   # Authentication
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d

   # CORS
   CORS_ORIGIN=http://localhost:8080

   # Logging
   LOG_LEVEL=debug

   # File Upload
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880  # 5MB in bytes
   ```

4. Create the database:
   ```
   mysql -u root -p -e "CREATE DATABASE project_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

5. Run the application:
   ```
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

### Authentication

| Method | Endpoint                | Description                    | Request Body                                | Auth Required |
|--------|-------------------------|--------------------------------|---------------------------------------------|---------------|
| POST   | /api/auth/register      | Register new user              | email, password, first_name, last_name      | No            |
| POST   | /api/auth/login         | Login user                     | email, password                             | No            |
| GET    | /api/auth/me            | Get current user               | -                                           | Yes           |
| POST   | /api/auth/refresh-token | Refresh JWT token              | token                                       | No            |
| POST   | /api/auth/change-password | Change password              | current_password, new_password              | Yes           |
| POST   | /api/auth/forgot-password | Request password reset       | email                                       | No            |
| POST   | /api/auth/reset-password | Reset password                | token, new_password                         | No            |

### Users

| Method | Endpoint                | Description                    | Request Body                                | Auth Required |
|--------|-------------------------|--------------------------------|---------------------------------------------|---------------|
| GET    | /api/users              | Get all users                  | -                                           | Yes           |
| GET    | /api/users/:id          | Get user by ID                 | -                                           | Yes           |
| POST   | /api/users              | Create new user (admin)        | email, password, first_name, last_name, role| Yes (admin)   |
| PUT    | /api/users/:id          | Update user                    | first_name, last_name, email, role          | Yes           |
| DELETE | /api/users/:id          | Delete user                    | -                                           | Yes (admin)   |
| GET    | /api/users/profile      | Get current user profile       | -                                           | Yes           |
| PUT    | /api/users/profile      | Update current user profile    | first_name, last_name, email, profile_image | Yes           |

### Teams

| Method | Endpoint                     | Description                    | Request Body                      | Auth Required |
|--------|------------------------------|--------------------------------|-----------------------------------|---------------|
| GET    | /api/teams                   | Get all teams                  | -                                 | Yes           |
| GET    | /api/teams/:id               | Get team by ID                 | -                                 | Yes           |
| POST   | /api/teams                   | Create new team                | name, description                 | Yes           |
| PUT    | /api/teams/:id               | Update team                    | name, description                 | Yes           |
| DELETE | /api/teams/:id               | Delete team                    | -                                 | Yes           |
| GET    | /api/teams/:id/members       | Get team members               | -                                 | Yes           |
| POST   | /api/teams/:id/members       | Add team member                | user_id, role                     | Yes           |
| PUT    | /api/teams/:id/members/:userId | Update team member role      | role                              | Yes           |
| DELETE | /api/teams/:id/members/:userId | Remove team member           | -                                 | Yes           |

### Projects

| Method | Endpoint                          | Description                    | Request Body                      | Auth Required |
|--------|-----------------------------------|--------------------------------|-----------------------------------|---------------|
| GET    | /api/projects                     | Get all projects               | -                                 | Yes           |
| GET    | /api/projects/:id                 | Get project by ID              | -                                 | Yes           |
| POST   | /api/projects                     | Create new project             | name, description, color, team_id | Yes           |
| PUT    | /api/projects/:id                 | Update project                 | name, description, color, status  | Yes           |
| DELETE | /api/projects/:id                 | Delete project                 | -                                 | Yes           |
| GET    | /api/projects/:id/statuses        | Get project statuses           | -                                 | Yes           |
| POST   | /api/projects/:id/statuses        | Create project status          | name, color, order_position       | Yes           |
| PUT    | /api/projects/:projectId/statuses/:statusId | Update project status| name, color, order_position       | Yes           |
| DELETE | /api/projects/:projectId/statuses/:statusId | Delete project status| -                                 | Yes           |
| PUT    | /api/projects/:id/statuses/reorder | Reorder project statuses     | statusOrder                       | Yes           |

### Tasks

| Method | Endpoint                          | Description                    | Request Body                      | Auth Required |
|--------|-----------------------------------|--------------------------------|-----------------------------------|---------------|
| GET    | /api/tasks                        | Get all tasks                  | -                                 | Yes           |
| GET    | /api/tasks/:id                    | Get task by ID                 | -                                 | Yes           |
| POST   | /api/tasks                        | Create new task                | title, description, project_id, status_id, etc. | Yes |
| PUT    | /api/tasks/:id                    | Update task                    | title, description, status_id, etc. | Yes        |
| DELETE | /api/tasks/:id                    | Delete task                    | -                                 | Yes           |
| GET    | /api/tasks/:id/comments           | Get task comments              | -                                 | Yes           |
| POST   | /api/tasks/:id/comments           | Add task comment               | content                           | Yes           |
| POST   | /api/tasks/:id/time-entries       | Start time tracking            | start_time, description           | Yes           |
| PUT    | /api/tasks/:id/time-entries/:entryId | Stop time tracking          | end_time, description             | Yes           |
| POST   | /api/tasks/:id/checklists         | Create task checklist          | title, items                      | Yes           |

### Socket.IO Events

The API utilizes Socket.IO for real-time communication. Here are the main events:

#### Authentication
- Connect with `auth.token` in socket handshake

#### Project Events
- `join-project`: Join a project room to receive updates about tasks in that project
- `leave-project`: Leave a project room
- `task-created`: Receive notification when a task is created
- `task-updated`: Receive notification when a task is updated
- `task-deleted`: Receive notification when a task is deleted

#### Task Events
- `create-task`: Create a new task
- `update-task`: Update a task
- `delete-task`: Delete a task
- `add-comment`: Add a comment to a task

#### Notification Events
- `subscribe-notifications`: Subscribe to notifications
- `new-notification`: Receive a new notification
- `notification-count`: Get number of unread notifications
- `mark-notification-read`: Mark a notification as read
- `mark-all-notifications-read`: Mark all notifications as read

## Error Handling

The API uses a standardized error response format:

```json
{
  "error": "Error message",
  "details": [] // Optional array of validation errors
}
```

HTTP status codes are used appropriately to indicate the nature of errors:
- 400: Bad Request (validation error)
- 401: Unauthorized (authentication error)
- 403: Forbidden (authorization error)
- 404: Not Found (resource not found)
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Project Management API

This project is a RESTful API for project and task management built with Node.js, Express, MySQL, and Socket.IO.

## Development
Piti Phanthasombath



## License

This project is licensed under the MIT License