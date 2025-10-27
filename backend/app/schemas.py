from pydantic import BaseModel
from typing import Optional

class Applicant(BaseModel):
    name: Optional[str] = None
    gender: str
    married: str
    dependents: str
    education: str
    self_employed: str
    applicant_income: float
    coapplicant_income: float
    loan_amount: float
    loan_term: int
    credit_history: int
    property_area: str

class PredictionRecord(Applicant):
    id: int
    status: str
    confidence: float
    advice: Optional[str]
    created_at: str
