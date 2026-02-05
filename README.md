
<div align="center">

  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-MERN%20%2B%20Supabase-blue?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/AI-Powered%20by%20Gemini-orange?style=for-the-badge" alt="AI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />

  <br />
  <br />

  # 🤖 GapSight - Clarity Beyond Correctness
  ### The AI-Powered Concept Gap Detector

  <p align="center">
    <b>Identify knowledge gaps. Diagnose misunderstandings. Master concepts faster.</b>
    <br />
    GapSight is an advanced AI learning assistant that doesn't just answer questions—it analyzes <i>how</i> you understand them. By leveraging Google's Gemini AI and real-time data synchronization with Supabase, it provides instant, personalized feedback to bridge the gap between confusion and clarity.
  </p>
  
</div>

---

## 🚀 Why This Project Matters

In traditional learning, misconceptions often go unnoticed until it's too late. Code-Tutor changes the paradigm by acting as a **Concept Gap & Misconception Detector**.

It's not just a chatbot; it's a **Pedagogical Engine** that:
*   **Diagnoses Root Causes:** It doesn't just say "Current is flow of electrons"; it identifies *why* you thought it was "flow of voltage".
*   **Real-Time Synchronization:** Every interaction is instantly synced across devices using **Supabase Realtime**, ensuring a seamless learning experience.
*   **Personalized Repair Paths:** Generates targeted questions to fix specific misunderstandings.
*   **Visual Learning:** Supports file uploads to analyze diagrams and handwritten notes.

---

## ✨ Key Features

### 🧠 **Advanced AI Diagnostics**
Powered by **Google Gemini Pro**, the system analyzes user explanations with deep semantic understanding to detect subtle misconceptions that keyword matching would miss.

### ⚡ **Real-Time Architecture**
Built on **Supabase**, featuring:
*   **Live Updates:** See diagnostic results instantly without refreshing.
*   **Connection Pooling:** Optimized database performance for high-concurrency.
*   **Robust Data Layer:** Industrial-grade PostgreSQL database with Drizzle ORM.

### 🎨 **Premium User Experience**
A "Glassmorphism" inspired UI built with **Shadcn/UI** and **Tailwind CSS**:
*   **Smooth Animations:** Framer Motion interactions that feel alive.
*   **Interactive Charts:** Visualization of knowledge coverage using Recharts.
*   **Responsive Design:** Flawless experience on mobile and desktop.

### 🔐 **Enterprise-Grade Security**
*   **Authentication:** Secure user sessions via Passport.js.
*   **Environment Safety:** Strict validation of environment variables using Zod.

---

## 🛠️ Technology Stack

### **Frontend**
*   ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 18** - Component-based UI library.
*   ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) **Vite** - Next-generation frontend tooling.
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript** - Static typing for robust code.
*   ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first styling.
*   ![Shadcn/UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white) **Shadcn/UI** - Accessible and customizable components.
*   ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) **Framer Motion** - Production-ready animations.

### **Backend**
*   ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) **Node.js** - JavaScript runtime.
*   ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat) **Express** - Fast, unopinionated web framework.
*   ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) **Supabase** - The Open Source Firebase alternative.
*   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** - The World's Most Advanced Open Source Relational Database.
*   ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat&logo=drizzle&logoColor=black) **Drizzle ORM** - Lightweight and type-safe ORM.

### **AI & Services**
*   ![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=googlebard&logoColor=white) **Google Gemini** - Generative AI model.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v20 or higher)
*   Supabase Account
*   Google Cloud Console Account (for Gemini API)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Prateek05-coder/AI-Concept-Gap-Detecting-Agent.git
    cd AI-Concept-Gap-Detecting-Agent
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory based on `.env.example`:
    ```env
    # Database
    DATABASE_URL=postgresql://...

    # Supabase
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...

    # AI
    AI_INTEGRATIONS_GEMINI_API_KEY=...
    ```

4.  **Push Database Schema**
    Sync your Supabase database with the Drizzle schema:
    ```bash
    npm run db:push
    ```

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```

    OPEN `http://localhost:5000` to view the application.

---

## 📂 Project Structure

```bash
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (use-toast, etc.)
│   │   ├── pages/          # Application views/routes
│   │   └── lib/            # Utilities and helpers
├── server/                 # Backend Express Application
│   ├── db.ts               # Database connection & pooling
│   ├── routes.ts           # API Routes definition
│   ├── services/           # AI & Business Logic
│   └── supabase.ts         # Supabase Client
├── shared/                 # Shared Types & Schema
│   └── schema.ts           # Drizzle ORM Schema
└── scripts/                # Build and utility scripts
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />
<div align="center">
  <p>Built with ❤️ by ResQtech</p>
</div>
