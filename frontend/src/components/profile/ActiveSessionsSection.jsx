import React, { useState, useEffect } from "react";
import { getSessions, terminateSession, terminateAllSessions } from "../../services/sessionService";
import SessionCard from "./SessionCard";
import { Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ActiveSessionsSection() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError("Failed to load active sessions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (id) => {
    if (!window.confirm("Are you sure you want to log out from this device?")) return;
    try {
      await terminateSession(id);
      
      const terminatedSession = sessions.find(s => s.id === id);
      if (terminatedSession?.isCurrent) {
          handleForcedLogout();
      } else {
          setSessions(sessions.filter(s => s.id !== id));
      }
    } catch (err) {
      alert("Failed to terminate session.");
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("This will log you out from all other devices. Continue?")) return;
    try {
      await terminateAllSessions();
      setSessions(sessions.filter(s => s.isCurrent));
    } catch (err) {
      alert("Failed to terminate all sessions.");
    }
  };

  const handleForcedLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("sessionId");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="rounded-3xl p-8 border border-white/40 shadow-glass flex justify-center items-center h-48 mt-8"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}>
         <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-8 border border-white/40 shadow-glass flex flex-col relative overflow-hidden mt-8"
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-primary p-2 bg-primary/10 rounded-lg text-lg flex items-center justify-center h-10 w-10">
            <Shield className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-xl font-titillium font-bold text-on-surface">Active Sessions</h3>
            <p className="text-on-surface/60 font-medium text-sm">Manage and monitor your active login sessions.</p>
          </div>
        </div>
        {sessions.length > 1 && (
          <button 
            onClick={handleLogoutAll}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-sm transition-colors border border-red-200 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            Logout from All Devices
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mb-4 font-medium text-sm">{error}</p>}

      <div className="space-y-4 relative z-10">
        {sessions.length === 0 && !error ? (
          <p className="text-on-surface/50 text-sm text-center py-4">No active sessions found.</p>
        ) : (
          sessions.map(session => (
            <SessionCard 
              key={session.id} 
              session={session} 
              onLogout={handleLogoutSession} 
            />
          ))
        )}
      </div>
    </div>
  );
}
