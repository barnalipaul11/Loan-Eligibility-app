import joblib
import numpy as np
import os
import pandas as pd  # <-- 1. ADD THIS IMPORT

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.pkl")

def preprocess_input(data: dict):
    # The 'Dependents' column needs special handling to convert '3+' to 3
    # The StandardScaler in the pipeline expects this to be numeric.
    dep = data.get("dependents", "0")
    dep_val = 3 if dep == "3+" else int(dep)
    
    # Create a dictionary with the *exact* column names
    # your model was trained on (e.g., "ApplicantIncome", "Gender").
    # The values are from the incoming 'data' dict.
    # We pass raw strings ("Male", "Yes", etc.) because the
    # pipeline's OneHotEncoder will handle them.
    
    feature_dict = {
        "Gender": data.get("gender"),
        "Married": data.get("married"),
        "Dependents": dep_val, # Use our specially-handled value
        "Education": data.get("education"),
        "Self_Employed": data.get("self_employed"),
        "ApplicantIncome": float(data.get("applicant_income", 0)),
        "CoapplicantIncome": float(data.get("coapplicant_income", 0)),
        "LoanAmount": float(data.get("loan_amount", 0)),
        "Loan_Term": int(data.get("loan_term", 0)),
        "Credit_History": int(data.get("credit_history", 0)),
        "Property_Area": data.get("property_area")
    }
    
    # Convert the dictionary to a single-row pandas DataFrame
    # This is the format the ColumnTransformer expects.
    return pd.DataFrame(feature_dict, index=[0])

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run training to produce model.pkl")
    # Make sure you are using joblib.load if you saved with joblib
    return joblib.load(MODEL_PATH)

def predict_model(model, features):
    # 'features' is now a DataFrame, which the model pipeline expects
    pred = model.predict(features)
    proba = model.predict_proba(features)
    confidence = float(proba[0][1] if pred[0]==1 else proba[0][0])
    status = "Eligible" if int(pred[0])==1 else "Not Eligible"
    return status, confidence