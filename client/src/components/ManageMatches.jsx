import { useEffect, useState } from "react";
import api from "../api/axios";

function ManageMatches(){

  const [matches,setMatches] = useState([]);

  const season = new Date().getFullYear();

  useEffect(()=>{

    api.get(`/seasons/${season}/matches`)
      .then(res => setMatches(res.data));

  },[]);

  const deleteMatch = async(id)=>{

    if(!window.confirm("Delete this match?")) return;

    await api.delete(`/seasons/${season}/matches/${id}`);

    setMatches(matches.filter(m => m.id !== id));

  };

  return(

    <table className="w-full text-sm">

      <thead>
        <tr className="border-b text-gray-600">
          <th className="text-left py-3">Match</th>
          <th className="text-left py-3">Date</th>
          <th className="text-left py-3">Actions</th>
        </tr>
      </thead>

      <tbody>

        {matches.map(match => (

          <tr key={match.id} className="border-b">

            <td className="py-3">
              Match {match.matchNumber}
            </td>

            <td className="py-3">
              {match.date}
            </td>

            <td className="py-3">

              <button
                onClick={()=>deleteMatch(match.id)}
                className="text-red-600"
              >
                Delete
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  );

}

export default ManageMatches;