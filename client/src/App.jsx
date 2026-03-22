import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import MatchHistory from "./pages/MatchHistory";
import PlayerProfile from "./pages/PlayerProfile";
import ComparePlayers from "./pages/ComparePlayers";
import Footer from "./components/Footer";
import Caps from "./pages/Caps";

function App() {
  const [matches, setMatches] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    api.get("/seasons").then((res) => {
      setSeasons(res.data);

      const requests = res.data.map((s) =>
        api.get(`/seasons/${s}/matches`)
      );

      Promise.all(requests).then((responses) => {
        let allMatches = [];
        responses.forEach((r) => {
          allMatches = [...allMatches, ...r.data];
        });

        setMatches(allMatches);
      });
    });
  }, []);
  return (
    <div className="app-bg">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/matches" element={<MatchHistory />} />
          <Route path="/player/:name" element={<PlayerProfile />} />
          <Route path="/compare" element={<ComparePlayers />} />
          <Route path="/caps" element={<Caps />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
