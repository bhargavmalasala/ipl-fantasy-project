import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import MatchHistory from "./pages/MatchHistory";
import PlayerProfile from "./pages/PlayerProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>} />
        <Route path="/matches" element={<MatchHistory />} />
        <Route path="/player/:name" element={<PlayerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;