import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

function Caps() {
  const [caps, setCaps] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [season, setSeason] = useState("");

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

    setCaps(null);
    api.get(`/seasons/${season}/caps`).then((res) => setCaps(res.data));
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
    <div className="max-w-6xl mx-auto px-4 mt-10 sm:mt-16 text-white">
      {/* Heading */}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-12">
        Season {season} Caps 🏆
      </h2>

      <div className="flex justify-center mb-8">
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
        {capData.map((cap, index) => (
          <div
            key={index}
            className="
    bg-white/10 backdrop-blur-lg 
    border border-white/20 
    rounded-2xl 
    p-6 
    text-center 
    shadow-lg
    hover:scale-105 
    hover:shadow-2xl 
    transition-all duration-300
  "
          >
            {/* Cap Image */}
            <img
              src={cap.img}
              alt={cap.title}
              className="w-28 h-28 object-contain mx-auto mb-4 transition-transform duration-300 hover:scale-110"
            />

            {/* PLAYER NAME (PRIMARY) */}
            <h2 className="text-2xl font-bold tracking-wide">{cap.player}</h2>

            {/* STAT (IMPORTANT) */}
            <p className="text-lg text-yellow-300 font-semibold mt-1">
              {cap.value} {cap.unit}
            </p>

            {/* CAP TITLE (SECONDARY) */}
            <p className="text-gray-400 text-sm mt-2 uppercase tracking-wider">
              {cap.title}
            </p>
          </div>
        ))}
      </div>

      {/* Cap Meaning Section */}
      <div className="max-w-5xl mx-auto mt-16 bg-[#1f2a3a] rounded-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 px-6 py-3 font-semibold text-white text-lg">
          What Each Cap Represents
        </div>

        {/* Content */}
        <div className="divide-y divide-white/10">
          <div className="flex justify-between px-6 py-4">
            <span className="text-orange-400 font-medium">Orange Cap</span>
            <span className="text-gray-300">
              Highest Total Points in the Season
            </span>
          </div>

          <div className="flex justify-between px-6 py-4">
            <span className="text-red-400 font-medium">Red Cap</span>
            <span className="text-gray-300">Single Match Highest Points</span>
          </div>

          <div className="flex justify-between px-6 py-4">
            <span className="text-gray-400 font-medium">Black Cap</span>
            <span className="text-gray-300">Single Match Lowest Points</span>
          </div>

          <div className="flex justify-between px-6 py-4">
            <span className="text-blue-400 font-medium">Blue Cap</span>
            <span className="text-gray-300">Most Wins</span>
          </div>

          <div className="flex justify-between px-6 py-4">
            <span className="text-yellow-400 font-medium">Yellow Cap</span>
            <span className="text-gray-300">
              Highest average points per match
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Caps;
