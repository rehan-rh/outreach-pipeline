# LeadFlow AI

**AI-Powered Lead Generation & Outreach Automation**

Discover companies, find verified contacts, and automate personalized outreach — all in one premium SaaS platform.

## Features

- **Company Discovery** — Find similar companies using Ocean.io API
- **Lead Search** — Discover decision-makers via Prospeo Search API
- **Email Enrichment** — Verify contact emails with Prospeo Enrich API
- **Automated Outreach** — Send personalized emails via Brevo SMTP
- **Analytics Dashboard** — Track leads, emails, and success rates
- **Pipeline Visualization** — See the full outreach flow in real-time

## Tech Stack

| Layer    | Technology                                      |
|----------|------------------------------------------------|
| Frontend | React, Vite, Tailwind CSS v4, Framer Motion, Recharts |
| Backend  | Node.js, Express                               |
| APIs     | Ocean.io, Prospeo, Brevo                       |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/rehan-rh/outreach-pipeline.git
cd outreach-pipeline

# Backend
cd backEnd
npm install

# Frontend
cd ../frontEnd
npm install
```

### 2. Configure Environment

**Backend** — Create `backEnd/.env`:
```env
OCEAN_API_KEY=your_ocean_api_key
PROSPEO_API_KEY=your_prospeo_api_key
BREVO_API_KEY=your_brevo_api_key
PORT=5000
```

**Frontend** — Create `frontEnd/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backEnd
npm start

# Terminal 2 — Frontend
cd frontEnd
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/companies` | Find similar companies |
| POST | `/api/search-leads` | Search leads by domain |
| POST | `/api/enrich` | Enrich lead by personId |
| POST | `/api/send-email` | Send email via Brevo |
| POST | `/api/pipeline` | Run full pipeline |

## Project Structure

```
outreach-pipeline/
├── backEnd/
│   ├── server.js              # Express API server
│   ├── app.js                 # Original CLI pipeline
│   └── src/
│       ├── routes/apiRoutes.js
│       └── services/
│           ├── oceanService.js
│           ├── prospeoService.js
│           ├── enrichPersonService.js
│           └── brevoService.js
├── frontEnd/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route pages
│       ├── layouts/           # Layout wrappers
│       ├── hooks/             # Custom React hooks
│       └── services/          # API client
└── README.md
```

## License

ISC
