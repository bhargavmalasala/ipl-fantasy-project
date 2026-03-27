import { Link } from "react-router-dom";
import logo from "../assets/ipl-logo.png";
import { useState } from "react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="ipl-navbar">
      <div className="ipl-navbar-inner">
        <div className="ipl-brand">
          <img src={logo} alt="IPL Logo" className="ipl-logo-img" />
          <h1 className="ipl-logo-text hidden sm:inline">
             IPL <span>Fantasy Tracker</span>
          </h1>
          <h1 className="ipl-logo-text sm:hidden">IPL</h1>
        </div>

        {/* Desktop Links */}
        <div className="ipl-links hidden md:flex">
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/10 px-4 py-3 flex flex-col gap-2">
          <Link
            to="/"
            className="ipl-link-mobile"
            onClick={() => setMobileMenuOpen(false)}
          >
            Leaderboard
          </Link>
          <Link
            to="/matches"
            className="ipl-link-mobile"
            onClick={() => setMobileMenuOpen(false)}
          >
            Matches
          </Link>
          <Link
            to="/compare"
            className="ipl-link-mobile"
            onClick={() => setMobileMenuOpen(false)}
          >
            1v1
          </Link>
          <Link
            to="/caps"
            className="ipl-link-mobile"
            onClick={() => setMobileMenuOpen(false)}
          >
            Caps
          </Link>
          <Link
            to="/admin"
            className="ipl-link-mobile"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
