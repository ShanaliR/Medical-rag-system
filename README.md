# Medical RAG System

> A Retrieval-Augmented Generation (RAG) system tailored for medical consultations and document-search workflows.

## ✅ Overview

This repository contains a full-stack example application (backend + frontend) that demonstrates building a RAG pipeline for medical consultation and document handling. It includes:

- Backend: Node.js Express API + services for embeddings and retrieval
- Frontend: React UI for chat, document management, and training interfaces
- Utilities: Embedding and RAG pipeline utilities, WhatsApp/email integrations, and helper scripts

## 🧭 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Branching Model](#-branching-model)
- [Contributing](#-contributing)
- [License](#-license)

## 🔍 Features

- Conversation handling and session management
- Document embedding and retrieval pipeline
- Training data management and QA/setup utilities
- Real-time interactions via WebSocket

## 🛠 Tech Stack

- Node.js, Express
- React (frontend)
- MongoDB (or configurable datastore)
- Embedding / vector DB utilities (configurable)

## 🚀 Getting Started

Prerequisites:
- Node.js 16+ and npm
- MongoDB or a configured datastore

Quick start (from repository root):

1. Install dependencies (backend and frontend):

   - Backend:
     ```bash
     cd my-backend
     npm install
     ```

   - Frontend:
     ```bash
     cd my-frontend
     npm install
     ```

2. Create a `.env` file for the backend configuration. Example keys:
   - MONGODB_URI
   - PORT
   - OPENAI_API_KEY (or other LLM provider keys)

3. Start the backend and frontend in separate terminals:

   - Backend: `npm run start` (or `npm run dev` if available)
   - Frontend: `npm run start`


## 🌿 Branching Model

- `main` — stable production-ready code
- `dev` — active development integration branch
- `FeatureRag` — feature branch for RAG improvements and experiments

All three branches will be created and pushed with the same initial codebase.

## 🤝 Contributing

1. Fork the repository and create a feature branch.
2. Open a pull request against `dev` (or `main` for hotfixes).
3. Maintain clean commits and include tests where applicable.

## 📝 Notes on Secrets

Do **not** commit secrets (API keys or private JSON credentials). Use `.env` files and add secrets to your deployment provider or environment secrets on GitHub.

## 📜 License

This project is available under the MIT License. See the `LICENSE` file for details.

---

If you'd like, I can also create a short `CONTRIBUTING.md` and a `CODE_OF_CONDUCT.md`.
