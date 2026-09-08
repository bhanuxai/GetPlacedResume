# GetPlacedResume

> **AI Resume & CV ATS Analyzer** — Explainable, semantic, multi-dimensional ATS resume evaluation platform.

---

## 🚀 Overview

**GetPlacedResume** is a modern, full-stack application designed to analyze resumes against job descriptions using advanced semantic matching, ATS heuristic scoring, and actionable feedback.

- **Backend**: FastAPI, Python, Pydantic, Semantic NLP Matching, Heuristic Scoring Engines.
- **Frontend**: React 19, Vite, Tailwind CSS, Three.js / React Three Fiber, Lucide Icons, Framer Motion.

---

## 📁 Project Structure

```
Resume_ATS/
├── backend/
│   ├── models/            # Pydantic schemas and data models
│   ├── services/          # Parsers, semantic matchers, analyzers, scoring engine
│   ├── main.py            # FastAPI entrypoint and API routes
│   └── sample_data.py     # Sample resumes and job descriptions
├── frontend/
│   ├── src/               # React components, 3D scenes, UI types, styles
│   ├── public/            # Static assets and icons
│   ├── package.json       # Frontend dependencies and scripts
│   └── vite.config.ts     # Vite configuration
└── sample_files/          # Sample resume documents (.pdf, .docx)
```

---

## 🛠️ Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install fastapi uvicorn pydantic python-multipart
uvicorn main:app --reload --port 8000
```

The API docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The web app will run locally at [http://localhost:5173](http://localhost:5173).

---

## 📄 License

MIT License
