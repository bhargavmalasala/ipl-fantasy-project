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
  const p1Avg = totalMatches ? Math.round(p1Total / totalMatches) : 0;
  const p2Avg = totalMatches ? Math.round(p2Total / totalMatches) : 0;

  if (p1Lowest === Infinity) p1Lowest = 0;
  if (p2Lowest === Infinity) p2Lowest = 0;

  return (
    <div className="max-w-5xl mx-auto mt-8 sm:mt-10 bg-[#161f35] p-4 sm:p-8 rounded-2xl shadow-2xl border border-white/10">
      <h2 className="text-xl sm:text-2xl text-white font-bold mb-4 sm:mb-6">
        Compare Players
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center mb-6 sm:mb-10 text-white">
        <select
          className="bg-white/10 border border-white/20 p-2 rounded-lg w-full sm:w-auto text-sm"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        >
          <option value="">Select Player 1</option>
          {players.map((p) => (
            <option key={p} value={p} className="text-black">
              {p}
            </option>
          ))}
        </select>

        <div className="text-2xl sm:text-3xl font-bold text-orange-500">VS</div>

        <select
          className="bg-white/10 border border-white/20 p-2 rounded-lg w-full sm:w-auto text-sm"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        >
          <option value="">Select Player 2</option>
          {players.map((p) => (
            <option key={p} value={p} className="text-black">
              {p}
            </option>
          ))}
        </select>

        <button
          onClick={fetchComparison}
          className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Compare
        </button>
      </div>

      <div className="flex gap-3 sm:gap-6 mb-3 text-xs sm:text-sm flex-wrap">
        <span className="text-blue-600">● {player1}</span>

        <span className="text-orange-500">● {player2}</span>
      </div>

      {loadingCompare && (
        <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 text-white">
          {/* VS Animation */}
          <div className="flex items-center gap-3 sm:gap-6 text-lg sm:text-2xl font-bold">
            <span className="animate-pulse text-blue-400">
              {player1 || "Player 1"}
            </span>

            <span className="text-orange-500 text-2xl sm:text-4xl animate-bounce">
              ⚔️
            </span>

            <span className="animate-pulse text-orange-400">
              {player2 || "Player 2"}
            </span>
          </div>

          {/* Loading Text */}
          <p className="mt-4 sm:mt-6 text-xs sm:text-base text-gray-400 animate-pulse">
            Comparing performances...
          </p>

          {/* Loader Bar */}
          <div className="w-48 sm:w-64 h-2 bg-gray-700 rounded-full mt-3 sm:mt-4 overflow-hidden">
            <div className="h-full bg-orange-500 animate-[loading_1.2s_infinite]" />
          </div>
        </div>
      )}

      {!loadingCompare && data.length > 0 && (
        <div className="grid grid-cols-3 items-center mb-6 sm:mb-8 text-white">
          <div className="text-left text-sm sm:text-xl font-bold text-blue-400 truncate">
            {player1}
          </div>

          <div className="text-center text-2xl sm:text-3xl text-orange-500">
            ⚔️
          </div>

          <div className="text-right text-sm sm:text-xl font-bold text-orange-400 truncate">
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
                className="grid grid-cols-3 items-center bg-[#1e293b] p-2 sm:p-4 rounded-lg"
              >
                {/* Player 1 */}
                <div
                  className={`text-left text-xs sm:text-lg ${
                    better1 ? "text-green-400 font-bold" : "text-gray-300"
                  }`}
                >
                  {stat.p1}
                </div>

                {/* Label */}
                <div className="text-center text-xs sm:text-sm text-gray-400">
                  {stat.label}
                </div>

                {/* Player 2 */}
                <div
                  className={`text-right text-xs sm:text-lg ${
                    better2 ? "text-green-400 font-bold" : "text-gray-300"
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
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="matchNumber" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey={player1}
              stroke="#2563eb"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey={player2}
              stroke="#f97316"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ComparePlayers;
