import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ComparePlayers() {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [data, setData] = useState([]);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const season = new Date().getFullYear();

  useEffect(() => {
    // fetch players from leaderboard
    api.get(`/seasons/${season}/leaderboard`).then((res) => {
      const names = res.data.map((p) => p.name);
      setPlayers(names);
    });
  }, []);

  const fetchComparison = async () => {
    if (!player1 || !player2) return;

    setLoadingCompare(true);

    const res = await api.get(
      `/seasons/${season}/compare/${player1}/${player2}`,
    );

    setData(res.data);

    console.log(res.data);
    setLoadingCompare(false);
  };

  let p1Wins = 0;
  let p2Wins = 0;
  let draws = 0;

  let p1Total = 0;
  let p2Total = 0;

  let p1Highest = 0;
  let p2Highest = 0;

  let p1Lowest = Infinity;
  let p2Lowest = Infinity;

  let p1BestRank = Infinity;
  let p2BestRank = Infinity;

  let p1WorstRank = 0;
  let p2WorstRank = 0;

  data.forEach((match) => {
    const p1 = match[player1] || 0;
    const p2 = match[player2] || 0;

    const r1 = match[`${player1}_rank`] || 0;
    const r2 = match[`${player2}_rank`] || 0;

    p1Total += p1;
    p2Total += p2;

    if (p1 > p2) p1Wins++;
    else if (p2 > p1) p2Wins++;
    else draws++;

    p1Highest = Math.max(p1Highest, p1);
    p2Highest = Math.max(p2Highest, p2);

    if (p1 > 0) p1Lowest = Math.min(p1Lowest, p1);
    if (p2 > 0) p2Lowest = Math.min(p2Lowest, p2);

    if (r1 > 0) {
      p1BestRank = Math.min(p1BestRank, r1);
      p1WorstRank = Math.max(p1WorstRank, r1);
    }

    if (r2 > 0) {
      p2BestRank = Math.min(p2BestRank, r2);
      p2WorstRank = Math.max(p2WorstRank, r2);
    }
  });

  const totalMatches = data.length;
  const p1Matches = totalMatches;
  const p2Matches = totalMatches;
  const p1Avg = totalMatches ? Math.round(p1Total / totalMatches) : 0;
  const p2Avg = totalMatches ? Math.round(p2Total / totalMatches) : 0;

  if (p1Lowest === Infinity) p1Lowest = 0;
  if (p2Lowest === Infinity) p2Lowest = 0;

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <div className="bg-black/70 backdrop-blur-3xl rounded-3xl border border-white/5 p-5 sm:p-8 shadow-2xl text-white">
        <div className="flex flex-col gap-2 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter italic text-white">
            Compare Players
          </h2>
          <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold">
            Season {season}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center mb-6 sm:mb-10">
          <select
            className="appearance-none bg-zinc-900/50 hover:bg-zinc-800/60 border border-white/10 p-3 rounded-xl w-full sm:w-auto text-sm text-white outline-none transition-all cursor-pointer backdrop-blur-xl"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          >
            <option value="" className="bg-zinc-950 text-white font-sans">
              Select Player 1
            </option>
            {players.map((p) => (
              <option
                key={p}
                value={p}
                className="bg-zinc-950 text-white font-sans"
              >
                {p}
              </option>
            ))}
          </select>

          <div className="text-center text-2xl sm:text-3xl font-black text-cyan-300 tracking-[0.35em]">
            VS
          </div>

          <select
            className="appearance-none bg-zinc-900/50 hover:bg-zinc-800/60 border border-white/10 p-3 rounded-xl w-full sm:w-auto text-sm text-white outline-none transition-all cursor-pointer backdrop-blur-xl"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          >
            <option value="" className="bg-zinc-950 text-white font-sans">
              Select Player 2
            </option>
            {players.map((p) => (
              <option
                key={p}
                value={p}
                className="bg-zinc-950 text-white font-sans"
              >
                {p}
              </option>
            ))}
          </select>

          <button
            onClick={fetchComparison}
            className="bg-cyan-500/90 cursor-pointer hover:bg-cyan-400 text-black font-bold px-5 py-3 rounded-xl w-full sm:w-auto transition-colors shadow-[0_0_30px_rgba(34,211,238,0.15)]"
          >
            Compare
          </button>
        </div>

        <div className="flex gap-3 sm:gap-6 mb-4 text-[11px] sm:text-sm flex-wrap uppercase tracking-wider font-bold">
          <span className="text-cyan-300">● {player1 || "Player 1"}</span>

          <span className="text-zinc-400">● {player2 || "Player 2"}</span>
        </div>

        {loadingCompare && (
          <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 text-white">
            <div className="flex items-center gap-3 sm:gap-6 text-lg sm:text-2xl font-bold">
              <span className="animate-pulse text-cyan-300">
                {player1 || "Player 1"}
              </span>

              <span className="text-cyan-300 text-2xl sm:text-4xl animate-bounce">
                ⚔️
              </span>

              <span className="animate-pulse text-zinc-200">
                {player2 || "Player 2"}
              </span>
            </div>

            <p className="mt-4 sm:mt-6 text-xs sm:text-base text-zinc-400 animate-pulse">
              Comparing performances...
            </p>

            <div className="w-48 sm:w-64 h-2 bg-white/10 rounded-full mt-3 sm:mt-4 overflow-hidden">
              <div className="h-full bg-cyan-400 animate-[loading_1.2s_infinite]" />
            </div>
          </div>
        )}

        {!loadingCompare && data.length > 0 && (
          <div className="grid grid-cols-3 items-center mb-6 sm:mb-8 text-white">
            <div className="text-left text-sm sm:text-xl font-bold text-cyan-300 truncate">
              {player1}
            </div>

            <div className="text-center text-2xl sm:text-3xl text-cyan-300">
              ⚔️
            </div>

            <div className="text-right text-sm sm:text-xl font-bold text-zinc-200 truncate">
              {player2}
            </div>
          </div>
        )}

        {data.length > 0 && (
          <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-10 text-white">
            {[
              { label: "Matches", p1: p1Matches, p2: p2Matches },
              { label: "Wins", p1: p1Wins, p2: p2Wins },
              { label: "Average", p1: p1Avg, p2: p2Avg },
              { label: "Highest", p1: p1Highest, p2: p2Highest },
              { label: "Lowest", p1: p1Lowest, p2: p2Lowest },
              {
                label: "Best Rank",
                p1: p1BestRank,
                p2: p2BestRank,
                reverse: true,
              },
              {
                label: "Worst Rank",
                p1: p1WorstRank,
                p2: p2WorstRank,
                reverse: true,
              },
            ].map((stat, i) => {
              const better1 = stat.reverse
                ? stat.p1 < stat.p2
                : stat.p1 > stat.p2;

              const better2 = stat.reverse
                ? stat.p2 < stat.p1
                : stat.p2 > stat.p1;

              return (
                <div
                  key={i}
                  className="grid grid-cols-3 items-center bg-white/5 border border-white/5 p-3 sm:p-4 rounded-2xl backdrop-blur-xl"
                >
                  <div
                    className={`text-left text-xs sm:text-lg ${
                      better1 ? "text-cyan-300 font-bold" : "text-zinc-300"
                    }`}
                  >
                    {stat.p1}
                  </div>

                  <div className="text-center text-[10px] sm:text-sm text-zinc-400 uppercase tracking-wider font-bold">
                    {stat.label}
                  </div>

                  <div
                    className={`text-right text-xs sm:text-lg ${
                      better2 ? "text-cyan-300 font-bold" : "text-zinc-300"
                    }`}
                  >
                    {stat.p2}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data.length > 0 && (
          <div className="rounded-3xl border border-white/5 bg-white/5 p-3 sm:p-5 backdrop-blur-xl">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="matchNumber"
                  stroke="#a1a1aa"
                  tick={{ fill: "#d4d4d8" }}
                />

                <YAxis stroke="#a1a1aa" tick={{ fill: "#d4d4d8" }} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#67e8f9", fontWeight: 700 }}
                  itemStyle={{ color: "#f4f4f5" }}
                />

                <Line
                  type="monotone"
                  dataKey={player1}
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey={player2}
                  stroke="#e4e4e7"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePlayers;
