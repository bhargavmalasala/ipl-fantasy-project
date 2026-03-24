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
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    api
      .get("/seasons")
      .then((res) => {
        setSeasons(res.data);

        const requests = res.data.map((s) => api.get(`/seasons/${s}/matches`));

        return Promise.all(requests);
      })
      .then((responses) => {
        let allMatches = [];
        responses.forEach((r) => {
          allMatches = [...allMatches, ...r.data];
        });

        setMatches(allMatches);
        setBootError("");
      })
      .catch(() => {
        setBootError("Unable to load initial data.");
        setMatches([]);
        setSeasons([]);
      });
  }, []);

  const latestMatch = matches.length > 0 ? matches[matches.length - 1] : null;

  return (
    <div className="app-bg min-h-screen">
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-1">
            {bootError ? (
              <div className="max-w-5xl mx-auto mt-6 rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-red-200">
                {bootError}
              </div>
            ) : null}
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
          </main>

          <Footer
            totalMatches={matches.length}
            totalSeasons={seasons.length}
            latestMatch={latestMatch}
          />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
