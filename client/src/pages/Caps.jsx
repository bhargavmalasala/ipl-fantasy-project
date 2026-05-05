import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

const CACHE_TTL_MS = 5 * 60 * 1000;
const SEASONS_CACHE_KEY = "seasons-cache-v1";
const CAPS_CACHE_PREFIX = "caps-cache-v1:";

const readCache = (key) => {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!parsed?.timestamp || !parsed?.data) return null;

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

function Caps() {
  const [caps, setCaps] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("");

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

        if (!cachedSeasons?.length && res.data.length > 0) {
          setSeason(res.data[0]);
        }
      })
      .catch(() => {
        if (!cachedSeasons?.length) {
          setCaps({
            orangeCap: { player: "", points: 0 },
            redCap: { player: "", points: 0 },
            blueCap: { player: "", wins: 0 },
            yellowCap: { player: "", avg: 0 },
            blackCap: { player: "", points: 0 },
          });
        }
      });
  }, []);

  useEffect(() => {
    if (!season) return;

    const cacheKey = `${CAPS_CACHE_PREFIX}${season}`;
    const cachedCaps = readCache(cacheKey);

    if (cachedCaps) {
      setCaps(cachedCaps);
    } else {
      setCaps(null);
    }

    api.get(`/seasons/${season}/caps`).then((res) => {
      setCaps(res.data);
      writeCache(cacheKey, res.data);
    });
  }, [season]);

  if (!caps)
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  const capData = [
    {
      title: "Orange Cap",
      player: caps.orangeCap.player,
      value: caps.orangeCap.points,
      unit: "Points",
      img: "/orange.png",
    },
    {
      title: "Red Cap",
      player: caps.redCap.player,
      value: caps.redCap.points,
      unit: "Points",
      img: "/red.png",
    },
    {
      title: "Blue Cap",
      player: caps.blueCap.player,
      value: caps.blueCap.wins,
      unit: "Wins",
      img: "/blue.png",
    },
    {
      title: "Yellow Cap",
      player: caps.yellowCap.player,
      value: caps.yellowCap.avg,
      unit: "Avg",
      img: "/yellow.png",
    },
    {
      title: "Black Cap",
      player: caps.blackCap.player,
      value: caps.blackCap.points,
      unit: "Points",
      img: "/black.png",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mt-12 sm:mt-16 text-white">
      <div className="bg-black/70 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl p-5 sm:p-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter italic text-white">
            Season {season} Caps 🏆
          </h2>
          <p className="mt-2 text-zinc-500 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold">
            Cap leaders and season awards
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="appearance-none bg-zinc-900/50 hover:bg-zinc-800/60 border border-white/10 text-white px-4 py-2 rounded-xl outline-none cursor-pointer backdrop-blur-xl transition-all font-bold text-sm tracking-tighter"
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {capData.map((cap, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/5 backdrop-blur-xl rounded-3xl p-6 text-center shadow-lg hover:-translate-y-1 hover:bg-white/8 hover:border-cyan-400/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-cyan-400/10 border border-cyan-300/20 p-3 mb-5">
                <img
                  src={cap.img}
                  alt={cap.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <h2 className="text-2xl font-black tracking-tighter text-white">
                {cap.player}
              </h2>

              <p className="text-lg text-cyan-300 font-bold mt-2">
                {cap.value} {cap.unit}
              </p>

              <p className="text-zinc-400 text-xs mt-3 uppercase tracking-[0.3em] font-bold">
                {cap.title}
              </p>
            </div>
          ))}
        </div>

        {/* Cap Meaning Section */}
        <div className="max-w-5xl mx-auto mt-16 bg-white/5 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-cyan-500/90 px-6 py-3 font-black text-black text-lg tracking-tight">
            What Each Cap Represents
          </div>

          {/* Content */}
          <div className="divide-y divide-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
              <span className="text-cyan-300 font-bold">Orange Cap</span>
              <span className="text-zinc-300">
                Highest Total Points in the Season
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
              <span className="text-rose-300 font-bold">Red Cap</span>
              <span className="text-zinc-300">Single Match Highest Points</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
              <span className="text-zinc-300 font-bold">Black Cap</span>
              <span className="text-zinc-300">Single Match Lowest Points</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
              <span className="text-sky-300 font-bold">Blue Cap</span>
              <span className="text-zinc-300">Most Wins</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
              <span className="text-yellow-300 font-bold">Yellow Cap</span>
              <span className="text-zinc-300">
                Highest average points per match
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Caps;
