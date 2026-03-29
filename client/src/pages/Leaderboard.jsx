import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const CACHE_TTL_MS = 5 * 60 * 1000;
const SEASONS_CACHE_KEY = "seasons-cache-v1";
const LEADERBOARD_CACHE_PREFIX = "leaderboard-cache-v1:";

const readCache = (key) => {
  try {
    const rawValue = sessionStorage.getItem(key);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;

    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch {
    // Ignore cache write errors and continue with network data.
  }
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

        if (!season && res.data.length > 0) {
          setSeason(res.data[0]);
        }
      })
      .catch(() => {
        if (!cachedSeasons?.length) {
          setLoading(false);
        }
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
      <div className="min-h-[70vh] flex items-center justify-center text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-[#0f172a] p-4 sm:p-8 rounded-2xl shadow-2xl border border-white/10 text-white">
      {/* HERO */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">
          Stumpr Leaderboard
        </h1>

        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Season {season} • Updated {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* TABLE - Responsive Wrapper */}
      <div className="w-full overflow-x-auto rounded-xl">
        <table className="w-full text-xs sm:text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Rank</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Player</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Wins</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Points</th>
            </tr>
          </thead>

          <tbody>
            {data.map((player, index) => (
              <tr
                key={player.name}
                className="border-b hover:bg-orange-50/10 transition"
              >
                {/* Rank */}
                <td className="py-2 sm:py-3 px-2 sm:px-4 font-semibold">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && index + 1}
                </td>

                {/* Player */}
                <td
                  className={`py-2 sm:py-3 px-2 sm:px-4 ${
                    index === 0 ? "text-yellow-400 font-bold" : ""
                  }`}
                >
                  <Link
                    to={`/player/${player.name}?season=${season}`}
                    className="hover:underline"
                  >
                    {player.name}
                  </Link>
                </td>

                {/* Wins */}
                <td
                  className={`py-2 sm:py-3 px-2 sm:px-4 ${index === 0 ? " font-bold" : ""}`}
                >
                  {player.wins}
                </td>

                {/* Points */}
                <td
                  className={`py-2 sm:py-3 px-2 sm:px-4 ${
                    index === 0 ? "text-orange-400 font-bold" : ""
                  }`}
                >
                  {player.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
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
    </div>
  );
}

export default Leaderboard;
