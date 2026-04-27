# Cloudflare Workers React Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xoderx/mobile-detail-os)

A production-ready full-stack application template powered by Cloudflare Workers. Features a modern React frontend with shadcn/ui components, Tailwind CSS, TypeScript, and a robust Workers backend using Hono, Durable Objects for scalable entity storage (Users, Chats, Messages), and TanStack Query for optimistic data synchronization.

This template provides a real-world chat application demo out-of-the-box, with indexed entity listing, CRUD operations, and seamless integration between frontend and backend. Customize by editing `src/pages/HomePage.tsx` for the UI and `worker/user-routes.ts` / `worker/entities.ts` for backend logic.

## ✨ Key Features

- **Frontend**: React 18 + Vite + Router + TanStack Query + shadcn/ui + Tailwind CSS + Lucide Icons + Sonner Toasts + Dark Mode
- **Backend**: Cloudflare Workers + Hono + Durable Objects (multi-entity pattern with indexes) + SQLite-backed storage
- **Data Layer**: Strongly-typed entities (Users, ChatBoards) with optimistic mutations, pagination, and seeding
- **Developer Experience**: Hot reload, type-safe APIs, error boundaries, client error reporting
- **Production-Ready**: CORS, logging, health checks, SPA routing, Cloudflare Observability
- **Responsive Design**: Mobile-first, sidebar layout, animations, glassmorphism effects

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Framer Motion, Lucide, Sonner |
| **Backend** | Cloudflare Workers, Hono, Durable Objects, SQLite |
| **Utils** | Zod, Immer, clsx, Tailwind Merge, UUID |
| **Dev Tools** | Bun, ESLint, TypeScript, Wrangler |

## 🚀 Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed
   - [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI (`npm i -g wrangler`)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   bun install
   ```

3. **Run Locally**:
   ```bash
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000). The Workers dev server runs at [http://localhost:8787](http://localhost:8787).

4. **Type Generation** (for Workers env types):
   ```bash
   bun cf-typegen
   ```

## 🔨 Development

- **Frontend**: Edit `src/` files. Hot reloads automatically.
- **Backend Routes**: Add to `worker/user-routes.ts`. Auto-reloads in dev.
- **Entities**: Extend `worker/entities.ts` using the IndexedEntity pattern.
- **API Client**: Use `api()` from `src/lib/api-client.ts` (e.g., `api('/api/users')`).
- **Lint & Build**:
  ```bash
  bun lint    # ESLint
  bun build   # Production build
  ```
- **Seed Data**: Entities auto-seed on first list request (see `worker/entities.ts`).

**API Examples**:
```typescript
// List users with pagination
const { items: users, next } = await api<{ items: User[]; next: string | null }>('/api/users?limit=10&cursor=abc');

// Create chat
const chat = await api<Chat>('/api/chats', { method: 'POST', body: JSON.stringify({ title: 'New Chat' }) });

// Send message
const message = await api<ChatMessage>('/api/chats/${chatId}/messages', {
  method: 'POST',
  body: JSON.stringify({ userId: 'u1', text: 'Hello!' })
});
```

## ☁️ Deployment

1. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

2. **Deploy**:
   ```bash
   bun deploy
   ```
   Deploys frontend assets + Workers backend. Workers runs at `your-project.your-subdomain.workers.dev/api/*`.

3. **Custom Domain** (optional):
   Update `wrangler.jsonc` and run `wrangler deploy`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xoderx/mobile-detail-os)

**Pro Tip**: Use Cloudflare Pages for frontend-only hosting, or full Workers Sites for SPA + API.

## 🏗️ Architecture

```
Frontend (React/Vite) → API Client → Workers (/api/*)
                          ↓
                    Durable Objects (Entities + Indexes)
                          ↓
                       SQLite Storage
```

- **Entities**: One DO per entity (e.g., `UserEntity`, `ChatBoardEntity`). Indexes for listing.
- **Shared Types**: `shared/types.ts` for type-safety across frontend/backend.
- **Optimistic Updates**: TanStack Query handles mutations seamlessly.

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. Make changes
4. `bun lint && bun build`
5. PR with clear description

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙋‍💻 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- File issues here on GitHub

Built with ❤️ for Cloudflare Developers.