# 🎓 RAG-Based College Chatbot

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

## 📖 Overview

A production-ready Retrieval-Augmented Generation (RAG) chatbot designed specifically for collegiate environments. It solves the problem of information fragmentation by delivering instant, context-aware answers to students and faculty through a vectorised knowledge base of college documents.


<h1>⚡ Instant Answers from Campus Data</h1>
<img width="1000" height="600" alt="Instant Answers from Campus Data" src="https://github.com/user-attachments/assets/9a4d308c-e9de-46ad-acdd-b5d54f24edf2" />


## ✨ Core Features

### 🚀 Seamless Guest Login
Frictionless onboarding with ephemeral guest sessions.
- **Mechanism:** MongoDB 24-hour TTL (Time-To-Live) indexes automatically purge guest data, ensuring a zero-maintenance, privacy-first experience.

<h1>🔒 Privacy-First Ephemeral Authentication</h1>
<img width="1000" height="600" alt=" Guest Auth Flow" src="https://github.com/user-attachments/assets/64be3bc7-1e47-4263-b4d2-4558574e3a91" />


### 🧠 Full-Sync Document Management (RAG Pipeline)
A resilient, synchronised approach to vector knowledge management.
- **Mechanism:** Uploaded documents are simultaneously stored in Cloudinary, while their vectorised representations are cached in Upstash Redis and indexed in MongoDB. Deletions trigger a synchronised wipe across all three services to prevent orphan data and vector drift.

<h1>⚙️ Admin Dashboard: Centralized Knowledge Management</h1>
<img width="1000" height="600" alt="Admin Dashboard Centralized Knowledge Management" src="https://github.com/user-attachments/assets/b9f96454-a73c-49a6-852b-48d1a76ee73b" />

### 🛡️ Robust API Rate Limiting & Error Handling
Enterprise-grade reliability out of the box.
- **Mechanism:** Centralized error handling combined with strict API rate limiting prevents abuse and ensures high availability, even during peak campus usage times (e.g., enrollment periods).

![GIF: Rate Limiting in Action](placeholder_rate_limiting.gif)

## 🏗️ High-Level Architecture

The system follows a strict, modular separation of concerns designed for horizontal scalability and rapid iteration.

[Insert System Architecture Diagram Here]

**Data Flow:**
1. **Frontend (Vercel):** React/Zustand layer captures user queries and manages state (API-Store-Component pattern).
2. **Backend (Render):** Node.js/Express layer processes requests via a strict Service-Controller-Route architecture.
3. **Data Layer:**
   - **MongoDB:** Core application state and document metadata.
   - **Upstash Redis:** High-speed vector caching for lightning-fast RAG retrieval.
   - **Cloudinary:** Secure, scalable blob storage for raw documents.

### 📐 The 180-Line Rule
To ensure maximum maintainability, this project enforces a strict **180-line limit per file**. This architectural constraint forces aggressive sub-modularization, guaranteeing that every service, controller, and component remains hyper-focused, easily testable, and highly legible.

## 🔌 Core API Contracts

Following the 80/20 rule, we highlight only the three architectural pillars of the system. For exhaustive endpoint details, refer to the source code.

| Endpoint | Method | Description | Body / Params |
|----------|--------|-------------|---------------|
| `/api/auth/guest-login` | `POST` | Initiates frictionless guest session (24h TTL index). | `{}` |
| `/api/chat` | `POST` | Executes the core RAG pipeline with strict rate-limiting. | `{ "message": "string" }` |
| `/api/documents/:id` | `DELETE` | Triggers a synchronized wipe across MongoDB, Redis, and Cloudinary. | `Params: { id: "string" }` |

## 🚀 Quick Start Guide

Spin up the entire development environment in seconds.

![GIF: Terminal Startup](placeholder_terminal_startup.gif)

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/rag-based-college-chatbot.git
cd rag-based-college-chatbot
npm install # Root dependencies (if configured using workspaces/scripts)
```

### 2. Configure Environment
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
# Add your MongoDB, Cloudinary, and Upstash API keys to the .env files
```

### 3. Start Backend
```bash
cd server
npm install
npm run dev
```

### 4. Start Frontend
```bash
cd client
npm install
npm run dev
```

## 🔐 Environment Variables

The project requires several secure keys to orchestrate the backend services and connect the UI.

> [!CAUTION]
> **SECURITY WARNING:** NEVER commit your actual `.env` files to version control. They are heavily `.gitignore`d for a reason. Always use environment variable managers in your deployment platforms (Vercel/Render).

| Scope | Variable | Purpose |
|-------|----------|---------|
| **Client** | `VITE_API_URL` | Connects the Vite frontend to the Express backend backend. |
| **Server** | `MONGODB_URI` | Connection string for MongoDB (Core Database). |
| **Server** | `CLOUDINARY_API_KEY` | Grants access to Cloudinary for raw document blob storage. |
| **Server** | `UPSTASH_REDIS_REST_URL` | Connects to Upstash Redis for high-speed vector caching. |
| **Server** | `GEMINI_API_KEY` | Authenticates with Gemini for the core LLM processing. |
| **Server** | `JWT_SECRET` | Cryptographic secret for signing session tokens. |

## 🧠 Engineering Learnings & Architecture Decisions

Building a resilient, production-ready RAG application brought several critical engineering challenges. Here is how we solved them:

- **The 180-Line Rule & Service-Controller-Store Pattern:** Enforcing strict line limits led to a highly resilient Service-Controller-Route (Backend) and API-Store-Component (Frontend) architecture. By aggressively decoupling logic, we drastically improved testability, isolated failure domains, and minimized cognitive load.
- **Handling Silent State Failures:** Debugging complex CORS constraints and state hydration issues during Vercel/Render deployments highlighted the dangers of silent UI failures. We solved this by implementing centralized error handling and robust programmatic navigation, ensuring that Zustand stores initialize and sync perfectly with React Router during Guest Auth redirection.
- **Full-Sync Document Deletion:** A naive deletion approach leaves orphan vectors in Redis or zombie blobs in Cloudinary. We engineered a unified, transactional-style deletion flow (MongoDB + Cloudinary + Redis) to completely eliminate memory leaks, prevent vector drift, and maintain absolute data integrity across the ecosystem.

## 🤝 Conclusion

Built with precision, strict architectural rules, and a passion for scalable engineering. This project aims to demonstrate how complex AI pipelines can be wrapped in reliable, maintainable code. 

For any feedback, questions, or collaboration, feel free to reach out!
