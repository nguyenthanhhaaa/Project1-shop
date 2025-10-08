import { Link } from "react-router-dom";

export default function Checkout() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-medium">Checkout (Stepper)</h2>
      <p>Step components sẽ được implement sau.</p>
      <Link to="/confirm" className="mt-4 inline-block text-blue-600">Go to Confirm (demo)</Link>
    </div>
  );
}
