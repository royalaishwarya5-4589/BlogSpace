# BlogSpace – MERN Blogging Platform

BlogSpace is a full-stack blogging application where users can register, log in, create and manage blog posts, and interact through comments.

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Create, view, edit, and delete blog posts
- Add and view comments
- MongoDB database integration
- Responsive React user interface
- RESTful API architecture

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Mongoose
- Authentication: JWT, bcryptjs
- API Testing: Postman

## Project Structure

```text
blogging-platform/
+-- client/
¦   +-- src/
+-- server/
¦   +-- config/
¦   +-- middleware/
¦   +-- models/
¦   +-- routes/
¦   +-- server.js
+-- .gitignore
+-- README.md

## Installation and Setup

### Backend Setup

1. Open a terminal in the server folder.
2. Run `npm install`.
3. Create a `.env` file inside the server folder.
4. Add your own MongoDB connection string and JWT secret:

   - PORT=5000
   - MONGODB_URI=your_mongodb_connection_string
   - JWT_SECRET=your_secure_jwt_secret

5. Start the backend using `npm run dev`.

### Frontend Setup

1. Open another terminal in the client folder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL provided by Vite, usually http://localhost:5173.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Login |
| GET | /api/blogs | Get all blogs |
| GET | /api/blogs/:id | Get one blog |
| POST | /api/blogs | Create a blog |
| PUT | /api/blogs/:id | Update a blog |
| DELETE | /api/blogs/:id | Delete a blog |
| GET | /api/blogs/:id/comments | Get comments |
| POST | /api/blogs/:id/comments | Add a comment |

## Security

- Passwords are hashed using bcrypt.
- JWT authentication protects user-specific operations.
- Environment variables are excluded from Git.
- Never commit database credentials or secret keys.

## Project Status

Core frontend, backend, authentication, blog management, and comment functionality implemented.

---

Built as a MERN Stack Blogging Platform project.
