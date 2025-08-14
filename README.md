# 📄 AI-Powered Resume Screener

A **full-stack web application** that helps recruiters and hiring managers efficiently **screen and rank resumes** based on their relevance to a specific job description.  
This project uses **Natural Language Processing (NLP)** to go beyond keyword matching, providing **semantic understanding** for more accurate and intelligent ranking.


---

## ✨ Key Features
- 🔐 **User Authentication** – Secure sign-up/login using **JWT (JSON Web Tokens)**  
- 📄 **Resume Uploads** – Upload PDF resumes, automatically parsed for raw text  
- 🧠 **Intelligent Ranking** – AI model ranks resumes based on semantic similarity to a job description  
- 📊 **Semantic Matching** – Context-aware matching, not just keyword checks  
- 🗂 **Private Dashboard** – Each user can manage and screen their own resumes  

---

## 🛠 Tech Stack

### Backend (Python)
- **Flask** – REST API framework  
- **MongoDB + PyMongo** – Database for resumes & user data  
- **Flask-JWT-Extended** – Authentication & security  
- **Sentence Transformers** – Semantic embeddings  
- **PyMuPDF (fitz)** – PDF text extraction  

### Frontend (JavaScript)
- **React.js** – User interface  
- **Tailwind CSS** – Styling  
- **Axios / Fetch API** – API communication  

---

## ⚙️ Installation & Setup

 1️⃣ Clone the Repository
```
git clone https://github.com/Mitisha20/Resume-Screener.git
cd Resume-Screener
```
2️⃣ Backend Setup
```
cd backend
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt

Create .env file in backend:
MONGO_URI=your_mongodb_connection_string
DB_NAME=resume_screener
JWT_SECRET_KEY=your_secret_key

Run backend:
python run.py
Backend runs at: http://127.0.0.1:5000
```
3️⃣ Frontend Setup
```
cd frontend
npm install
npm start
Frontend runs at: http://localhost:3000
```
📂 Project Structure
```
├── backend/
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── routes/           # API endpoints
│   │   └── __init__.py       # App factory
│   ├── uploads/              # Uploaded resumes
│   ├── requirements.txt
│   └── run.py
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── App.js
    │   └── index.js
    └── package.json
```
