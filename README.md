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
### Sample Test Cases (For Review & Demo) 
Test Case 1 — Fully Correct Design
Input
IEC 60502-1, 0.6/1 kV, Cu, Class 2, 10 mm², PVC, insulation 1.0 mm
Expected AI Output
•	Insulation thickness → PASS
•	CSA → PASS
•	Material/class → PASS
•	High confidence (≥ 0.85)

---

output:-
<img width="1091" height="597" alt="Screenshot 2025-12-16 202040" src="https://github.com/user-attachments/assets/5826fb30-18c1-41f6-a7e5-20498c76b296" />

Test Case 2 — Borderline / Warning Case
Input
IEC 60502-1 cable, 16 sqmm Cu Class 2, PVC insulation 0.9 mm
Expected
•	Insulation thickness → WARN
•	Explanation referencing nominal vs tolerance
•	Medium confidence

output:
<img width="999" height="595" alt="Screenshot 2025-12-16 204132" src="https://github.com/user-attachments/assets/c95e6120-54dd-4cfb-91ee-bdda4c85d8cf" />

---
Test Case 3 — Clearly Invalid Design
Input
IEC 60502-1, 0.6/1 kV, Cu, Class 2, 10 mm², PVC, insulation 0.5 mm
Expected
•	Insulation thickness → FAIL
•	Clear reasoning
•	Low confidence not acceptable (must still decide)

output:
<img width="1014" height="561" alt="Screenshot 2025-12-16 201235" src="https://github.com/user-attachments/assets/334057a9-818f-4bc8-86c6-e95ebcf84b13" />

---

Test Case 4 — Ambiguous Input
Input
10 sqmm copper cable with PVC insulation
Expected
•	Missing standard → WARN
•	Voltage unspecified → WARN
•	AI explanation clearly states assumptions

output:
<img width="1027" height="604" alt="Screenshot 2025-12-16 202524" src="https://github.com/user-attachments/assets/aecf6019-025f-4461-9558-835bd5ac5043" />













