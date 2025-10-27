import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv"; 
import db from "./db.js"; 
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/check-loan", (req, res) => {
  const data = req.body;
  const {
    name, gender, married, dependents, education, self_employed,
    applicant_income, coapplicant_income, loan_amount,
    loan_term, credit_history, property_area
  } = data;

  const total_income = applicant_income + coapplicant_income;
  const max_loan_allowed = total_income * 0.7;

  let status = "Eligible";
  let reason = "";

  if (credit_history === 0) {
    status = "Not Eligible";
    reason = "Credit history is poor (0)";
  } else if (total_income < 2500) {
    status = "Not Eligible";
    reason = "Total income less than 2500";
  } else if (loan_amount > max_loan_allowed) {
    status = "Not Eligible";
    reason = "Loan amount exceeds 70% of salary";
  }

  const sql = `
    INSERT INTO loan_applications 
    (name, gender, married, dependents, education, self_employed,
     applicant_income, coapplicant_income, loan_amount, loan_term,
     credit_history, property_area, status, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    name, gender, married, dependents, education, self_employed,
    applicant_income, coapplicant_income, loan_amount, loan_term,
    credit_history, property_area, status, reason
  ], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "Loan eligibility checked",
      eligibility: status,
      reason: reason || "Eligible for loan"
    });
  });
});

// Add this new endpoint to get all records
app.get("/records", (req, res) => {
  const sql = "SELECT * FROM loan_applications ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // Send the list of records as JSON
    res.json(results);
  });
});

// This line should already be at the bottom
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));