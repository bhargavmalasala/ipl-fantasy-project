import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/stumpr.png";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { to: "/", label: "Leaderboard" },
    { to: "/matches", label: "Matches" },
    { to: "/compare", label: "1v1" },
    { to: "/caps", label: "Caps" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full border-b border-white/5 bg-black/70 backdrop-blur-3xl shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-6">
            <img
              src={logo}
              alt="Stumpr Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-black tracking-tighter transition-all duration-200 ${
                    isActive
                      ? "text-cyan-300 bg-cyan-500/10 border border-cyan-300/30"
                      : "text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="md:hidden h-10 w-10 rounded-xl border border-white/10 bg-black/60 text-zinc-200 text-xl leading-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "X" : "☰"}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 px-4 pb-4 pt-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-black tracking-tighter transition-all duration-200 ${
                    isActive
                      ? "text-cyan-300 bg-cyan-500/10 border border-cyan-300/30"
                      : "text-zinc-300 bg-white/2 border border-white/10"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
