import { useEffect, useState } from "react";
import api from "../api/axios";

function Leaderboard() {
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seasons
  useEffect(() => {
    api.get("/seasons").then(res => {
      setSeasons(res.data);
      if (res.data.length > 0) {
        setSeason(res.data[0]); // default to latest season
      }
    });
  }, []);

  // Fetch leaderboard when season changes
  useEffect(() => {
    if (!season) return;

    setLoading(true);
    api.get(`/seasons/${season}/leaderboard`).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [season]);

  if (loading){
    return (
      <div className="flex justify-center items-center mt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h2>Leaderboard</h2>

      <select value={season} onChange={(e) => setSeason(e.target.value)}>
        {seasons.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <table className="w-full mt-6 text-sm">
  <thead>
    <tr className="border-b text-gray-600">
      <th className="text-left py-3">Rank</th>
      <th className="text-left py-3">Name</th>
      <th className="text-left py-3">Wins</th>
      <th className="text-left py-3">Total Points</th>
    </tr>
  </thead>
  <tbody>
    {data.map((player, index) => (
      <tr
        key={player.name}
        className="border-b hover:bg-gray-50 transition"
      >
        <td className="py-3 font-semibold">{index + 1}</td>
        <td className="py-3">{player.name}</td>
        <td className="py-3">{player.wins}</td>
        <td className="py-3">{player.totalPoints}</td>
      </tr>
    ))}
  </tbody>
</table>
    
    </div>
  );
}

export default Leaderboard;