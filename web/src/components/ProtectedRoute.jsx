import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@shared/AuthProvider";
import Loading from "./Loading";

// Opening any protected address without a token sends the user to the sign-in
// page, remembering where they were headed so they land there afterwards.
export default function ProtectedRoute({ children }) {
  const { signedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading message="Memeriksa sesi Anda…" />;
  if (!signedIn) {
    return <Navigate to="/masuk" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
