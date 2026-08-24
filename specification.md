## 1. Project Overview

* **Project Name:** RAG-Based College Chatbot.

* **Project Purpose:** An AI-powered college information assistant that answers student questions using Retrieval-Augmented Generation (RAG).
* **Background & Problem:** College students often struggle to find accurate administrative and academic information spread across multiple PDFs and notices. This project replaces manual searches with a centralized digital semantic search system.
* **Target Users:** Students (who ask questions) and Administrators (who manage the knowledge base).
* **Core Value Proposition:** Instantly retrieves accurate information exclusively from uploaded college documents, preventing hallucinations and providing verifiable source references.

## 2. Official Requirements & Traceability
### 2.1 Mandatory Requirements (Must-Have)
The following requirements are strictly mandated by the NxtWave evaluation criteria:

* **User Authentication:** Students and admins must be able to log in.
* **Chat Interface:** Students must be able to ask college-related questions.
* **Admin Document Management:** Admins can upload, update, and delete documents (PDFs).
* **Document Processing:** Text extraction and chunking.
* **Embedding Generation & Storage:** Must generate embeddings and store them in a Vector Database.
* **RAG Pipeline:** Retrieve relevant context via semantic search and pass it to an LLM.
* **AI-Generated Answers with Citations:** Answers must be based *only* on the knowledge base, and the system must explicitly display the source/reference used.
* **Unknown Question Handling:** The AI must clearly state when it does not know the answer if the relevant information is unavailable.
* **Deployment & Integration:** Working frontend-backend integration with the application deployed and accessible online.
* **Clean Repository:** No exposed API keys or `.env` files committed to GitHub.

### 2.2 Implied Requirements

* **Role-Based Access Control (RBAC):** To separate Student Chat interfaces from Admin Document interfaces.
* **PDF Parsing Module:** The backend requires a dedicated Node.js library to extract text before upload.
* **File Storage Integration:** Raw PDFs must be hosted on Cloudinary so they can be referenced or downloaded by users.

### 2.3 Optional Recommendations (Deferred)

* *Excluded for MVP to ensure 14-day completion:* Voice input, streaming AI responses, multilingual support, OCR for scanned documents, admin analytics, and department-wise knowledge bases.



## 3. Technology Stack

| Layer | Technology | Reason | Required/Optional |
| --- | --- | --- | --- |
| **Frontend Framework** | React (Vite) / Tailwind CSS | Standard MERN stack UI | Required (Implicit) |
| **Frontend State** | Zustand | Global state management for auth and chat | User Choice |
| **Backend Framework** | Node.js & Express | Standard MERN stack API | Required (Implicit) |
| **Data Validation** | Zod | Type-safe schema validation for APIs | User Choice |
| **Database** | MongoDB Atlas | Stores users, chats, metadata | Required

 |
| **Vector Database** | MongoDB Atlas Vector Search | NxtWave recommendation | Required

 |
| **Caching Layer** | Redis | Caches frequently accessed RAG responses | User Choice |
| **File Storage** | Cloudinary | Hosts raw PDF assets | User Choice |
| **File Parser** | `pdf-parse` (Node.js) | Extracts text from PDFs | Implied |
| **LLM Provider** | Google Gemini 2.5 Flash | User Choice for text generation | User Choice |
| **Embedding Model** | Google Generative AI Embeddings | Generates vector representations | User Choice |
| **Frontend Hosting** | Vercel | NxtWave architectural recommendation | Required

 |
| **Backend Hosting** | Render | NxtWave architectural recommendation | Required

 |

## 4. System Architecture & RAG Pipeline

The retrieval pipeline and caching layer must follow this exact sequential flow:

1. **Document Ingestion:** Admin uploads a PDF. Zod validates the upload request. The Express backend receives the file buffer.
2. **File Hosting:** The file is uploaded to Cloudinary to receive a public `secure_url`.
3. **Text Extraction & Chunking:** The backend extracts raw text and splits it into overlapping chunks.
4. **Embeddings:** Each text chunk is passed to the Google GenAI embedding model.
5. **Vector Storage:** Chunks, vectors, and metadata are saved into MongoDB Atlas Vector Search. Redis cache for queries is invalidated to ensure fresh data.
6. **Query Validation (Zod):** When a student queries, the payload is validated via a Zod middleware (e.g., checking query length and format).
7. **Cache Check (Redis):** The backend checks Redis for the exact query string. If a cached answer exists, it is returned immediately with citations, skipping the LLM and Vector DB.
8. **Retrieval:** If no cache exists, the query is embedded, and MongoDB Atlas Vector Search performs a `$vectorSearch` to find the most similar chunks.
9. **Generation & Attribution:** Gemini generates the answer. The backend attaches the `secure_url` of the source document.
10. **Cache Storage (Redis):** The generated answer and citation are stored in Redis with a 24-hour TTL before being sent to the frontend.
## 5. Frontend & State Management Requirements
* **Zustand Store (`useAppStore`):**
* `authStore`: Manages JWT token, user role (Admin/Student), and login state.
* `chatStore`: Manages the active conversation array, loading states during LLM generation, and UI toggles.


* **Chat Behavior:**
* **Context Strictness:** The system must refuse to answer non-college-related questions or questions missing from the vector context.
* **Source Display:** Every AI answer must include a clickable link (Cloudinary URL) or visual badge indicating the document title.



## 6. Database / Storage Design
**MongoDB Collections:**

1. `Users`: `_id`, `name`, `email`, `passwordHash`, `role` (Admin/Student).
2. `Documents`: `_id`, `title`, `cloudinaryUrl`, `cloudinaryId`, `uploadedBy`, `createdAt`.
3. `VectorChunks` (Vector Store): `_id`, `documentId` (ref), `textChunk`, `embedding` (Array of floats), `sourceMetadata`.
4. `Chats`: `_id`, `userId`, `messages` (Array of roles and content).

**Redis Keyspaces:**

* `rag_cache:{query_hash}` -> Stores the finalized LLM text and citation metadata. TTL: 86400 seconds (24 hours).

## 7. API & Zod Specification
All incoming requests must pass through a generic Zod validation middleware before hitting the controller.
* `POST /api/auth/register` (Zod: validates email format, password strength)
* `POST /api/auth/login` (Zod: validates email, password)
* `GET /api/documents` (Admin: list docs)
* `POST /api/documents/upload` (Admin: handles file upload, Cloudinary upload, PDF parsing, embedding, and vector DB insertion)
* `DELETE /api/documents/:id` (Admin: cascades deletion of chunks and Cloudinary asset, clears Redis cache)
* `POST /api/chat` (Student: Zod validates query string. Performs Redis check -> semantic search -> Gemini -> cache -> returns answer + sources)

## 8. Security and Privacy
* **Secret Management:** API keys (Google, Cloudinary, MongoDB, Redis URL, JWT Secret) must reside strictly in `.env` files.
* **CORS:** Backend must restrict cross-origin requests to the Vercel frontend URL.
* **Authentication:** API routes must be protected using JWT verification middleware. Role checks required for `/api/documents`.

## 9. Deployment Architectur
* **Source Code:** Maintained on GitHub; no sensitive credentials in the code.
* **Frontend (Vercel):** Connects to backend via `VITE_API_URL`.
* **Backend (Render):** Listens on `process.env.PORT` (not hardcoded to 5000), connects to Atlas, Redis, and Google APIs.
* **Database (MongoDB Atlas):** Network access configured to allow Render IPs (or `0.0.0.0/0` temporarily).



## 10. Development Plan (14-Day MVP Focus)

* **Day 1-2 (Foundation):** Set up GitHub repo, initialize React (Vite) and Node/Express. Configure MongoDB Atlas, Redis instance (e.g., Upstash/Render Redis), and basic Zod schemas. Initialize Zustand store.
* **Day 3-4 (Uploads & Assets):** Implement Cloudinary integration and the Admin Document UI (Table + Upload form).
* **Day 5-7 (Data Ingestion Pipeline):** Integrate PDF parser. Implement text splitting. Integrate Google GenAI SDK to generate embeddings and store them in MongoDB.
* **Day 8-9 (Vector Search Index):** Create and test the Atlas Vector Search JSON index. Validate similarity search manually via backend scripts.
* **Day 10-11 (RAG & Redis):** Build the `/api/chat` endpoint. Implement Zod validation, Redis caching layer, and Gemini LLM prompt construction. Handle "Unknown" edge cases.
* **Day 12 (Frontend Chat UI):** Wire Zustand to the React components. Build the student chat interface, message history display, and source/citation linking.
* **Day 13 (Deployment):** Deploy frontend to Vercel and backend to Render. Configure all production environment variables.
* **Day 14 (Testing & Submission):** Conduct end-to-end testing of the live URLs. Write the mandatory `README.md` and complete the NxtWave submission form.



## 11. Acceptance Criteria

* [ ] User can register and log in as either Student or Admin.
* [ ] Global state is seamlessly handled by Zustand without prop drilling.
* [ ] Backend APIs strictly reject invalid data via Zod schemas.
* [ ] Admin can upload a PDF, which automatically parses and populates the vector database.
* [ ] Student can ask a question; the response is generated via Gemini using only the uploaded PDF context.
* [ ] Repeated identical questions are served near-instantly from the Redis cache.
* [ ] The chatbot UI explicitly displays the name/link of the source document used.
* [ ] The chatbot explicitly declines to answer questions not covered by the documents.



## 12. Submission Checklist (NxtWave Guidelines)

Ensure the following are complete before submitting to the NxtWave portal:

* [ ] Project built independently.
* [ ] Frontend deployed to Vercel and fully working.
* [ ] Backend API deployed to Render and communicating with the database.
* [ ] GitHub repository contains no `.env` or secret credentials.
* [ ] `README.md` includes Project Name, Problem Statement, Features, Tech Stack, Screenshots, Live Demo URL, Backend URL, Setup Instructions, and Required Env Variable names.



---

**Instructions for the AI Agent (Antigravity):**
*Read this specification as the absolute ground truth. Enforce Zod validation on every route. Utilize Zustand slices for clean state management on the client. Keep the embedding logic contained in a dedicated service, and wrap the LLM generation step with a Redis cache check to optimize API usage. Begin execution by setting up Phase 1 (Foundation).*