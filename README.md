# 🐦 Bird

> A modern social media platform inspired by Twitter/X — built with Next.js and NestJS.

**Live:** [nest-x-api.pro](https://nest-x-api.pro)

---

## Features

- 📝 **Posts** — Create, like, and comment on posts (up to 280 characters)
- 👥 **Follow system** — Follow and unfollow users
- 💬 **Real-time chat** — Direct messaging with WebSocket support
- 🔔 **Notifications** — Real-time notifications for likes, comments, follows, and messages
- 🟢 **Online status** — See who's online and when someone is typing
- 🔍 **Search** — Find users by name or username
- 🖼️ **Media uploads** — Upload avatars and post images via Cloudinary
- 🔐 **Auth** — JWT-based authentication with refresh tokens

---

## Tech Stack

### Frontend

| Tech                    | Purpose      |
| ----------------------- | ------------ |
| Next.js 15 (App Router) | Framework    |
| TypeScript              | Language     |
| Tailwind CSS            | Styling      |
| TanStack Query          | Server state |
| Socket.io Client        | Real-time    |
| Axios                   | HTTP client  |

### Backend

| Tech              | Purpose       |
| ----------------- | ------------- |
| NestJS            | Framework     |
| Prisma            | ORM           |
| PostgreSQL (Neon) | Database      |
| Socket.io         | WebSocket     |
| JWT               | Auth          |
| Cloudinary        | Media storage |
| Swagger           | API docs      |

### Infrastructure

| Tech                    | Purpose             |
| ----------------------- | ------------------- |
| Docker + Docker Compose | Containerization    |
| Nginx                   | Reverse proxy + SSL |
| AWS EC2                 | Hosting             |
| GitHub Actions          | CI/CD               |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Bun
- Docker

### Frontend

```bash
git clone https://github.com/runtimefox/Bird
cd Bird
bun install
bun dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## Project Structure

```
src/
├── app/
│   ├── (root)/
│   │   ├── dashboard/
│   │   │   ├── home/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   └── posts/
│   └── auth/
├── components/
│   └── dashboard/
│       ├── chat/
│       ├── posts/
│       └── sidebar/
├── hooks/
├── services/
└── types/
```

---

## License

MIT
