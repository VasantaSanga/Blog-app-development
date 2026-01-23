# Scribely - Blog Writing & Publishing Platform

A modern, full-stack blog writing and publishing platform built with TypeScript, featuring a rich text editor, topic suggestions, and one-click publishing.

## ✨ Features

- 📝 Rich text editor with TipTap
- 💡 Blog topic suggestions and ideas
- 📱 Responsive design (mobile-friendly)
- 🌗 Light/Dark mode toggle
- 🔐 JWT-based authentication
- 💬 Comments with nested replies
- ❤️ Like functionality for blogs and comments
- 📊 Unique view tracking per user
- 🏷️ Categories and tags
- 🔍 Search functionality
- 📸 Image uploads
- 💾 Auto-save drafts

## 🏗️ Architecture

The project follows a **layered architecture** pattern:

```
Routes → Controllers → Services → Database (Prisma)
```

### Backend Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── config/            # Configuration (Prisma, env)
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth guards, validation, error handling
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic layer
│   ├── types/             # TypeScript type definitions
│   ├── validations/       # Joi validation schemas
│   └── server.ts          # Application entry point
└── uploads/               # Uploaded images
```

### Frontend Structure

```
frontend/
├── public/
│   └── index.html
└── src/
    ├── components/
    │   ├── Auth/          # Authentication components
    │   ├── Blog/          # Blog-related components
    │   ├── Common/        # Shared components
    │   ├── Editor/        # TipTap editor
    │   └── Layout/        # Layout components
    ├── context/           # React contexts (Auth, Theme)
    ├── pages/             # Page components
    ├── services/          # API service layer
    └── types/             # TypeScript type definitions
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: Joi
- **File Upload**: Multer

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material UI (MUI)
- **Rich Text Editor**: TipTap
- **HTTP Client**: Axios
- **Routing**: React Router
- **Notifications**: React Toastify

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/scribely?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:3000"
   ```

4. Run database migrations and seed:
   ```bash
   npm run setup
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NAME=Scribely
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 📜 Available Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema changes to database |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:seed` | Seed database with initial data |
| `npm run setup` | Run full setup (generate, push, seed) |

### Frontend

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Blogs
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `GET /api/blogs/id/:id` - Get blog by ID (auth)
- `GET /api/blogs/user/my-blogs` - Get user's blogs (auth)
- `GET /api/blogs/tags` - Get all tags
- `POST /api/blogs` - Create blog (auth)
- `PUT /api/blogs/:id` - Update blog (auth)
- `PUT /api/blogs/:id/autosave` - Auto-save blog (auth)
- `PUT /api/blogs/:id/publish` - Publish blog (auth)
- `PUT /api/blogs/:id/unpublish` - Unpublish blog (auth)
- `PUT /api/blogs/:id/like` - Toggle like (auth)
- `DELETE /api/blogs/:id` - Delete blog (auth)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/random` - Get random topics
- `GET /api/topics/:id` - Get topic by ID
- `POST /api/topics` - Create topic (admin)
- `PUT /api/topics/:id` - Update topic (admin)
- `DELETE /api/topics/:id` - Delete topic (admin)

### Comments
- `GET /api/comments/blog/:blogId` - Get comments for blog
- `POST /api/comments` - Create comment (auth)
- `PUT /api/comments/:id` - Update comment (auth)
- `PUT /api/comments/:id/like` - Toggle like (auth)
- `DELETE /api/comments/:id` - Delete comment (auth)

### Upload
- `POST /api/upload/image` - Upload image (auth)
- `DELETE /api/upload/image/:filename` - Delete image (auth)

## 📂 Validation

The API uses Joi for request validation. Validation schemas are organized by module:

- `src/validations/auth.validation.ts` - Authentication schemas
- `src/validations/blog.validation.ts` - Blog schemas
- `src/validations/category.validation.ts` - Category schemas
- `src/validations/topic.validation.ts` - Topic schemas
- `src/validations/comment.validation.ts` - Comment schemas

## 🔒 Authentication Guards

The API uses middleware guards for route protection:

- `authGuard` - Requires valid JWT token
- `optionalAuthGuard` - Attaches user if token exists, but doesn't require it
- `adminGuard` - Requires admin role

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.
