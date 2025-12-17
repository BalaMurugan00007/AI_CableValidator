# AI-Driven Cable Design Validation System

An AI-powered system that validates low-voltage cable designs against IEC 60502-1 and IEC 60228 using large language model (LLM) reasoning instead of hardcoded rule engines.

This project demonstrates how AI can assist engineering design reviews by providing parameter-level validation, explainable reasoning, and confidence scoring.

---

##  Problem Statement

Traditional cable design validation requires engineers to manually compare design parameters against IEC standards.  
This process is:
- Time-consuming
- Error-prone
- Highly dependent on senior engineer expertise

This system explores whether an AI model can perform **engineering standards validation using reasoning**, rather than deterministic rules.

---

##  Project Objectives

- Accept structured JSON or semi-free-text cable design inputs
- Extract technical parameters using AI
- Validate designs using AI reasoning (no hardcoded IEC tables)
- Produce:
  - PASS / WARN / FAIL results per parameter
  - Human-readable engineering reasoning
  - Overall confidence score

---

##  AI-Driven Validation Approach

- No IEC rules or tables are hardcoded
- The LLM:
  - Extracts cable attributes
  - Interprets IEC expectations implicitly
  - Evaluates compliance using engineering judgment
- Overall design quality (fully compliant / borderline / invalid / ambiguous) is expressed **only in reasoning**, not derived by backend logic

This mirrors how real engineering reviews are performed.

---

## System Architecture

```text
[ Frontend (Next.js) ]
        |
        |  HTTP (JSON)
        v
[ Backend API (NestJS) ]
        |
        |  Prompt + Input
        v
[ Gemini LLM ]
        |
        |  AI Reasoning Output
        v
[ Validation Results + Explanation ]
```

---

##  Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Material UI (MUI)

### Backend
- NestJS
- TypeScript
- Google Gemini API

### AI
- Gemini 2.5 (Flash / Lite)
- Prompt-based engineering reasoning
- Structured JSON outputs

---

##  Project Structure
```text
AI_CableValidator/
│
├── frontend/                     # Frontend (Next.js)
│   ├── app/
│   │   ├── api/                  # (optional) frontend-only API routes
│   │   ├── design-validator/
│   │   │   └── page.tsx          # Design validation UI
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── favicon.ico
│   │
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
├── backend/                      # Backend (NestJS)
│   ├── src/
│   │   ├── design-validation/
│   │   │   ├── design-validation.controller.ts
│   │   │   ├── design-validation.service.ts
│   │   │   └── design-validation.module.ts
│   │   │
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   └── nest-cli.json
│
├── .gitignore
├── README.md
└── package.json                  # (optional root scripts)
```

---

##  How to Run the Project

### Prerequisites
- Node.js (v18+ recommended)
- npm
- Google Gemini API Key

---

### Backend Setup

```bash
cd backend
npm install
npm run start
```
Create a .env file inside backend/:
GEMINI_API_KEY=your_api_key_here

Backend runs at:
http://localhost:3000

### Frontend Setup
npm install
npm run dev

---

Frontend runs at:
http://localhost:3001/design-validator

Example Input:
IEC 60502-1 cable, 16 sqmm Cu Class 2, PVC insulation 0.9 mm

---
###Example Test cases 
<img width="273" height="848" alt="image" src="https://github.com/user-attachments/assets/5e212058-5cdd-49b2-95fd-1708464645d5" />





