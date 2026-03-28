import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const nowInSeconds = Math.floor(Date.now() / 1000);

      if (payload?.exp && payload.exp <= nowInSeconds) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
      }
    } catch {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
