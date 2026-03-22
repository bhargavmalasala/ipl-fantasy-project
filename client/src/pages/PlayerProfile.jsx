import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useSearchParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Loader from "../components/Loader";

function PlayerProfile() {
  const { name } = useParams();

  const [searchParams] = useSearchParams();
  const season = searchParams.get("season") || new Date().getFullYear();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/seasons/${season}/player/${name}`).then((res) => {
      setPlayer(res.data);
      setLoading(false);
    });
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  const sortedHistory = [...player.history].sort((a, b) => a.match - b.match);
  console.log(player.history);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-[#0f172a] p-8 rounded-2xl shadow-2xl border border-white/10 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-orange-400">{player.name}</h2>
          <p className="text-gray-400">Season {season}</p>
        </div>

        {/* Optional Badge */}
        <div className="text-sm bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg">
          Player Stats
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-white/10 p-4 rounded">
          Matches Played
          <div className="font-bold text-lg">{player.matchesPlayed}</div>
        </div>

        <div className="bg-[#1e293b] border border-white/10 p-4 rounded">
          Wins
          <div className="font-bold text-lg">{player.wins}</div>
        </div>

        <div className="bg-[#1e293b] border border-white/10 p-4 rounded">
          Total Points
          <div className="font-bold text-xl text-orange-400">
            {player.totalPoints}
          </div>
        </div>

        <div className="bg-[#1e293b] border border-white/10 p-4 rounded">
          Avg Points
          <div className="font-bold text-lg">{player.avgPoints}</div>
        </div>

        <div className="bg-[#1e293b] border border-white/10 p-4 rounded">
          Best Score
          <div className="font-bold text-lg">{player.bestScore}</div>
        </div>

        <div className="bg-[#1e293b] border border-white/10 p-4 rounded">
          Worst Score
          <div className="font-bold text-lg">{player.worstScore}</div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Performance Graph</h3>
        <div className="mt-10 bg-[#1e293b] p-6 rounded-xl border border-white/10">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sortedHistory}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="matchNumber"
                label={{ value: "Match", position: "insideBottom", offset: -5 }}
              />

              <YAxis
                label={{ value: "Points", angle: -90, position: "insideLeft" }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="points"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Match History */}
      <table className="w-full text-sm mt-10 overflow-hidden rounded-xl">
        <thead>
          <tr className="bg-orange-500 text-white">
            <th className="text-left py-3 px-4">Match</th>
            <th className="text-left py-3 px-4">Points</th>
            <th className="text-left py-3 px-4">Rank</th>
          </tr>
        </thead>

        <tbody>
          {player.history.map((h, index) => (
            <tr
              key={h.match}
              className={`border-b ${
                index % 2 === 0 ? "bg-[#1e293b]" : "bg-[#0f172a]"
              } hover:bg-orange-50/10`}
            >
              <td className="py-3 px-4">Match {h.matchNumber}</td>

              <td className="py-3 px-4">{h.points}</td>

              <td
                className={`py-3 px-4 ${
                  h.rank === 1 ? "text-yellow-400 font-bold" : ""
                }`}
              >
                {h.rank === 1 ? "🏆 1" : h.rank}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerProfile;
