# Sanjeevani Garden

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Backend setup
1. Create `backend/.env` (see variables below).
2. Install and run:
```bash
cd backend
npm install
npm run start
```
3. Env variables (`backend/.env`):
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/sanjeevani_garden
JWT_SECRET=replace_me
ALLOWED_ORIGIN=http://localhost:3000
# Optional AI
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com
OPENAI_MODEL=gpt-4o-mini
```

## Frontend setup
1. From project root:
```bash
npm install
npm run dev
```
2. If backend is remote, set `BACKEND_URL` in your frontend host env.

## Development
- Frontend dev server: http://localhost:3000
- Backend API: http://localhost:4000
- Rewrites proxy `/api/*` to backend (`next.config.mjs`).

## Deploy
- Backend: deploy to your Node host; set envs above. Use MongoDB Atlas for `MONGO_URI`.
- Frontend: deploy to Vercel; set `BACKEND_URL` to your API base.

## Security
- Restrict CORS via `ALLOWED_ORIGIN`.
- Set strong `JWT_SECRET`.
- AI endpoint is rate-limited (`/api/health/ai-chat`).

## SEO
- Update title/description in `app/layout.tsx` metadata.
- Add `robots.txt` and `sitemap.xml` if indexing is desired.

## Endpoints
- `GET /api/health/symptoms?symptoms=cough,fever`
- `GET /api/health/plants?q=tulsi`
- `GET /api/health/chatbot?q=cough`
- `POST /api/health/ai-chat` with `{ messages: [{ role: 'user'|'assistant', content: '...' }] }`
- `POST /api/health/consult-requests` with `{ name, email, problem }`

## Notes
- Chatbot supports multi-turn and falls back to heuristic search if AI is unavailable.
