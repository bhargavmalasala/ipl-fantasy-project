import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const CACHE_TTL_MS = 5 * 60 * 1000;
const SEASONS_CACHE_KEY = "seasons-cache-v1";
const LEADERBOARD_CACHE_PREFIX = "leaderboard-cache-v1:";

const readCache = (key) => {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;
    const parsed = JSON.parse(rawValue);
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {}
};

function Leaderboard() {
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedSeasons = readCache(SEASONS_CACHE_KEY);
    if (cachedSeasons?.length) {
      setSeasons(cachedSeasons);
      setSeason(cachedSeasons[0]);
    }

    api
      .get("/seasons")
      .then((res) => {
        setSeasons(res.data);
        writeCache(SEASONS_CACHE_KEY, res.data);
        if (!season && res.data.length > 0) setSeason(res.data[0]);
      })
      .catch(() => {
        if (!cachedSeasons?.length) setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!season) return;
    const cacheKey = `${LEADERBOARD_CACHE_PREFIX}${season}`;
    const cachedLeaderboard = readCache(cacheKey);

    if (cachedLeaderboard) {
      setData(cachedLeaderboard);
      setLoading(false);
    } else {
      setLoading(true);
    }

    api
      .get(`/seasons/${season}/leaderboard`)
      .then((res) => {
        setData(res.data);
        writeCache(cacheKey, res.data);
      })
      .finally(() => setLoading(false));
  }, [season]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 relative px-4">
      {/* 
          MAIN DARK GLASS CONTAINER 
          bg-black/60 creates that deep black shade requested.
          backdrop-blur-3xl provides the heavy background blurring.
      */}
      <div className="bg-black/70 backdrop-blur-3xl rounded-3xl border border-white/5 p-6 sm:p-10 shadow-2xl">
        {/* REFINED HEADER SECTION */}
        <div className="flex flex-row justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">
              LEADERBOARD
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase opacity-80">
              Season {season} • {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* COMPACT SEASON SELECTOR */}
          <div className="relative">
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="appearance-none bg-zinc-900/50 hover:bg-zinc-800/60 border border-white/10 text-white px-6 py-2 rounded-xl transition-all cursor-pointer backdrop-blur-xl outline-none font-bold text-xs tracking-tighter"
            >
              {seasons.map((s) => (
                <option
                  key={s}
                  value={s}
                  className="bg-zinc-950 text-white font-sans"
                >
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TIGHTER TABLE CONTAINER */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-cyan-300 uppercase tracking-[0.2em] text-[9px] font-black opacity-70">
                <th className="text-left pb-2 px-6">Rank</th>
                <th className="text-left pb-2 px-6">Player</th>
                <th className="text-left pb-2 px-6">Wins</th>
                <th className="text-left pb-2 px-6">Points</th>
              </tr>
            </thead>

            <tbody className="mt-2">
              {data.map((player, index) => (
                <tr
                  key={player.name}
                  className="group transition-all duration-300"
                >
                  {/* Rank Cell - Compacted height py-3.5 */}
                  <td className="py-3.5 px-6 text-lg bg-white/2 rounded-l-xl group-hover:bg-white/5 transition-colors">
                    {index === 0 ? (
                      "🥇"
                    ) : index === 1 ? (
                      "🥈"
                    ) : index === 2 ? (
                      "🥉"
                    ) : (
                      <span className="text-zinc-600 ml-1 text-xs font-black">
                        {index + 1}
                      </span>
                    )}
                  </td>

                  {/* Player Cell - text-sm for better scanning */}
                  <td className="py-3.5 px-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                    <Link
                      to={`/player/${player.name}?season=${season}`}
                      className={`text-sm font-bold tracking-tight transition-all hover:text-cyan-300 ${
                        index === 0 ? "text-cyan-300" : "text-zinc-200"
                      }`}
                    >
                      {player.name}
                    </Link>
                  </td>

                  {/* Wins Cell */}
                  <td className="py-3.5 px-6 bg-white/2 group-hover:bg-white/5 transition-colors text-zinc-100 font-bold text-sm">
                    {player.wins}
                  </td>

                  {/* Points Cell */}
                  <td
                    className={`py-3.5 px-6 text-sm font-black rounded-r-xl bg-white/2 group-hover:bg-white/5 transition-colors ${
                      index === 0 ? "text-cyan-300" : "text-zinc-400"
                    }`}
                  >
                    {player.totalPoints.toLocaleString()}
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

export default Leaderboard;
