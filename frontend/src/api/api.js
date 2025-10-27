// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000";

// export const predictLoan = async (data) => {
//   return await axios.post(`${API_BASE}/predict`, data);
// };

// export const getRecords = async () => {
//   return await axios.get(`${API_BASE}/records`);
// };

import axios from "axios";

const API_URL = "http://localhost:5000";

/**
 * Sends the loan application data to the backend.
 */
export const predictLoan = (formData) => {
  return axios.post(`${API_URL}/check-loan`, formData);
};

// ADD THIS NEW EXPORT
/**
 * Fetches all records from the new /records endpoint
 */
export const getRecords = () => {
  return axios.get(`${API_URL}/records`);
};