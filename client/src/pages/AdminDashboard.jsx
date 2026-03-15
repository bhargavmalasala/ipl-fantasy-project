import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const players = ["Bhargav", "Kartheek", "Rishiraj", "Sandeep", "Abhiram"];

function AdminDashboard() {

  const navigate = useNavigate();

  const [tab, setTab] = useState("add");

  const [matchNumber, setMatchNumber] = useState("");
  const [date, setDate] = useState("");

  const [entries, setEntries] = useState([
    { name: "", points: "", rank: "" }
  ]);

  const [matches, setMatches] = useState([]);

  const season = new Date().getFullYear();

  // Fetch matches when Manage tab opens
  useEffect(() => {
    if (tab === "manage") {
      fetchMatches();
    }
  }, [tab]);

  const fetchMatches = async () => {
    try {

      const res = await api.get(`/seasons/${season}/matches`);

      setMatches(res.data);

    } catch (error) {
      console.error("Error fetching matches");
    }
  };

  const deleteMatch = async (id) => {

    if (!window.confirm("Delete this match?")) return;

    try {

      await api.delete(`/seasons/${season}/matches/${id}`);

      setMatches(matches.filter(m => m.id !== id));

    } catch (error) {

      alert("Delete failed");

    }

  };

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

    const season = date.split("-")[0];

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

      setEntries([{ name: "", points: "", rank: "" }]);
      setMatchNumber("");
      setDate("");

    } catch (error) {

      alert("Error creating match");

    }

  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (

    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">

      <div className="flex justify-between mb-6">

        <h2 className="text-2xl font-bold">
          Admin Panel
        </h2>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>

      {/* Tabs */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setTab("add")}
          className={`px-4 py-2 rounded ${
            tab === "add" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Add Match
        </button>

        <button
          onClick={() => setTab("manage")}
          className={`px-4 py-2 rounded ${
            tab === "manage" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Matches
        </button>

      </div>

      {/* ADD MATCH TAB */}

      {tab === "add" && (

        <>

          <input
            className="border p-3 rounded-lg w-full mb-4"
            placeholder="Match Number"
            value={matchNumber}
            onChange={(e) => setMatchNumber(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg w-full mb-4"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <h3 className="font-semibold mb-3">
            Players
          </h3>

          {entries.map((entry, index) => (

            <div key={index} className="grid grid-cols-3 gap-3 mb-3">

              <select
                className="border p-2 rounded"
                value={entry.name}
                onChange={(e) =>
                  handleChange(index, "name", e.target.value)
                }
              >
                <option value="">Select Player</option>

                {players.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}

              </select>

              <input
                className="border p-2 rounded"
                placeholder="Points"
                type="number"
                value={entry.points}
                onChange={(e) =>
                  handleChange(index, "points", e.target.value)
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="Rank"
                type="number"
                value={entry.rank}
                onChange={(e) =>
                  handleChange(index, "rank", e.target.value)
                }
              />

            </div>

          ))}

          <div className="flex gap-3 mt-4">

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={addPlayer}
            >
              Add Player
            </button>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Submit Match
            </button>

          </div>

        </>

      )}

      {/* MANAGE MATCHES TAB */}

      {tab === "manage" && (

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b text-gray-600">

              <th className="text-left py-3">
                Match
              </th>

              <th className="text-left py-3">
                Date
              </th>

              <th className="text-left py-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {matches.map(match => (

              <tr key={match.id} className="border-b">

                <td className="py-3">
                  Match {match.matchNumber}
                </td>

                <td className="py-3">
                  {match.date}
                </td>

                <td className="py-3">

                  <button
                    onClick={() => deleteMatch(match.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default AdminDashboard;