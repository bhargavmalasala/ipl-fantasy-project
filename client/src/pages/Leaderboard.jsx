import { useEffect, useState } from "react";
import api from "../api/axios";

function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/seasons/2026/leaderboard").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Leaderboard 2026</h2>
      {data.map((player, index) => (
        <div key={index}>
          {player.name} | Wins: {player.wins} | Points: {player.totalPoints}
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;