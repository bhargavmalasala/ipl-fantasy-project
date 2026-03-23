import { useEffect, useState } from "react";
import api from "../api/axios";

function Caps() {
  const [caps, setCaps] = useState(null);
  const season = new Date().getFullYear();

  useEffect(() => {
    api.get(`/seasons/${season}/caps`)
      .then(res => setCaps(res.data));
  }, []);

  if (!caps)
    return (
      <div className="text-center mt-20 text-gray-300 text-lg">
        Loading Caps...
      </div>
    );

  const capData = [
    {
      title: "Orange Cap",
      player: caps.orangeCap.player,
      img: "/orange.png"
    },
    {
      title: "Red Cap",
      player: caps.redCap.player,
      img: "/red.png"
    },
    {
      title: "Blue Cap",
      player: caps.blueCap.player,
      img: "/blue.png"
    },
    {
      title: "Yellow Cap",
      player: caps.yellowCap.player,
      img: "/yellow.png"
    },
    {
      title: "Black Cap",
      player: caps.blackCap.player,
      img: "/black.png"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mt-16 text-white">

      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-center mb-12">
        Season Caps 🏆
      </h2>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

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
  <h2 className="text-2xl font-bold tracking-wide">
    {cap.player}
  </h2>

  {/* STAT (IMPORTANT) */}
  <p className="text-lg text-yellow-300 font-semibold mt-1">
    {cap.value}
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
      <span className="text-gray-300">
        Single Match Highest Points
      </span>
    </div>

    <div className="flex justify-between px-6 py-4">
      <span className="text-gray-400 font-medium">Black Cap</span>
      <span className="text-gray-300">
        Single Match Lowest Points
      </span>
    </div>

    <div className="flex justify-between px-6 py-4">
      <span className="text-blue-400 font-medium">Blue Cap</span>
      <span className="text-gray-300">
        Most Wins
      </span>
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