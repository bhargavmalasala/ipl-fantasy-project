import { Link } from "react-router-dom";
import logo from "../assets/ipl-logo.png";


function Navbar() {
  return (
    <div className="ipl-navbar">
      <div className="ipl-navbar-inner">
        <div className="ipl-brand">
          <img src={logo} alt="IPL Logo" className="ipl-logo-img" />

          <h1 className="ipl-logo-text">
            IPL <span>Fantasy Tracker</span> 
          </h1>
        </div>

        <div className="ipl-links">
          <Link to="/" className="ipl-link">
            Leaderboard
          </Link>
          <Link to="/matches" className="ipl-link">
            Matches
          </Link>
          <Link to="/compare" className="ipl-link">
            1v1
          </Link>
          <Link to="/caps" className="ipl-link">
            Caps
          </Link>
          <Link to="/admin" className="ipl-link">
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
