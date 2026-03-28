import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const players = [
  "Abhiram",
  "Bhargav",
  "Chandu",
  "Kartheek",
  "Living Stone",
  "Rishiraj",
  "Rishith",
  "Sandeep",
  "Yashwant",
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("add");

  const [matchNumber, setMatchNumber] = useState("");
  const [date, setDate] = useState("");
  const [matchName, setMatchName] = useState("");

  const [entries, setEntries] = useState(
    players.map((player) => ({
      name: player,
      points: "",
      rank: "",
    })),
  );

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
      setMatchNumber(res.data.length + 1);
    } catch (error) {
      console.error("Error fetching matches");
    }
  };

  const deleteMatch = async (id) => {
    if (!window.confirm("Delete this match?")) return;

    try {
      await api.delete(`/seasons/${season}/matches/${id}`);

      setMatches(matches.filter((m) => m.id !== id));
    } catch (error) {
      alert("Delete failed");
    }
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

    const filledEntries = entries.filter(
      (e) => e.points !== "" || e.rank !== "",
    );

    if (filledEntries.length === 0) {
      alert("Enter at least one player's points and rank");
      return;
    }

    const hasIncompleteRow = filledEntries.some(
      (e) => e.points === "" || e.rank === "",
    );

    if (hasIncompleteRow) {
      alert("For each entered player, fill both points and rank");
      return;
    }

    const season = date.split("-")[0];

    try {
      const res = await api.post(`/seasons/${season}/matches`, {
        matchNumber: Number(matchNumber),
        matchName,
        date,
        entries: filledEntries.map((e) => ({
          name: e.name,
          points: Number(e.points),
          rank: Number(e.rank),
        })),
      });

      alert(res?.data?.message || "Match saved successfully!");

      setEntries(
        players.map((player) => ({
          name: player,
          points: "",
          rank: "",
        })),
      );
      setMatchNumber("");
      setDate("");
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const status = error?.response?.status;

      alert(
        backendMessage
          ? `Error creating match: ${backendMessage}`
          : `Error creating match${status ? ` (status ${status})` : ""}`,
      );
      console.error("Create match failed:", {
        status,
        data: error?.response?.data,
        message: error?.message,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-[#0f172a] p-4 sm:p-8 rounded-2xl shadow-2xl border border-white/10 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-400">
          Admin Panel
        </h2>

        <button
          onClick={handleLogout}
          className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("add")}
          className={`px-4 py-2 cursor-pointer rounded-lg transition ${
            tab === "add"
              ? "bg-orange-500 text-white"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          Add Match
        </button>

        <button
          onClick={() => setTab("manage")}
          className={`px-4 py-2 cursor-pointer rounded-lg transition ${
            tab === "manage"
              ? "bg-orange-500 text-white"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          Manage Matches
        </button>
      </div>

      {/* ADD MATCH TAB */}

      {tab === "add" && (
        <>
          <input
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white focus:outline-none focus:border-orange-400"
            placeholder="Match Number"
            value={matchNumber}
            onChange={(e) => setMatchNumber(e.target.value)}
          />

          <input
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white focus:outline-none focus:border-orange-400"
            placeholder="Match Name (eg: MI vs CSK)"
            value={matchName}
            onChange={(e) => setMatchName(e.target.value)}
          />

          <input
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white focus:outline-none focus:border-orange-400"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <h3 className="font-semibold mb-3">Players</h3>

          {entries.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-3 mb-3 bg-[#1e293b] p-3 rounded-lg border border-white/10"
            >
              <input
                className="p-2 rounded bg-[#0f172a] text-gray-300 border border-white/10"
                value={entry.name}
                disabled
              />

              <input
                className="p-2 rounded bg-[#0f172a] text-white border border-white/10 focus:outline-none focus:border-orange-400"
                placeholder="Points"
                type="number"
                value={entry.points}
                onChange={(e) => handleChange(index, "points", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Rank"
                type="number"
                value={entry.rank}
                onChange={(e) => handleChange(index, "rank", e.target.value)}
              />
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!matchNumber || !matchName || !date}
              className="w-full sm:w-auto bg-orange-500 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Match
            </button>
          </div>
        </>
      )}

      {/* MANAGE MATCHES TAB */}

      {tab === "manage" && (
        <table className="w-full text-sm overflow-hidden rounded-xl mt-4">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="text-left py-3">Match</th>

              <th className="text-left py-3">Date</th>

              <th className="text-left py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((match) => (
              <tr className="border-b border-white/10 hover:bg-orange-50/10 transition">
                <td className="py-3 px-4 text-white">
                  Match {match.matchNumber}
                </td>

                <td className="py-3 px-4 text-white">{match.date}</td>

                <td className="py-3 px-4 text-white">
                  <button
                    onClick={() => deleteMatch(match.id)}
                    className="text-red-400 hover:text-red-500 transition"
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
