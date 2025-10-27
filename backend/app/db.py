from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, Text
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "loan_db")

DATABASE_URL = "mysql+mysqlconnector://root:barnalipaul11@127.0.0.1:3306/loan_db"


engine = create_engine(DATABASE_URL, echo=False, future=True)
metadata = MetaData()

predictions = Table(
    "predictions",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(255), nullable=True),
    Column("gender", String(20)),
    Column("married", String(10)),
    Column("dependents", String(10)),
    Column("education", String(50)),
    Column("self_employed", String(10)),
    Column("applicant_income", Float),
    Column("coapplicant_income", Float),
    Column("loan_amount", Float),
    Column("loan_term", Integer),
    Column("credit_history", Integer),
    Column("property_area", String(50)),
    Column("status", String(50)),
    Column("confidence", Float),
    Column("advice", Text),
    Column("created_at", String(50)),
)

def create_tables():
    metadata.create_all(engine)

if __name__ == "__main__":
    create_tables()
    print("Tables created (if not exist).")
