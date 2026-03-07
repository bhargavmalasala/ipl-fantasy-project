import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const players = ["Bhargav", "Kartheek", "Rishiraj", "Sandeep", "Abhiram"];

function AdminDashboard() {
  const navigate = useNavigate();
  // const [season, setSeason] = useState("");
  const [matchNumber, setMatchNumber] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([
    { name: "", points: "", rank: "" }
  ]);

  const addPlayer = () => {
    setEntries([...entries, { name: "", points: "", rank: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const handleSubmit = async () => {
  if (!date) {
    alert("Select match date");
    return;
  }

  const season = date.split("-")[0]; // Extract year from date

  try {
    await api.post(`/seasons/${season}/matches`, {
      matchNumber: Number(matchNumber),
      date,
      entries: entries.map(e => ({
        name: e.name,
        points: Number(e.points),
        rank: Number(e.rank)
      }))
    });

    alert("Match added successfully!");
  } catch (error) {
    alert("Error creating match");
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
}

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Logout</button>
      <h2>Create Match</h2>


      <input className="border p-3 rounded-lg w-full"
        placeholder="Match Number"
        onChange={(e) => setMatchNumber(e.target.value)}
      />

      <input className="border p-3 rounded-lg w-full"
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <h3>Players</h3>

      {entries.map((entry, index) => (
        <div key={index}>
          <select
  className="border p-2 rounded"
  onChange={(e) => handleChange(index, "name", e.target.value)}
>
  <option value="">Select Player</option>

  {players.map((p) => (
    <option key={p} value={p}>
      {p}
    </option>
  ))}

</select>
          <input className="border p-3 rounded-lg w-full"
            placeholder="Points"
            type="number"
            onChange={(e) => handleChange(index, "points", e.target.value)}
          />
          <input className="border p-3 rounded-lg w-full"
            placeholder="Rank"
            type="number"
            onChange={(e) => handleChange(index, "rank", e.target.value)}
          />
        </div>
      ))}


      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" onClick={addPlayer}>Add Player</button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-4" onClick={handleSubmit}>Submit Match</button>
    </div>
  );
}

export default AdminDashboard;