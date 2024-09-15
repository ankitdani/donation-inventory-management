import './App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container mt-5">
      <h1 className="mb-4">Donation Management</h1>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="form-group">
          <label htmlFor="donorName">Donor Name</label>
          <input
            type="text"
            id="donorName"
            className="form-control"
            placeholder='FirstName LastName'
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="amountDonated">Amount Donated</label>
          <input
            type="number"
            id="amountDonated"
            className="form-control"
            placeholder='Amount Donated'
            value={amountDonated}
            onChange={(e) => setAmountDonated(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfDonation">Date of Donation</label>
          <input
            type="date"
            id="dateOfDonation"
            className="form-control"
            value={dateOfDonation}
            onChange={(e) => setDateOfDonation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="donationType">Donation Type</label>
          <select
            id="donationType"
            className="form-control"
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
          >
            <option value="">Select Donation Type</option>
            <option value="Money">Money</option>
            <option value="Food">Food</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingDonation ? "Update Donation" : "Submit"}
        </button>
      </form>

      <h2 className="mb-4">List of Recorded Donations</h2>
      <table className="table table-striped">
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
                <button onClick={() => handleEdit(donation)} className="btn btn-warning btn-sm mr-2">Edit</button>
                <button onClick={() => handleDelete(donation.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
