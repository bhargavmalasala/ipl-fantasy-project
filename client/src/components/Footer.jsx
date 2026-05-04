import React from "react";

function Footer({ totalMatches = 0, totalSeasons = 0, latestMatch }) {
  return (
    <footer className="w-full mt-10">
      <div className="max-w-7xl mx-auto bg-black/70 backdrop-blur-3xl rounded-t-2xl border border-white/5 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-300 shadow-inner">
        {/* Left */}
        <p className="text-sm">© {new Date().getFullYear()} Stumpr</p>

        {/* Center */}
        <p className="text-sm text-center">
          Built with <span className="text-cyan-300">🔥</span> by{" "}
          <a
            href="https://github.com/bhargavmalasala"
            target="_blank_"
            rel="noopener noreferrer"
          >
            <span className="text-cyan-300 font-semibold">Bhargav Krishna</span>
          </a>
        </p>

        {/* Right (Stats + Latest Match) */}
        <div className="flex flex-col md:flex-row items-center gap-3 text-sm">
          <span>
            Matches:{" "}
            <span className="text-cyan-300 font-medium">{totalMatches}</span>
          </span>

          <span>
            Seasons:{" "}
            <span className="text-cyan-300 font-medium">{totalSeasons}</span>
          </span>

          <span className="text-cyan-300 font-medium">🔥</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
