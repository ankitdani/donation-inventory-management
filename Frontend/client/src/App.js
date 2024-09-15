import './App.css';
import { useState } from 'react';

function App() {
  const [donorName, setDonorName] = useState("");
  const [amountDonated, setAmountDonated] = useState(""); // Ensure this matches the backend field
  const [dateOfDonation, setDateOfDonation] = useState(new Date().toISOString().slice(0, 10)); // Set default to today's date

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: donorName, 
          amountDonated: parseFloat(amountDonated), // Ensure this matches the backend field
          dateOfDonation
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error("Error submitting data", err);
    }
  };

  return (
    <div>
      <h1>Donations</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='FirstName LastName'
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
        />
        <input
          type="number"
          placeholder='Amount Donated'
          value={amountDonated}
          onChange={(e) => setAmountDonated(e.target.value)}
        />
        <input
          type="date"
          value={dateOfDonation}
          onChange={(e) => setDateOfDonation(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
