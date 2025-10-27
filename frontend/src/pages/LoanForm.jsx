// import { useState } from "react";
// import { predictLoan } from "../api/api";
// import "./LoanForm.css"; // optional external CSS file

// export default function LoanForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     gender: "",
//     married: "",
//     dependents: "",
//     education: "",
//     self_employed: "",
//     applicant_income: "",
//     coapplicant_income: "",
//     loan_amount: "",
//     loan_term: "",
//     credit_history: "",
//     property_area: "",
//   });

//   const [result, setResult] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await predictLoan(formData);
//       setResult(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Error predicting loan eligibility");
//     }
//   };

//   return (
//     <div className="loan-form-container">
//       <h2 className="title">Loan Eligibility Form</h2>

//       <form onSubmit={handleSubmit} className="loan-form">
//         {/* Name */}
//         <div className="form-group">
//           <label>Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter your name"
//             required
//           />
//         </div>

//         {/* Gender */}
//         <div className="form-group">
//           <label>Gender</label>
//           <select name="gender" value={formData.gender} onChange={handleChange} required>
//             <option value="">Select</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>
//         </div>

//         {/* Married */}
//         <div className="form-group">
//           <label>Married</label>
//           <select name="married" value={formData.married} onChange={handleChange} required>
//             <option value="">Select</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>

//         {/* Dependents */}
//         <div className="form-group">
//           <label>Dependents</label>
//           <select name="dependents" value={formData.dependents} onChange={handleChange} required>
//             <option value="">Select</option>
//             <option value="0">0</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3+">3+</option>
//           </select>
//         </div>

//         {/* Education */}
//         <div className="form-group">
//           <label>Education</label>
//           <select name="education" value={formData.education} onChange={handleChange} required>
//             <option value="">Select</option>
//             <option value="Graduate">Graduate</option>
//             <option value="Not Graduate">Not Graduate</option>
//           </select>
//         </div>

//         {/* Self Employed */}
//         <div className="form-group">
//           <label>Self Employed</label>
//           <select
//             name="self_employed"
//             value={formData.self_employed}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>

//         {/* Numeric fields */}
//         {[
//           { key: "applicant_income", label: "Applicant Income" },
//           { key: "coapplicant_income", label: "Coapplicant Income" },
//           { key: "loan_amount", label: "Loan Amount" },
//           { key: "loan_term", label: "Loan Term (months)" },
//         ].map((field) => (
//           <div className="form-group" key={field.key}>
//             <label>{field.label}</label>
//             <input
//               type="number"
//               name={field.key}
//               value={formData[field.key]}
//               onChange={handleChange}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               required
//             />
//           </div>
//         ))}

//         {/* Credit History */}
//         <div className="form-group">
//           <label>Credit History</label>
//           <select
//             name="credit_history"
//             value={formData.credit_history}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select</option>
//             <option value="1">1</option>
//             <option value="0">0</option>
//           </select>
//         </div>

//         {/* Property Area */}
//         <div className="form-group">
//           <label>Property Area</label>
//           <select
//             name="property_area"
//             value={formData.property_area}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select</option>
//             <option value="Urban">Urban</option>
//             <option value="Semiurban">Semiurban</option>
//             <option value="Rural">Rural</option>
//           </select>
//         </div>

//         <button type="submit" className="submit-btn">Check Eligibility</button>
//       </form>

//       {result && (
//         <div className="result-card">
//           <h3>Prediction Result</h3>
//           <p><strong>Status:</strong> {result.status}</p>
//           <p><strong>Confidence:</strong> {result.confidence}%</p>
//           <p><strong>Advice:</strong> {result.advice}</p>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { predictLoan } from "../api/api";
import "./LoanForm.css"; // optional external CSS file

export default function LoanForm() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    married: "",
    dependents: "",
    education: "",
    self_employed: "",
    applicant_income: "",
    coapplicant_income: "",
    loan_amount: "",
    loan_term: "",
    credit_history: "",
    property_area: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // CHANGE 1: Convert numeric strings to actual numbers
    // This is critical for your backend logic to work!
    const dataToSend = {
      ...formData,
      applicant_income: parseFloat(formData.applicant_income),
      coapplicant_income: parseFloat(formData.coapplicant_income),
      loan_amount: parseFloat(formData.loan_amount),
      loan_term: parseInt(formData.loan_term, 10),
      credit_history: parseInt(formData.credit_history, 10),
    };

    try {
      // Send the *converted* data
      const res = await predictLoan(dataToSend);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error predicting loan eligibility");
    }
  };

  return (
    <div className="loan-form-container">
      <h2 className="title">Loan Eligibility Form</h2>

      <form onSubmit={handleSubmit} className="loan-form">
        {/* --- All your form fields remain the same --- */}
        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Married */}
        <div className="form-group">
          <label>Married</label>
          <select name="married" value={formData.married} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Dependents */}
        <div className="form-group">
          <label>Dependents</label>
          <select name="dependents" value={formData.dependents} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3+">3+</option>
          </select>
        </div>

        {/* Education */}
        <div className="form-group">
          <label>Education</label>
          <select name="education" value={formData.education} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Graduate">Graduate</option>
            <option value="Not Graduate">Not Graduate</option>
          </select>
        </div>

        {/* Self Employed */}
        <div className="form-group">
          <label>Self Employed</label>
          <select
            name="self_employed"
            value={formData.self_employed}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Numeric fields */}
        {[
          { key: "applicant_income", label: "Applicant Income" },
          { key: "coapplicant_income", label: "Coapplicant Income" },
          { key: "loan_amount", label: "Loan Amount" },
          { key: "loan_term", label: "Loan Term (months)" },
        ].map((field) => (
          <div className="form-group" key={field.key}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required
            />
          </div>
        ))}

        {/* Credit History */}
        <div className="form-group">
          <label>Credit History</label>
          <select
            name="credit_history"
            value={formData.credit_history}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="1">1 (All debts paid)</option>
            <option value="0">0 (Debts not paid)</option>
          </select>
        </div>

        {/* Property Area */}
        <div className="form-group">
          <label>Property Area</label>
          <select
            name="property_area"
            value={formData.property_area}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Urban">Urban</option>
            <option value="Semiurban">Semiurban</option>
            <option value="Rural">Rural</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Check Eligibility</button>
      </form>

      {/* CHANGE 2: Display the correct fields from your API response */}
      {result && (
        <div className="result-card">
          <h3>Prediction Result</h3>
          <p><strong>Status:</strong> {result.eligibility}</p>
          <p><strong>Reason:</strong> {result.reason}</p>
        </div>
      )}
    </div>
  );
}