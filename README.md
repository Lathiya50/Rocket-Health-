# Rocket Health - Consultation Summary Generator

A professional consultation summary generator for healthcare providers. This project consists of a modern React frontend and a secure Node.js/Express backend, enabling therapists to generate structured, editable consultation summaries with privacy and customization features.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Security & Privacy](#security--privacy)
- [License](#license)

---

## Features

### Frontend (React + Vite + Tailwind CSS)
- **Session Notes Input**: Large textarea with word/character counter and autosave to localStorage
- **Summary Preferences**: Tone (Clinical, Empathetic, Neutral), Summary Length (Short / Medium / Detailed), Anonymization, Action Items, Session Type
- **Generate Summary**: Triggers backend API call with loading states and error handling
- **Summary Output Display**: Editable rich-text preview, copy/download/send simulation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Auto-save**: Session notes and preferences are automatically saved to localStorage

### Backend (Node.js + Express)
- **Secure API**: POST `/api/generate-summary` with validation and rate limiting
- **Prompt Generation**: Dynamically builds GPT prompts using user preferences
- **PII Detection**: Automatically detects and optionally anonymizes personal information
- **OpenAI Integration**: Uses GPT-4 or DeepSeek for intelligent summary generation
- **Comprehensive Error Handling**

---

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Sonner (toasts), BlockNote (rich text), Axios
- **Backend**: Node.js, Express, OpenAI SDK, Joi (validation), dotenv, express-rate-limit, helmet, cors

## Getting Started

### Backend Setup
1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your OpenAI/OpenRouter API key and other settings.
3. **Start the backend server:**
   ```sh
   npm run dev
   # or
   npm start
   ```
   The backend runs on [http://localhost:8000](http://localhost:8000) by default.

### Frontend Setup
1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and adjust the API URL if needed.
3. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

---

## Environment Variables

### Backend (`backend/.env`)
- `OPENAI_API_KEY` - Your OpenAI or OpenRouter API key
- `AI_MODEL` - Model to use (e.g., `deepseek/deepseek-r1-0528:free`)
- `AI_BASE_URL` - Base URL for OpenAI/OpenRouter
- `PORT` - Backend server port (default: 3001)
- `FRONTEND_URL` - Allowed frontend origin (default: http://localhost:5173)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (ms)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Frontend (`frontend/.env`)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)
- `VITE_ENV` - Environment (development/production)
- `VITE_ENABLE_DEBUG` - Enable debug features

---

## Sample Session Notes

Here's an example of session notes you can input into the application:

```
Session Date: June 30, 2025
Duration: 50 minutes
Client: Sarah M. (32, F)

Presenting Issue:
Client reports continued anxiety around work performance and relationship with supervisor. States feeling "constantly on edge" at work and having difficulty sleeping due to ruminating thoughts about potential mistakes.

Session Content:
- Explored recent triggering events at work, particularly feedback received from supervisor last week
- Client described physical symptoms: rapid heartbeat, sweating palms, difficulty concentrating
- Discussed cognitive distortions, identified catastrophic thinking patterns ("If I make one mistake, I'll be fired")
- Practiced grounding techniques: 5-4-3-2-1 sensory method and box breathing
- Reviewed homework from last session: thought record completion (client completed 3 out of 7 days)
- Addressed barriers to homework completion: perfectionism and time constraints

Therapeutic Interventions:
- Cognitive restructuring for catastrophic thoughts
- Psycho education about anxiety response and fight/flight
- Behavioral activation: scheduled pleasant activities for weekend
- Assigned new homework: daily 10-minute mindfulness practice using app

Client Response:
- Engaged well in session, made good eye contact
- Initially resistant to challenging thoughts but became more open with gentle guidance
- Expressed motivation to try mindfulness practice
- Reported feeling "a bit lighter" after grounding exercises

Plan:
- Continue CBT approach focusing on workplace anxiety
- Next session: review mindfulness homework and explore assertiveness skills
- Consider discussing medication consultation if anxiety remains high
- Schedule follow-up in one week

Risk Assessment: No current safety concerns. Client has good support system and coping strategies.
```

## Usage
1. Enter session notes in the main input area.
2. Adjust summary preferences (tone, length, anonymization, etc.).
3. Click **Generate Summary** to receive an AI-generated consultation summary.
4. Edit, copy, download, or simulate sending the summary as needed.

---

## Security & Privacy
- All data is processed in-memory and not stored permanently.
- PII detection and optional anonymization are built-in.
- Secure HTTP headers and CORS are enforced on the backend.

---