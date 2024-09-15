import logo from './logo.svg';
import './App.css';
import {useState} from 'react'

function App() {
  
  const [donorName, setDonorName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch("http://localhost:8080/api/donations", 
        {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: donorName }),
    });
      const data = await response.json();
      console.log(data)
    }
    catch(err){
      console.error("Error submitting data ", err)
    }

  }

  return (
    <div>
      <h1>Donations</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder='FirstName LastName'
          onChange={(e)=> setDonorName(e.target.value)} 
        />
        <button type="Submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
