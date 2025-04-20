# 📚 Learning Tracker API

A FastAPI-based backend project to help programmers track their daily learning progress, including problems solved, platforms used, goals set, and time spent. Perfect for anyone preparing for coding interviews or tracking their developer journey.

---

## 🚀 Features

- 📝 Register and authenticate users
- 📊 Log daily coding practice (platform, topics, time, problems)
- 🎯 Set personal learning goals
- 📈 View learning statistics
- 🔒 Secure JWT-based authentication
- 🧪 Fully testable with Pytest

---

## 🏗️ Tech Stack

- **FastAPI** – High-performance backend framework
- **SQLAlchemy** – ORM for database models
- **SQLite** – Lightweight test database
- **Pydantic** – Data validation and serialization
- **Passlib** – Secure password hashing
- **Pytest** – Unit testing framework

---

## 📦 Installation

```bash
git clone https://github.com/<your-username>/learning-tracker-api.git
cd learning-tracker-api

# Create a virtual environment
python -m venv fastapi-env
source fastapi-env/bin/activate  # For Windows: fastapi-env\Scripts\activate

# Install dependencies
pip install -r requirements.txt
