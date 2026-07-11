Monsoon Preparedness System

An AI-powered disaster preparedness platform that helps households prepare for monsoon-related emergencies through personalized risk assessment, weather monitoring, AI assistance, preparedness checklists, community alerts, and emergency identification.

Built for **PromptWars Hackathon** using **FastAPI**, **React (Vite)**, **Supabase**, **OpenAI**, and **Open-Meteo**.

---

# Live Demo

## Frontend (Vercel)

https://monsoon-preparedness-app-s6kv.vercel.app/

## Backend (Railway)

https://monsoon-preparedness-backend-production.up.railway.app

## API Documentation (Swagger)

https://monsoon-preparedness-backend-production.up.railway.app/docs

## Backend Repo (Linked With Railway)

https://github.com/maheshsathe07/monsoon-preparedness-backend

## Frontend Repo (Linked With Vercel)

https://github.com/maheshsathe07/monsoon-preparedness-app

---

# Overview

Every year, monsoon floods impact millions of families by causing property damage, transportation disruptions, and emergency situations.

The Monsoon Preparedness System helps users prepare before disasters occur by providing:

- AI-powered preparedness recommendations
- Personalized household risk assessment
- Live weather forecasts
- Community-generated emergency alerts
- Preparedness checklists
- Emergency ID generation with QR support

The application consists of a React frontend and a FastAPI backend connected through REST APIs.

---

# Features

## Household Risk Assessment

- Location-based onboarding
- Family size capture
- Monsoon risk selection
- AI-generated preparedness recommendations

---

## AI Assistant

Ask questions such as:

- Is my area at risk?
- What should I pack?
- How do I prepare for heavy rainfall?
- What should I do during flooding?

Powered by OpenAI with structured responses.

---

## Weather Forecast

- 7-day rainfall forecast
- Monsoon severity
- Weather alerts
- Open-Meteo integration

---

## Preparedness Checklist

Generate personalized checklists based on:

- Household profile
- Risk level
- Family size

Users can mark tasks as completed.

---

## Community Alerts

Users can report:

- Flooding
- Road blockage
- Shelter availability
- Fallen trees
- Power outages
- Other emergencies

Nearby users can view alerts within a configurable radius.

---

## Emergency ID

Generate emergency information including:

- Household details
- Emergency contacts
- Medical information
- QR Code
- PDF export

---

# System Architecture

```
                React (Vite)
                      │
          REST API (Axios)
                      │
        FastAPI Backend (Railway)
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    OpenAI       Open-Meteo     Supabase
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios

## Backend

- FastAPI
- Python
- Pydantic
- Uvicorn

## Database

- Supabase (PostgreSQL)

## AI

- OpenAI

## Weather

- Open-Meteo API

## Deployment

### Frontend

- Vercel

### Backend

- Railway

---

# Repository Structure

```
monsoon-preparedness-system
│
├── backend
│   ├── app
│   ├── api
│   ├── migrations
│   ├── scripts
│   ├── storage
│   ├── tests
│   ├── requirements.txt
│   └── main.py
│
├── monsoon-preparedness-app
│   ├── src
│   ├── components
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Backend Setup

## Clone repository

```bash
git clone <repository-url>
cd backend
```

## Create virtual environment

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env`

```env
OPENAI_API_KEY=your_openai_key

SUPABASE_URL=https://your-project.supabase.co

SUPABASE_KEY=your_supabase_key

SUPABASE_JWT_SECRET=your_jwt_secret
```

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# 💻 Frontend Setup

```
cd monsoon-preparedness-app
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

Production build

```bash
npm run build
```

---

# 📡 REST APIs

## Profile

```
POST /api/v1/profile
```

Creates household profile and AI-generated preparedness recommendations.

---

## AI Chat

```
POST /api/v1/chat
```

Returns:

- AI response
- Alerts
- Recommended actions
- Confidence score

---

## Weather

```
GET /api/v1/weather/{lat}/{lng}
```

Returns:

- Rainfall forecast
- Temperature
- Monsoon alert level

---

## Checklist

```
GET /api/v1/checklist/{user_id}
```

Returns personalized preparedness checklist.

---

## Update Checklist

```
PATCH /api/v1/checklist/{user_id}/{item_id}
```

Marks checklist items completed.

---

## Community Alerts

```
GET /api/v1/alerts
```

Retrieve nearby alerts.

```
POST /api/v1/alerts
```

Create community alerts.

---

## Emergency ID

```
POST /api/v1/emergency-id
```

Generates:

- Emergency ID
- QR Code
- PDF

---

# 📦 Deployment

## Frontend

Platform:

- Vercel

URL

https://monsoon-preparedness-app-s6kv.vercel.app/

---

## Backend

Platform:

- Railway

URL

https://monsoon-preparedness-backend-production.up.railway.app

Swagger

https://monsoon-preparedness-backend-production.up.railway.app/docs

---

# 🔒 Reliability Improvements

- OpenAI response normalization
- AI fallback logic
- Structured response validation
- Stable chat parsing
- Tailwind build fixes
- CORS configuration
- Production-ready API client
- URL normalization
- Railway deployment
- Vercel deployment

---

# 🚀 Future Enhancements

- User Authentication
- Push Notifications
- Offline Mode (PWA)
- Live Flood Maps
- Government API Integration
- SMS Alerts
- Multi-language Support
- Voice Assistant
- Disaster Analytics Dashboard
- Volunteer Management

---

# 👨‍💻 Team

Built during **PromptWars Hackathon**.

### Technologies Used

- FastAPI
- React
- Vite
- Supabase
- OpenAI
- Railway
- Vercel
- Open-Meteo

---

# 📄 License

This project was created for educational and hackathon purposes.

---

⭐ If you found this project useful, please consider giving it a star!
