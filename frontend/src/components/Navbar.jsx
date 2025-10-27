import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="font-bold text-lg">Loan Predictor</h1>
      <div>
        <Link className="mr-4" to="/">Form</Link>
        <Link to="/records">Records</Link>
      </div>
    </nav>
  );
}
