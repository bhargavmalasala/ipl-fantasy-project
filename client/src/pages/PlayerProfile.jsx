import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useSearchParams } from "react-router-dom";

function PlayerProfile() {

  const { name } = useParams();

  const [searchParams] = useSearchParams();
  const season = searchParams.get("season") || new Date().getFullYear();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    api
      .get(`/seasons/${season}/player/${name}`)
      .then((res) => {
        setPlayer(res.data);
        setLoading(false);
      });

  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        {player.name} - Season {season}
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-gray-100 p-4 rounded">
          Matches Played
          <div className="font-bold text-lg">
            {player.matchesPlayed}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          Wins
          <div className="font-bold text-lg">
            {player.wins}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          Total Points
          <div className="font-bold text-lg">
            {player.totalPoints}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          Avg Points
          <div className="font-bold text-lg">
            {player.avgPoints}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          Best Score
          <div className="font-bold text-lg">
            {player.bestScore}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          Worst Score
          <div className="font-bold text-lg">
            {player.worstScore}
          </div>
        </div>

      </div>

      {/* Match History */}
      <table className="w-full text-sm">

        <thead>
          <tr className="border-b text-gray-600">
            <th className="text-left py-2">Match</th>
            <th className="text-left py-2">Points</th>
            <th className="text-left py-2">Rank</th>
          </tr>
        </thead>

        <tbody>

          {player.history.map((h) => (

            <tr
              key={h.match}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-2">{h.match}</td>
              <td className="py-2">{h.points}</td>
              <td className="py-2">{h.rank}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default PlayerProfile;