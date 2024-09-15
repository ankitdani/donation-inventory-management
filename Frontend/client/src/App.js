import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [donorName, setDonorName] = useState("");
  const [amountDonated, setAmountDonated] = useState("");
  const [dateOfDonation, setDateOfDonation] = useState(new Date().toISOString().slice(0, 10));
  const [donationType, setDonationType] = useState("");
  const [donations, setDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null); // State to track the donation being edited

  // Fetch all donations when the component mounts
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/donations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setDonations(data); // Set the donations in state
      } catch (err) {
        console.error("Error fetching donations", err);
      }
    };

    fetchDonations();
  }, []);

  // Handle form submission for adding/updating a donation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingDonation) {
        // Edit the donation if in editing mode
        response = await fetch(`http://localhost:8080/api/donations/${editingDonation.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: donorName,
            amountDonated: parseFloat(amountDonated),
            dateOfDonation,
            donationType,
          }),
        });
      } else {
        // Add a new donation
        response = await fetch("http://localhost:8080/api/donations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: donorName,
            amountDonated: parseFloat(amountDonated),
            dateOfDonation,
            donationType,
          }),
        });
      }

      const data = await response.json();
      if (editingDonation) {
        // Update the donation in the list
        setDonations(
          donations.map((donation) =>
            donation.id === data.id ? data : donation
          )
        );
        setEditingDonation(null); // Exit editing mode
      } else {
        setDonations([...donations, data]); // Add new donation to the list
      }

      // Reset form fields
      setDonorName("");
      setAmountDonated("");
      setDonationType("");
    } catch (err) {
      console.error("Error submitting data", err);
    }
  };

  // Delete a donation
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/donations/${id}`, {
        method: "DELETE",
      });
      setDonations(donations.filter((donation) => donation.id !== id)); // Remove the deleted donation from the list
    } catch (err) {
      console.error("Error deleting donation", err);
    }
  };

  // Handle editing a donation
  const handleEdit = (donation) => {
    setEditingDonation(donation); // Set the donation being edited
    setDonorName(donation.name); // Populate form with the donation data
    setAmountDonated(donation.amountDonated);
    setDateOfDonation(donation.dateOfDonation);
    setDonationType(donation.donationType);
  };

  return (
    <div>
      <h1>Donation Form</h1>

      {/* Form for adding/editing donation */}
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
        <select
          value={donationType}
          onChange={(e) => setDonationType(e.target.value)}
        >
          <option value="">Select Donation Type</option>
          <option value="Money">Money</option>
          <option value="Food">Food</option>
          <option value="Clothing">Clothing</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">
          {editingDonation ? "Update Donation" : "Submit"}
        </button>
      </form>

      {/* Display list of donations */}
      <h2>List of Recorded Donations</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Donation Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.name}</td>
              <td>{donation.amountDonated}</td>
              <td>{new Date(donation.dateOfDonation).toLocaleDateString()}</td>
              <td>{donation.donationType}</td>
              <td>
                <button onClick={() => handleEdit(donation)}>Edit</button>
                <button onClick={() => handleDelete(donation.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
