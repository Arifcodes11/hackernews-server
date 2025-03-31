# HackerNews Server

A social media-like backend service built using Node.js and Hono with authentication, posts, likes, and comments.

## 📖 Table of Contents

- [Features](#-features)
- [Pre-requisites](#-pre-requisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Posts](#posts)
  - [Likes](#likes)
  - [Comments](#comments)
- [Folder Structure](#folder-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

- JWT-based authentication
- CRUD operations for users, posts, likes, and comments
- Middleware-based access control
- Pagination support for users, posts, likes, and comments
- SHA256 password hashing for security
- Built with Node.js, Hono, Prisma, and Supabase

## 🔧 Pre-requisites

Before running this project, ensure you have the following installed:

- Node.js (latest LTS version recommended)
- TypeScript (for type safety and better development experience)
- Supabase (for authentication and database management)
- Prisma (for ORM and database schema management)

## 🛠️ Installation

Clone the repository:

```sh
git clone https://github.com/yourusername/hackernews-server.git
```

Navigate to the project directory:

```sh
cd hackernews-server
```

Install dependencies:

```sh
npm install
```

Set up environment variables in a `.env` file:

```env
PORT=3000
JWT_SECRET=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## 🎮 Usage

To start the server in development mode:

```sh
npm run dev
```

To start the server in production mode:

```sh
npm start
```

By default, the server runs on `http://localhost:3000/`.

## 📌 API Endpoints

### Authentication

- `POST /auth/sign-up` – Registers a user and returns a JWT.
- `POST /auth/log-in` – Logs in a user and returns a JWT.

### Users

- `GET /users/me` – Returns the current user's details.
- `GET /users` – Returns all users in alphabetical order (paginated).

### Posts

- `GET /posts` – Returns all posts in reverse chronological order (paginated).
- `GET /posts/me` – Returns current user's posts.
- `POST /posts` – Creates a post.
- `DELETE /posts/:postId` – Deletes the post (if owned by the user).

### Likes

- `GET /likes/on/:postId` – Fetches likes on a post.
- `POST /likes/on/:postId` – Creates a like.
- `DELETE /likes/on/:postId` – Deletes a user's like on a post.

### Comments

- `GET /comments/on/:postId` – Fetches comments on a post.
- `POST /comments/on/:postId` – Creates a comment on a post.
- `DELETE /comments/:commentId` – Deletes a user's comment.
- `PATCH /comments/:commentId` – Updates a user's comment.

## 📂 Folder Structure

```
📦 hackernews-server
├── 📂 src
│   ├── 📂 controllers
│   ├── 📂 middleware
│   ├── 📂 models
│   ├── 📂 routes
│   ├── 📂 services
│   ├── 📜 app.ts
│   ├── 📜 server.ts
├── 📜 .env
├── 📜 package.json
├── 📜 tsconfig.json
├── 📜 README.md
```

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

🌐 "Built for speed, security, and scalability—powering the next generation of discussions!"

