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

  const sortedHistory = [...player.history].sort(
    (a, b) => a.matchNumber - b.matchNumber,
  );
  console.log(player.history);
  return (
    <div className="max-w-5xl mx-auto mt-12 relative px-4">
      <div className="bg-black/70 backdrop-blur-3xl rounded-3xl border border-white/5 p-6 sm:p-10 shadow-2xl text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter italic text-white">
              {player.name}
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase opacity-80">
              Season {season}
            </p>
          </div>

          <div className="mt-3 sm:mt-0 text-xs bg-cyan-500/10 text-cyan-300 px-4 py-2 rounded-xl font-bold">
            Player Stats
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-xs text-zinc-300 uppercase tracking-wider">
              Matches Played
            </div>
            <div className="font-black text-lg text-white mt-2">
              {player.matchesPlayed}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-xs text-zinc-300 uppercase tracking-wider">
              Wins
            </div>
            <div className="font-black text-lg text-white mt-2">
              {player.wins}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-xs text-zinc-300 uppercase tracking-wider">
              Total Points
            </div>
            <div className="font-black text-xl text-cyan-300 mt-2">
              {player.totalPoints}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-xs text-zinc-300 uppercase tracking-wider">
              Avg Points
            </div>
            <div className="font-black text-lg text-white mt-2">
              {player.avgPoints}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-xs text-zinc-300 uppercase tracking-wider">
              Best Score
            </div>
            <div className="font-black text-lg text-white mt-2">
              {player.bestScore}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-xs text-zinc-300 uppercase tracking-wider">
              Worst Score
            </div>
            <div className="font-black text-lg text-white mt-2">
              {player.worstScore}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">
            Performance Graph
          </h3>
          <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-xl">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sortedHistory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />

                <XAxis
                  dataKey="matchNumber"
                  stroke="#a1a1aa"
                  tick={{ fill: "#d4d4d8" }}
                />

                <YAxis stroke="#a1a1aa" tick={{ fill: "#d4d4d8" }} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(9,9,11,0.95)",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match History */}
        <div className="w-full overflow-x-auto mt-8">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-cyan-300 uppercase tracking-[0.2em] text-[9px] font-black opacity-70">
                <th className="text-left pb-2 px-6">Match</th>
                <th className="text-left pb-2 px-6">Points</th>
                <th className="text-left pb-2 px-6">Rank</th>
              </tr>
            </thead>

            <tbody className="mt-2">
              {player.history.map((h, index) => (
                <tr
                  key={h.matchNumber}
                  className="group transition-all duration-300"
                >
                  <td className="py-3.5 px-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                    Match {h.matchNumber}
                  </td>

                  <td className="py-3.5 px-6 bg-white/2 group-hover:bg-white/5 transition-colors text-zinc-200">
                    {h.points}
                  </td>

                  <td
                    className={`py-3.5 px-6 text-sm font-black rounded-r-xl bg-white/2 group-hover:bg-white/5 transition-colors ${h.rank === 1 ? "text-cyan-300" : "text-zinc-400"}`}
                  >
                    {h.rank === 1 ? "🏆 1" : h.rank}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
