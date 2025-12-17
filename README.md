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

##  System Architecture

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

---


AI_CableValidator/
├── app/                     # Next.js frontend
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── backend/                 # NestJS backend
│   ├── src/
│   │   └── design-validation/
│   │       ├── design-validation.controller.ts
│   │       ├── design-validation.service.ts
│   │       └── design-validation.module.ts
│   ├── package.json
│   └── tsconfig.json
├── public/
├── package.json
├── README.md
└── .gitignore

## How to Run the Project
cd backend
npm install
npm run start

