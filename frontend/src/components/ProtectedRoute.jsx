import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — allows any authenticated user (USER or ADMIN).
 *
 * Uses AuthContext so it:
 *  1. Waits for the async user-fetch to finish (no premature redirects).
 *  2. Falls back to localStorage role as a fast-path while fetching.
 *  3. Redirects to /login only when the user is definitively unauthenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Fast-path: check localStorage while AuthContext is still loading
  const storedRole = localStorage.getItem("role");
  const storedUserId = localStorage.getItem("userId");

  // Debug logs — remove once auth is stable
  console.log("[ProtectedRoute] Current User Role:", user?.role);
  console.log("[ProtectedRoute] Stored Role:", storedRole);

  const normalizedStored = (storedRole || "").toUpperCase();
  const isStoredAuth =
    !!storedUserId && (normalizedStored === "USER" || normalizedStored === "ADMIN");

  // While loading, trust localStorage to avoid a flash-redirect
  if (loading) {
    if (isStoredAuth) return children; // looks authenticated — render optimistically
    return null;                        // genuinely unknown — wait silently
  }

  // After loading, trust the resolved user object
  const normalizedRole = (user?.role || "").toUpperCase();
  if (!user || (normalizedRole !== "USER" && normalizedRole !== "ADMIN")) {
    // Final safety-net: trust localStorage if context lost the user somehow
    if (isStoredAuth) return children;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
