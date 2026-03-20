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
    <div className="leaderboard-page">
      {/* HERO */}
      <div className="leaderboard-hero">
        <h1>IPL FANTASY LEADERBOARD {season}</h1>
        <p>Updated as of {new Date().toLocaleDateString()}</p>
      </div>

      {/* TABLE */}
      <div className="leaderboard-card">
        

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              <th>Wins</th>
              <th>Total Points</th>
            </tr>
          </thead>

          <tbody>
            {data.map((player, index) => (
              <tr key={player.name}>
                <td className="rank-cell">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && index + 1}
                </td>

                <td>
                  <Link
                    to={`/player/${player.name}?season=${season}`}
                    className="player-link"
                  >
                    {player.name}
                  </Link>
                </td>

                <td>{player.wins}</td>
                <td>{player.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        
        </table>
        
      </div>
            <div className="season-wrapper">
          <div></div> {/* left spacer */}
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="season-select"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

    </div>
  );
}

export default Leaderboard;
