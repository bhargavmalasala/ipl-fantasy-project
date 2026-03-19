import { useEffect, useState } from "react";
import api from "../api/axios";

function Caps() {

  const [caps,setCaps] = useState(null);
  const season = new Date().getFullYear();

  useEffect(()=>{

    api.get(`/seasons/${season}/caps`)
      .then(res => setCaps(res.data));

  },[]);

  if(!caps) return <p>Loading...</p>;

  return(

    <div className="max-w-5xl mx-auto mt-10">

      <h2 className="text-3xl font-bold mb-8">
        Season Caps
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">

        <div className="text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto"></div>
          <h3 className="mt-3 font-bold">Orange Cap</h3>
          <p>{caps.orangeCap.player}</p>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full mx-auto"></div>
          <h3 className="mt-3 font-bold">Red Cap</h3>
          <p>{caps.redCap.player}</p>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto"></div>
          <h3 className="mt-3 font-bold">Blue Cap</h3>
          <p>{caps.blueCap.player}</p>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto"></div>
          <h3 className="mt-3 font-bold">Yellow Cap</h3>
          <p>{caps.yellowCap.player}</p>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-black rounded-full mx-auto"></div>
          <h3 className="mt-3 font-bold text-white">Black Cap</h3>
          <p>{caps.blackCap.player}</p>
        </div>

      </div>

    </div>

  );

}

export default Caps;