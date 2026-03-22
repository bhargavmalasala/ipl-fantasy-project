import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

function MatchHistory() {
  const currentYear = new Date().getFullYear().toString();

  const [matches, setMatches] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState(currentYear);
  const [loading, setLoading] = useState(true);

  // Fetch available seasons
  useEffect(() => {
    api.get("/seasons").then((res) => {
      setSeasons(res.data);
    });
  }, []);

  // Fetch matches when season changes
  useEffect(() => {
    setLoading(true);

    api.get(`/seasons/${season}/matches`).then((res) => {
      setMatches(res.data);
      setLoading(false);
    });
  }, [season]);

  // Skeleton Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-[#0f172a] p-8 rounded-2xl shadow-2xl border border-white/10 text-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-orange-400">Match History</h2>

        <p className="text-gray-400 text-sm mt-1">Season {season}</p>
      </div>
      <div className="flex justify-center mt-8 mb-8">
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

      {/* Matches */}
      {[...matches].reverse().map((match) => (
        <div
          key={match.id}
          className="border border-white/10 rounded-xl p-5 mb-8 bg-[#1e293b]"
        >
          {/* Match Header */}
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-white text-lg">
              Match {match.matchNumber}
            </h3>

            <h4 className="font-medium text-orange-400">{match.matchName}</h4>

            <span className="text-white">{match.date}</span>
          </div>

          {/* Match Table */}
          <table className="w-full text-sm border-collapse overflow-hidden rounded-xl">
            {/* Orange Header */}
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Player</th>
                <th className="text-left py-3 px-4">Points</th>
              </tr>
            </thead>

            <tbody>
              {match.entries
                .sort((a, b) => a.rank - b.rank)
                .map((entry, index) => (
                  <tr
                    key={entry.name}
                    className="border-b border-white/10 hover:bg-orange-50/10 transition"
                  >
                    <td className="py-3 px-4 font-semibold">{entry.rank}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{entry.name}</span>
                        {index == 0 && (
                          <span className="text-yellow-500 text-lg">👑</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium">{entry.points}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default MatchHistory;
