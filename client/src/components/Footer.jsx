import React from "react";

function Footer({ totalMatches = 0, totalSeasons = 0, latestMatch }) {
  return (
    <footer className="bg-[#020617]/90 backdrop-blur-md border-t border-white/10 text-gray-400 mt-10">
      
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left */}
        <p className="text-sm">
          © {new Date().getFullYear()} IPL Fantasy Tracker
        </p>

        {/* Center */}
        <p className="text-sm text-center">
          Built with <span className="text-red-500">❤️</span> by{" "}
          <span className="text-orange-400 font-semibold">
            Bhargav Krishna
          </span>
        </p>

        {/* Right (Stats + Latest Match) */}
        <div className="flex flex-col md:flex-row items-center gap-3 text-sm">

          <span>
            Matches:{" "}
            <span className="text-orange-400 font-medium">
              {totalMatches}
            </span>
          </span>

          <span>
            Seasons:{" "}
            <span className="text-orange-400 font-medium">
              {totalSeasons}
            </span>
          </span>

          {latestMatch && (
            <span className="text-yellow-400 font-medium">
              🔥 {latestMatch.matchName}
            </span>
          )}

        </div>

      </div>

    </footer>
  );
}

export default Footer;