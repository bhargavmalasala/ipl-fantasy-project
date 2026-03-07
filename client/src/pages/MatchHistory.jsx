import { useEffect, useState } from "react";
import api from "../api/axios";

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
      <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Match History</h2>

        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Match History
        </h2>

        {/* Season Dropdown */}
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="border p-2 rounded-lg"
        >
          {seasons.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

      </div>

      {/* Matches */}
      {matches.map((match) => (
        <div
          key={match.id}
          className="border rounded-xl p-5 mb-6"
        >

          {/* Match Header */}
          <div className="flex justify-between mb-4">

            <h3 className="font-semibold text-lg">
              Match {match.matchNumber}
            </h3>

            <span className="text-gray-500">
              {match.date}
            </span>

          </div>

          {/* Match Table */}
          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-gray-600">
                <th className="text-left py-2">Rank</th>
                <th className="text-left py-2">Player</th>
                <th className="text-left py-2">Points</th>
              </tr>
            </thead>

            <tbody>

              {match.entries
                .sort((a, b) => a.rank - b.rank)
                .map((entry) => (

                  <tr
                    key={entry.name}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2 font-semibold">
                      {entry.rank}
                    </td>

                    <td className="py-2">
                      {entry.name}
                    </td>

                    <td className="py-2">
                      {entry.points}
                    </td>

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