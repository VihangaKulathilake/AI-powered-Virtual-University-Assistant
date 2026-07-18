# AI-Powered Virtual University Assistant (UniAssist AI)
### Prototyping Challenge Submission

An intelligent, context-aware university chat assistant featuring user-scoped JWT authentication, voice assistance (Speech-to-Text & Text-to-Speech), a dynamic vector knowledge base (Pinecone RAG), and a production-ready dashboard.

---

## 1. Project Overview & Use Case
The chosen use case is a **University Virtual Assistant (Dr. Amelia - Software Engineering Lecturer)**. Students can register accounts, log in securely, and interact with the lecturer persona in a free-flowing chat interface. 

Students can upload lecture materials (PDFs, TXT, DOCX files) and images directly through the typing input bar. Dr. Amelia will retrieve matches semantically from Pinecone to explain coursework, slides, and syllabus documents, offering localized academic guidance.

---

## 2. System Architecture
The application is built on the **MERN (MongoDB, Express, React, Node.js) Stack + TypeScript + Pinecone Vector Database**.

```
  ┌─────────────────────────────────────────────────────────────┐
  │                        React Client                         │
  │   - JWT AuthContext (localStorage Session Restoration)       │
  │   - Voice Input (SpeechRecog) & Speech Synthesis (TTS)      │
  │   - Drag-and-drop file/image type-bar uploads               │
  └──────────────┬───────────────────────────────▲──────────────┘
                 │ HTTP API Request              │ JSON Response
                 ▼                               │
  ┌──────────────────────────────────────────────┴──────────────┐
  │                       Express Server                        │
  │   - Helmet, CORS, Morgan, JSON Body Parser                  │
  │   - JWT verifyToken middleware (protects all API routes)    │
  │   - Controller routers (/api/auth, /api/chats, /api/know)   │
  └──────────────┬───────────────────────────────┬──────────────┘
                 │ Mongoose                      │ Fetch Embeddings
                 ▼                               ▼
  ┌──────────────────────────────┐        ┌─────────────────────┐
  │        MongoDB Atlas         │        │    Pinecone DB      │
  │   - Users & Passwords (hash) │        │  - Vector Index    │
  │   - Chat Sessions (user ID)  │        │  - 3072 Dimensions  │
  │   - Messages (user ID)       │        │  - Metadata filter  │
  │   - File Catalogs (user ID)  │        │    (userId scope)   │
  └──────────────────────────────┘        └─────────────────────┘
```

---

## 3. Key Design Decisions & Trade-offs
* **User-Scoped Vector Searching**: Instead of sharing a single index globally (which leaks files across different users), we configured metadata filters on Pinecone. When documents are chunked and upserted, they are tagged with `{ userId: studentId }`. Queries are executed with a `{ userId: { $eq: studentId } }` metadata match filter.
* **REST HTTP Gemini Embeddings**: Switched the embedding creation calls from the SDK interface to a REST HTTP query for `gemini-embedding-001`. This generates precise 3072-dimensional embeddings.
* **Continuous Voice Mode**: The Speech Recognition toggles into continuous mode. It keeps the microphone listening during brief pauses so the student can formulate complex sentences naturally.
* **Multimodal Chat Support**: persist base64 image data inside the MongoDB message schema and pass it directly to Gemini's multimodal API if attached, letting Dr. Amelia read code screenshots.

---

## 4. Setup & Running Instructions

### Prerequisites
* Node.js (v18 or higher)
* MongoDB database instance
* Pinecone account and API key
* Google Gemini API key

### Configuration
Create a `.env` file inside the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=ai-assist
JWT_SECRET=your_super_strong_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### Running Backend
```bash
cd backend
npm install
npm run dev
```

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 5. Technology Stack
* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Axios.
* **Backend**: Node.js, Express, MongoDB/Mongoose, Multer (file parsing), pdf-parse, mammoth (Word text extraction), JsonWebToken, BcryptJS.
* **AI & Databases**: Google Gemini API (`models/gemini-embedding-001` & `gemini-3.5-flash`), Pinecone Serverless.
