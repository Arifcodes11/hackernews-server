# 📰 HackerNews Clone

A full-stack **HackerNews Clone** built as part of the DevIntern Challenge, mimicking core features of the popular news aggregation site, including **authentication**, **post creation**, **comments**, and **likes**. Built using **Node.js**, **Hono**, **Prisma**, **Supabase**, and **Neon.tech**.

---

## 🔧 Tech Stack

- **Backend Framework:** [Hono](https://hono.dev/) (Fast, lightweight web framework)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (via [Neon.tech](https://neon.tech/))
- **Authentication:** [Supabase Auth](https://supabase.com/)
- **API Testing:** Postman / Thunder Client
- **Deployment:** Local / Supabase / Neon

---

## 📦 Features

- 🔐 **User Authentication**
  - Signup and Login using Supabase Auth
  - Secure JWT-based session handling

- 📝 **Posts**
  - Create, Read, Update, Delete (CRUD) functionality
  - Posts sorted by newest first

- 💬 **Comments**
  - Add and view comments on posts
  - Nested structure supported

- ❤️ **Likes**
  - Like/unlike posts
  - View like counts

---

## 🗃️ Database Schema

- **User**
  - `id`, `email`, `created_at`

- **Post**
  - `id`, `title`, `content`, `user_id`, `created_at`

- **Comment**
  - `id`, `content`, `user_id`, `post_id`, `created_at`

- **Like**
  - `id`, `user_id`, `post_id`, `created_at`

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint       | Description       |
|--------|----------------|-------------------|
| POST   | `/signup`      | User registration |
| POST   | `/login`       | User login        |

### Posts

| Method | Endpoint        | Description              |
|--------|------------------|--------------------------|
| GET    | `/posts`         | Get all posts            |
| POST   | `/posts`         | Create a new post        |
| GET    | `/posts/:id`     | Get post by ID           |
| PATCH  | `/posts/:id`     | Update post by ID        |
| DELETE | `/posts/:id`     | Delete post by ID        |

### Comments

| Method | Endpoint               | Description               |
|--------|------------------------|---------------------------|
| POST   | `/posts/:id/comments`  | Add comment to a post     |
| GET    | `/posts/:id/comments`  | Get all comments for post |

### Likes

| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| POST   | `/posts/:id/like`  | Like or Unlike a post |
| GET    | `/posts/:id/likes` | Get like count        |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Project (for Auth)
- Neon.tech or PostgreSQL DB
- Prisma CLI

### Installation

```bash
git clone https://github.com/your-username/hackernews-clone.git
cd hackernews-clone
npm install
