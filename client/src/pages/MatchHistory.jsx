import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const CACHE_TTL_MS = 5 * 60 * 1000;
const SEASONS_CACHE_KEY = "seasons-cache-v1";
const MATCHES_CACHE_PREFIX = "matches-cache-v1:";

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
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch {
    // Ignore cache write errors.
  }
};

function MatchHistory() {
  const currentYear = new Date().getFullYear().toString();

  const [matches, setMatches] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState(currentYear);
  const [loading, setLoading] = useState(true);

  // Fetch available seasons
  useEffect(() => {
    const cachedSeasons = readCache(SEASONS_CACHE_KEY);
    if (cachedSeasons?.length) {
      setSeasons(cachedSeasons);
    }

    api
      .get("/seasons")
      .then((res) => {
        setSeasons(res.data);
        writeCache(SEASONS_CACHE_KEY, res.data);
      })
      .catch(() => {
        if (!cachedSeasons?.length) {
          setLoading(false);
        }
      });
  }, []);

  // Fetch matches when season changes
  useEffect(() => {
    if (!season) return;

    const cacheKey = `${MATCHES_CACHE_PREFIX}${season}`;
    const cachedMatches = readCache(cacheKey);

    if (cachedMatches) {
      setMatches(cachedMatches);
      setLoading(false);
    } else {
      setLoading(true);
    }

    api
      .get(`/seasons/${season}/matches`)
      .then((res) => {
        setMatches(res.data);
        writeCache(cacheKey, res.data);
      })
      .finally(() => setLoading(false));
  }, [season]);

  // Skeleton Loader

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 relative px-4">
      <div className="bg-black/70 backdrop-blur-3xl rounded-3xl border border-white/5 p-6 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter italic">
              Match History
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase opacity-80">
              Season {season}
            </p>
          </div>

          <div className="flex justify-center mt-0">
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="appearance-none bg-zinc-900/50 hover:bg-zinc-800/60 border border-white/10 text-white px-4 py-2 rounded-xl transition-all cursor-pointer backdrop-blur-xl outline-none font-bold text-sm tracking-tighter"
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

        {/* Matches */}
        {[...matches].reverse().map((match) => (
          <div key={match.id} className="mb-8">
            {(() => {
              const sortedEntries = [...match.entries].sort((a, b) => {
                const aPlayed = a.rank > 0;
                const bPlayed = b.rank > 0;

                if (aPlayed !== bPlayed) {
                  return aPlayed ? -1 : 1;
                }

                if (aPlayed && bPlayed) {
                  if (a.rank !== b.rank) return a.rank - b.rank;
                  return b.points - a.points;
                }

                if (b.points !== a.points) return b.points - a.points;
                return a.name.localeCompare(b.name);
              });

              const winnerName = sortedEntries.find(
                (entry) => entry.rank > 0,
              )?.name;

              return (
                <>
                  {/* Match Header */}
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4 text-sm sm:text-base">
                    <h3 className="font-semibold text-white text-lg">
                      Match {match.matchNumber}
                    </h3>

                    <h4 className="font-medium text-cyan-300">
                      {match.matchName}
                    </h4>

                    <span className="text-zinc-300">{match.date}</span>
                  </div>

                  {/* Match Table */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2">
                      <thead>
                        <tr className="text-cyan-300 uppercase tracking-[0.2em] text-[9px] font-black opacity-70">
                          <th className="text-left pb-2 px-6">Rank</th>
                          <th className="text-left pb-2 px-6">Player</th>
                          <th className="text-left pb-2 px-6">Points</th>
                        </tr>
                      </thead>

                      <tbody className="mt-2">
                        {sortedEntries.map((entry) => (
                          <tr
                            key={entry.name}
                            className="group transition-all duration-300"
                          >
                            <td className="py-3.5 px-6 text-sm bg-white/2 rounded-l-xl group-hover:bg-white/5 transition-colors font-semibold text-zinc-200">
                              {entry.rank}
                            </td>

                            <td className="py-3.5 px-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`${winnerName === entry.name ? "text-cyan-300 font-bold" : "text-zinc-200"}`}
                                >
                                  {entry.name}
                                </span>
                                {winnerName === entry.name && (
                                  <span className="text-cyan-300 text-lg">
                                    👑
                                  </span>
                                )}
                              </div>
                            </td>

                            <td
                              className={`py-3.5 px-6 text-sm font-black rounded-r-xl bg-white/2 group-hover:bg-white/5 transition-colors ${entry.rank > 0 ? "text-cyan-300" : "text-zinc-400"}`}
                            >
                              {entry.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchHistory;
