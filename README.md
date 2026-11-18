<div align="center">

<img src="client/assets/images/logo.svg" alt="ReadyCVs logo" width="90" />

# ReadyCVs

**AI-powered resume builder, resume writer and ATS score checker.**

Build a job-winning resume in minutes, get AI-written bullet points, and see how well your CV passes Applicant Tracking Systems.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-D97757)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

## Features

| Module | Description |
| --- | --- |
| **Resume Maker** | Live-preview resume editor with multiple professional templates and print-ready PDF output. |
| **AI Resume Writer** | Generates ATS-friendly, metric-driven bullet points and full resume drafts from a short prompt. |
| **ATS Score Checker** | Upload a resume (PDF/DOCX) and get a score with keyword, formatting and section feedback. |
| **Grammar Checker** | Built-in checks to polish wording before you export. |
| **Authentication** | Email/password and Google sign-in, password reset, and user profile powered by Firebase. |
| **Help Center and Team page** | FAQs, guides and project information. |

## Tech Stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript (ES modules)
- **Backend:** Node.js, Express, Multer
- **AI:** Anthropic Claude via `@anthropic-ai/sdk`
- **Auth and Database:** Firebase Authentication, Firestore, Storage
- **Hosting:** Firebase Hosting (frontend), any Node host for the API

## Project Structure

```
readycvs/
├── client/                  # Frontend (static site)
│   ├── index.html           # Landing page
│   ├── resume_maker.html    # Resume editor
│   ├── ai_resume_writer.html
│   ├── ats_page.html        # ATS checker
│   ├── ats_score_result.html
│   ├── login.html  signup.html  forgot_password.html  reset.html
│   ├── profile.html  help.html  team.html
│   ├── css/                 # Stylesheets
│   ├── js/
│   │   ├── core/            # Firebase config, API helper, shared utilities
│   │   ├── auth/            # Auth manager and auth scripts
│   │   ├── features/        # Resume maker, AI writer, ATS, grammar checker
│   │   └── templates/       # Resume template definitions
│   └── assets/
│       ├── images/          # Logos and images
│       └── audio/           # Sound effects
├── server/
│   └── server.js            # Express API (AI writer, ATS score, chat)
├── docs/                    # Extra documentation
├── firebase.json            # Firebase Hosting config (serves ./client)
├── firestore.rules          # Firestore security rules
├── .env.example             # Environment variable template
├── package.json
└── LICENSE
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- An [Anthropic API key](https://console.anthropic.com/)
- A [Firebase](https://console.firebase.google.com/) project

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/readycvs.git
cd readycvs

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then edit .env and add your ANTHROPIC_API_KEY

# 4. Start the server
npm start
```

Open **http://localhost:3001** in your browser. The Express server serves both the API and the `client/` folder.

For auto-reload during development, use `npm run dev`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key used for all AI features. |
| `PORT` | No | Server port (default `3001`). |

> Never commit your `.env` file. It is already listed in `.gitignore`.

## Firebase Setup

1. Create a project in the Firebase Console.
2. Enable **Authentication** (Email/Password and Google), **Firestore** and **Storage**.
3. Replace the config object in `client/js/core/firebase.js` (and `client/js/core/firebaseAuth.js`) with your own project's web config.
4. In *Authentication > Settings > Authorized domains*, add your deployment domain (required for password reset).
5. Deploy security rules from `firestore.rules`, after replacing `YOUR_ADMIN_EMAIL` with your admin account:

   ```bash
   firebase deploy --only firestore:rules
   ```

## API Reference

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/ai-write` | Generate resume bullet points for a given section. |
| `POST` | `/ai-full-resume` | Generate a complete resume draft from a description. |
| `POST` | `/ats-score` | Upload a resume (`multipart/form-data`, field `resume`) and receive an ATS score. |
| `POST` | `/chat` | Chat assistant endpoint. |
| `GET`  | `/key-status` | Check whether an API key is configured. |

## Deployment

**Frontend (Firebase Hosting):**

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

**Backend:** deploy `server/` to any Node.js host (Render, Railway, Fly.io, etc.), set `ANTHROPIC_API_KEY` as an environment variable, and update the API base URL in `client/js/core/api.js`.

## Team

Built by **Aman Rawat** **Suryoday**, **Saurabh Devrari**, and **Devendra Singh**.

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
