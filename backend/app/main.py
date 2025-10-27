# from fastapi import FastAPI, HTTPException
# # 1. ADD THIS IMPORT
# from fastapi.middleware.cors import CORSMiddleware

# from app.schemas import Applicant
# # We will define load_model in this file, so remove it from this import
# from app.model_utils import preprocess_input, predict_model
# from app.db import engine, predictions
# from sqlalchemy import insert, select
# from datetime import datetime
# import joblib 
# from pathlib import Path 

# app = FastAPI(title="Loan Eligibility API")

# # 2. DEFINE YOUR FRONTEND'S ORIGIN
# #    (Update this if your React app runs on a different port)
# origins = [
#     "http://localhost",
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]

# # 3. ADD THE MIDDLEWARE TO YOUR 'app'
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allows all headers
# )
# def load_model():
#     """
#     Loads the model from the correct packaged path relative to this file.
#     """
#     try:
#         MODEL_PATH = Path(__file__).parent / "models" / "model.pkl"
        
#         print(f"Attempting to load model from: {MODEL_PATH}")
        
#         if not MODEL_PATH.exists():
#             print(f"ERROR: Model file not found at {MODEL_PATH}")
#             return None

#         # 3. REPLACE THE 'with open...' BLOCK WITH THIS:
#         model = joblib.load(MODEL_PATH)
        
#         print("Model loaded successfully.")
#         return model
#     except Exception as e:
#         print(f"An error occurred while loading the model: {e}")
#         return None

# model = None
# try:
#     model = load_model()

# except Exception as e:
#     print(f"Warning: model not loaded: {e}")

# # ... (the rest of your main.py file remains the same) ...
# @app.on_event("startup")
# def startup_event():
#     from app.db import create_tables
#     create_tables()

# @app.post("/predict")
# def predict(applicant: Applicant):
#     global model
#     if model is None:
#         # Updated the error message to be more specific
#         raise HTTPException(status_code=500, detail="Model not loaded. Check server logs for file path errors.")
#     data = applicant.dict()
#     features = preprocess_input(data)
#     status, confidence = predict_model(model, features)
#     advice = generate_advice(data, status)
#     created_at = datetime.utcnow().isoformat()
#     ins = insert(predictions).values(
#         name=data.get("name"),
#         gender=data["gender"],
#         married=data["married"],
#         dependents=data["dependents"],
#         education=data["education"],
#         self_employed=data["self_employed"],
#         applicant_income=data["applicant_income"],
#         coapplicant_income=data["coapplicant_income"],
#         loan_amount=data["loan_amount"],
#         loan_term=data["loan_term"],
#         credit_history=data["credit_history"],
#         property_area=data["property_area"],
#         status=status,
#         confidence=confidence,
#         advice=advice,
#         created_at=created_at
#     )
#     conn = engine.connect()
#     result = conn.execute(ins)
#     conn.commit()
#     record_id = result.inserted_primary_key[0]
#     conn.close()
#     return {"id": record_id, "status": status, "confidence": round(confidence*100,2), "advice": advice, "created_at": created_at}

# @app.get("/records")

# def get_records():
#     conn = engine.connect()
#     sel = select(predictions).order_by(predictions.c.id.desc())
#     rows = conn.execute(sel).fetchall()
#     conn.close()
    
#     # This line is the fix
#     records = [dict(r._mapping) for r in rows] 
    
#     for r in records:
#         r["confidence"] = round(r["confidence"]*100, 2) if r.get("confidence") is not None else None
#     return records

# def generate_advice(data, status):
#     tips = []
#     if data.get("credit_history", 0) == 0:
#         tips.append("Build credit history: pay existing bills on time.")
#     income = float(data.get("applicant_income", 0)) + float(data.get("coapplicant_income", 0))
#     if income < data.get("loan_amount", 0) * 0.5:
#         tips.append("Increase income or reduce loan amount requested.")
#     if status == "Not Eligible" and not tips:
#         tips.append("Check credit score and reduce requested loan.")
#     return " ".join(tips)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import insert, select, func
from datetime import datetime
import joblib
from pathlib import Path
import pandas as pd  # Make sure pandas is imported at the top

from app.schemas import Applicant
# from app.model_utils import preprocess_input, predict_model # <-- REMOVED
from app.db import engine, predictions

app = FastAPI(title="Loan Eligibility API")

# --- CORS Configuration ---
origins = [
    "http://localhost",
    "http://localhost:5173", # Assuming your React app is on 5173
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Loading ---
model = None
try:
    # --- CHANGED to load the new model file ---
    MODEL_PATH = Path(__file__).parent / "models" / "loan_pipeline.joblib"
    
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded successfully from: {MODEL_PATH}")
    else:
        print(f"ERROR: Model file not found at {MODEL_PATH}")
except Exception as e:
    print(f"An error occurred while loading the model: {e}")

@app.on_event("startup")
def startup_event():
    from app.db import create_tables
    create_tables()

# --- Endpoints ---

@app.post("/predict")
def predict(applicant: Applicant):
    global model
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Check server logs.")
    
    data = applicant.dict()
    
    # Use pandas DataFrame for preprocessing
    try:
        # This now calls the local preprocess_input function
        features = preprocess_input(data)
    except Exception as e:
        print(f"Error during preprocessing: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid input data: {e}")

    # This now calls the local predict_model function
    status, confidence = predict_model(model, features)
    advice = generate_advice(data, status)
    created_at = datetime.utcnow().isoformat()
    
    ins = insert(predictions).values(
        name=data.get("name"),
        gender=data["gender"],
        married=data["married"],
        dependents=data["dependents"],
        education=data["education"],
        self_employed=data["self_employed"],
        applicant_income=data["applicant_income"],
        coapplicant_income=data["coapplicant_income"],
        loan_amount=data["loan_amount"],
        loan_term=data["loan_term"],
        credit_history=data["credit_history"],
        property_area=data["property_area"],
        status=status,
        confidence=confidence,
        advice=advice,
        created_at=created_at
    )
    
    conn = engine.connect()
    try:
        result = conn.execute(ins)
        conn.commit()
        record_id = result.inserted_primary_key[0]
    except Exception as e:
        conn.rollback()
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Could not save prediction to database.")
    finally:
        conn.close()
        
    return {
        "id": record_id, 
        "status": status, 
        "confidence": round(confidence*100, 2), 
        "advice": advice, 
        "created_at": created_at
    }

@app.get("/records")
def get_records():
    conn = engine.connect()
    sel = select(predictions).order_by(predictions.c.id.desc())
    rows = conn.execute(sel).fetchall()
    conn.close()
    
    # Use ._mapping to fix the TypeError
    records = [dict(r._mapping) for r in rows]
    
    for r in records:
        r["confidence"] = round(r["confidence"]*100, 2) if r.get("confidence") is not None else None
    return records

# --- NEW ENDPOINT ---
@app.get("/records/{name}")
def get_records_by_name(name: str):
    """
    Fetches all prediction records for a specific applicant name.
    The search is case-insensitive.
    """
    conn = engine.connect()
    
    # Use func.lower() for a case-insensitive search
    sel = select(predictions).where(
        func.lower(predictions.c.name) == func.lower(name)
    ).order_by(predictions.c.id.desc())
    
    rows = conn.execute(sel).fetchall()
    conn.close()
    
    records = [dict(r._mapping) for r in rows]
    
    for r in records:
        r["confidence"] = round(r["confidence"]*100, 2) if r.get("confidence") is not None else None
    
    return records

# --- Utility Function ---
def generate_advice(data, status):
    tips = []
    if data.get("credit_history", 0) == 0:
        tips.append("Build credit history: pay existing bills on time.")
    income = float(data.get("applicant_income", 0)) + float(data.get("coapplicant_income", 0))
    if data.get("loan_amount", 0) > 0 and income < data.get("loan_amount", 0) * 0.5: # Added check for loan_amount > 0
        tips.append("Increase income or reduce loan amount requested.")
    if status == "Not Eligible" and not tips:
        tips.append("Check credit score and reduce requested loan.")
    return " ".join(tips)

# --- Preprocessing & Prediction Functions ---

def preprocess_input(data: dict):
    """
    Converts raw dictionary data into a DataFrame for the model.
    """
    dep = data.get("dependents", "0")
    dep_val = 3 if dep == "3+" else int(dep)
    
    feature_dict = {
        "Gender": data.get("gender"),
        "Married": data.get("married"),
        "Dependents": dep_val,
        "Education": data.get("education"),
        "Self_Employed": data.get("self_employed"),
        "ApplicantIncome": float(data.get("applicant_income", 0)),
        "CoapplicantIncome": float(data.get("coapplicant_income", 0)),
        "LoanAmount": float(data.get("loan_amount", 0)),
        # --- FIX: Renamed 'Loan_Term' to 'Loan_Amount_Term' to match the model ---
        "Loan_Amount_Term": int(data.get("loan_term", 0)),
        "Credit_History": int(data.get("credit_history", 0)),
        "Property_Area": data.get("property_area")
    }
    return pd.DataFrame(feature_dict, index=[0])

def predict_model(model, features: pd.DataFrame):
    """
    Gets a prediction and confidence score from the model.
    """
    pred = model.predict(features)
    proba = model.predict_proba(features)
    
    # pred[0] will be 1 (Y) or 0 (N)
    status = "Eligible" if int(pred[0]) == 1 else "Not Eligible"
    
    # Get the confidence for the predicted class
    # proba[0][0] = confidence for 'Not Eligible'
    # proba[0][1] = confidence for 'Eligible'
    confidence = float(proba[0][int(pred[0])])
    
    return status, confidence

