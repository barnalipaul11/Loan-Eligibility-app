Backend (FastAPI) setup:
1. Create MySQL database: CREATE DATABASE loan_db;
2. Update .env with DB credentials.
3. Install dependencies: pip install -r requirements.txt
4. Place your trained model at app/models/model.pkl (train in Colab or locally).
5. Run: uvicorn app.main:app --reload --port 8000
