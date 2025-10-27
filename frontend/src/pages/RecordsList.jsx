import { useEffect, useState } from "react";
import { getRecords } from "../api/api";
import "./RecordsList.css";

export default function RecordsList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await getRecords();
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    }
    fetchRecords();
  }, []);

  return (
    <div className="table-container">
      <h2 className="records-title">Past Loan Predictions</h2>

      <table className="records-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Income</th>
            <th>Loan Amount</th>
            <th>Status</th>
            <th>Confidence</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.gender}</td>
                <td>{r.applicant_income}</td>
                <td>{r.loan_amount}</td>
                <td
                  className={
                    r.status === "Eligible" ? "status-eligible" : "status-not"
                  }
                >
                  {r.status}
                </td>
                <td>{r.confidence}%</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#555" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
