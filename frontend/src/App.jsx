import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoanForm from "./pages/LoanForm";
import RecordsList from "./pages/RecordsList";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoanForm />} />
        <Route path="/records" element={<RecordsList />} />
      </Routes>
    </BrowserRouter>
  );
}
