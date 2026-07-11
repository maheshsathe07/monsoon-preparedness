# Monsoon Preparedness App

Vite + React frontend for the Monsoon Preparedness backend.

## Local Setup

Create `.env` from the example:

```powershell
copy .env.example .env
```

Use the deployed Railway backend by default:

```env
VITE_API_BASE_URL=https://monsoon-preparedness-backend-production.up.railway.app
```

For local backend testing, change it to `http://127.0.0.1:8000`.

Run the app:

```powershell
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Backend Integration

The app calls:

- `POST /api/v1/profile`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/chat`
- `GET /api/v1/weather/{lat}/{lng}`
- `GET /api/v1/checklist/{user_id}`
- `PATCH /api/v1/checklist/{user_id}/{item_id}`
- `GET /api/v1/alerts`
- `POST /api/v1/alerts`
- `POST /api/v1/emergency-id`

For deployment, set `VITE_API_BASE_URL` to the Railway backend URL.
