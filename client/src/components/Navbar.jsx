import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          IPL Fantasy Tracker
        </h1>

        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-600">
            Leaderboard
          </Link>
          <Link to="/matches" className="hover:text-blue-600">
            Matches
          </Link>
          <Link to="/admin" className="hover:text-blue-600">
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;