import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function ComparePlayers() {

  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [data, setData] = useState([]);

  const season = new Date().getFullYear();

  useEffect(() => {

    // fetch players from leaderboard
    api.get(`/seasons/${season}/leaderboard`)
      .then(res => {

        const names = res.data.map(p => p.name);
        setPlayers(names);

      });

  }, []);

  const fetchComparison = async () => {

    if (!player1 || !player2) return;

    const res = await api.get(
      `/seasons/${season}/compare/${player1}/${player2}`
    );

    setData(res.data);

    console.log(res.data);
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

data.forEach(match => {

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

const matchesPlayed = data.length;

const p1Avg = matchesPlayed ? Math.round(p1Total / matchesPlayed) : 0;
const p2Avg = matchesPlayed ? Math.round(p2Total / matchesPlayed) : 0;

if (p1Lowest === Infinity) p1Lowest = 0;
if (p2Lowest === Infinity) p2Lowest = 0;

  

  return (

    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Compare Players
      </h2>

      <div className="flex gap-4 mb-6">

        <select
          className="border p-2 rounded"
          value={player1}
          onChange={(e)=>setPlayer1(e.target.value)}
        >
          <option value="">Select Player 1</option>

          {players.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}

        </select>


        <select
          className="border p-2 rounded"
          value={player2}
          onChange={(e)=>setPlayer2(e.target.value)}
        >
          <option value="">Select Player 2</option>

          {players.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}

        </select>


        <button
          onClick={fetchComparison}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Compare
        </button>

      </div>

      <div className="flex gap-6 mb-3 text-sm">

  <span className="text-blue-600">
    ● {player1}
  </span>

  <span className="text-orange-500">
    ● {player2}
  </span>

</div>

{data.length > 0 && (

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

  <div className="bg-gray-100 p-4 rounded">
    Matches Played
    <div className="font-bold text-lg">{matchesPlayed}</div>
  </div>

  <div className="bg-blue-100 p-4 rounded">
    {player1} Wins
    <div className="font-bold text-lg">{p1Wins}</div>
  </div>

  <div className="bg-orange-100 p-4 rounded">
    {player2} Wins
    <div className="font-bold text-lg">{p2Wins}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    Draws
    <div className="font-bold text-lg">{draws}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player1} Highest
    <div className="font-bold text-lg">{p1Highest}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player2} Highest
    <div className="font-bold text-lg">{p2Highest}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player1} Lowest
    <div className="font-bold text-lg">{p1Lowest}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player2} Lowest
    <div className="font-bold text-lg">{p2Lowest}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player1} Best Rank
    <div className="font-bold text-lg">{p1BestRank}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player2} Best Rank
    <div className="font-bold text-lg">{p2BestRank}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player1} Worst Rank
    <div className="font-bold text-lg">{p1WorstRank}</div>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    {player2} Worst Rank
    <div className="font-bold text-lg">{p2WorstRank}</div>
  </div>

</div>

)}

      {data.length > 0 && (

        <ResponsiveContainer width="100%" height={320}>

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