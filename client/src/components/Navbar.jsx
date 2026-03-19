import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="ipl-navbar">
      <div className="ipl-navbar-inner">

        <h1 className="ipl-logo">
          IPL <span>Fantasy</span>
        </h1>

        <div className="ipl-links">
          <Link to="/" className="ipl-link">Leaderboard</Link>
          <Link to="/matches" className="ipl-link">Matches</Link>
          <Link to="/compare" className="ipl-link">1v1</Link>
          <Link to="/admin" className="ipl-link">Admin</Link>
        </div>

      </div>
    </div>
  );
}

export default Navbar;