# ACADARA: AI-Driven Academic Mentorship Platform

**ACADARA** is an intelligent mentorship matching system designed to bridge the gap between students (mentees) and experts (mentors). Unlike traditional platforms that rely on simple keyword searches, ACADARA utilizes **OpenAI Semantic Embeddings** and **Cosine Similarity** to connect users based on the deep contextual meaning of their goals and expertise.

## 🛠 Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | React, Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Sequelize ORM) |
| **AI Engine** | OpenAI API (text-embedding-3-small) |
| **Authentication** | JSON Web Tokens (JWT) |

---

## 🧠 Core Feature: Semantic Matching

The heart of ACADARA is its matching engine. Instead of searching for "React" and finding only "React," the system understands that a mentee wanting to learn **"UI Libraries"** is a conceptual match for a mentor specializing in **"Frontend Development and React."**

1. **Vectorization:** User profiles are transformed into 1,536-dimensional vectors.
2. **Mathematical Alignment:** The system calculates the angle between vectors using Cosine Similarity.
3. **Discovery:** High-scoring matches are presented to the user, regardless of exact keyword overlap.

---

## 📦 Project Structure

### Backend (`/backend`)

Handles API requests, database management, and the AI integration layer.

* `controllers/`: Logic for user management and matching.
* `models/`: Sequelize schemas for Users, Mentors, Mentees, and Matches.
* `core/api-services/`: Integration with OpenAI for embedding generation.
* `routes/`: Express route definitions.

### Frontend (`/frontend`)

A modern, dark-themed dashboard built for speed and clarity.

* `src/pages/`: Mentee and Mentor command centers.
* `src/core/api-hooks/`: Custom React hooks for data fetching (`useUserService`).
* `src/components/`: Reusable UI components like `StatCard`.

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js (v16 or higher)
* PostgreSQL
* OpenAI API Key

### 1. Clone the repository

```bash
git clone git@github.com:bonsurdev-code/acadara-system.git
cd acadara-system

```

### 2. Backend Setup

```bash
cd backend
npm install
# copy .env.example to your .env file
npm start

```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

---

## 🛡️ License

Distributed under the MIT License.

---

### Suggested Mentor Profile for your Math Testing:

To test your **Discrete Math** mentee, use this mentor profile:

* **Subject:** `Computer Science & Mathematics`
* **Topics:** `Discrete Structures, Formal Logic, Graph Theory, and Algorithm Analysis.`

This should yield a high similarity score (likely **> 0.85**) because the technical terms align perfectly with your mentee's goal.