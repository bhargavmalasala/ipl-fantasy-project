import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

function Leaderboard() {
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState({});

  useEffect(() => {
    api.get("/seasons").then((res) => {
      setSeasons(res.data);
      if (res.data.length > 0) {
        setSeason(res.data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!season) return;

    if (cache[season]) {
      setData(cache[season]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get(`/seasons/${season}/leaderboard`).then((res) => {
      setData(res.data);
      setCache((prev) => ({ ...prev, [season]: res.data }));
      setLoading(false);
    });
  }, [season]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-[#0f172a] p-8 rounded-2xl shadow-2xl border border-white/10 text-white">

      {/* HERO */}
     <div className="text-center mb-6">

  <h1 className="text-3xl font-bold text-orange-400">
    IPL Fantasy Leaderboard
  </h1>

  <p className="text-gray-400 text-sm mt-1">
    Season {season} • Updated {new Date().toLocaleDateString()}
  </p>

</div>

      {/* TABLE */}
      <table className="w-full text-sm overflow-hidden rounded-xl">

        {/* Header */}
        <thead>
          <tr className="bg-orange-500 text-white">
            <th className="text-left py-3 px-4">Rank</th>
            <th className="text-left py-3 px-4">Player</th>
            <th className="text-left py-3 px-4">Wins</th>
            <th className="text-left py-3 px-4">Points</th>
          </tr>
        </thead>

        <tbody>
          {data.map((player, index) => (

            <tr
              key={player.name}
              className="border-b hover:bg-orange-50/10 transition"
            >

              {/* Rank */}
              <td className="py-3 px-4 font-semibold">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && index + 1}
              </td>

              {/* Player */}
              <td className={`py-3 px-4 ${
                index === 0 ? "text-yellow-400 font-bold" : ""
              }`}>
                <Link
                  to={`/player/${player.name}?season=${season}`}
                  className="hover:underline"
                >
                  {player.name}
                </Link>
              </td>

              {/* Wins */}
              <td className={`py-3 px-4 ${
                index === 0 ? " font-bold" : ""
              }`}>
                {player.wins}
              </td>

              {/* Points */}
              <td className={`py-3 px-4 ${
                index === 0 ? "text-orange-400 font-bold" : ""
              }`}>
                {player.totalPoints}
              </td>

            </tr>

          ))}
        </tbody>

      </table>

      <div className="flex justify-center mt-8">

  <select
    value={season}
    onChange={(e) => setSeason(e.target.value)}
    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg"
  >
    {seasons.map((s) => (
      <option key={s} value={s} className="text-black">
        {s}
      </option>
    ))}
  </select>

</div>

    </div>
  );
}

export default Leaderboard;