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
    className={`w-20 h-20 object-contain mx-auto mb-4 ${cap.glow}`}
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

    </div>
  );
}

export default Caps;