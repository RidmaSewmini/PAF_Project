import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsByUser, cancelBooking } from "../services/bookingService";

const STATUS_STYLES = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100  text-green-700",
  REJECTED:  "bg-red-100    text-red-700",
  CANCELLED: "bg-surface-container-low text-on-surface/50",
};

function formatDateTime(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setBookings([]);
          setLoading(false);
          return;
        }
        const response = await getBookingsByUser(userId);
        if (!cancelled) setBookings(response.data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load bookings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancellingId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch (e) {
      alert(e?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-sm text-on-surface/45">Loading your bookings…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">My Bookings</h1>
            <p className="text-sm text-on-surface/55 mt-1">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={() => navigate("/bookings/new")}
            className="bg-primary hover:bg-primary-container text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-card transition-colors"
          >
            + New Booking
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && bookings.length === 0 && (
          <div className="glass-panel rounded-3xl border border-surface-container-highest shadow-card p-12 text-center">
            <p className="text-on-surface/45 text-sm">You have no bookings yet.</p>
            <button
              onClick={() => navigate("/bookings/new")}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Make your first booking →
            </button>
          </div>
        )}

        {/* Bookings list */}
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCancellable =
              booking.status === "PENDING" || booking.status === "APPROVED";

            return (
              <div
                key={booking.id}
                className="glass-panel rounded-3xl border border-surface-container-highest shadow-card p-6"
              >
                {/* Top row: resource ID + status badge */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Facility:{" "}
                      <span className="font-mono text-on-surface/60">
                        {booking.resourceId}
                      </span>
                    </p>
                    <p className="text-xs text-on-surface/45 mt-0.5">
                      Booked on {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                      STATUS_STYLES[booking.status] || "bg-surface-container-low text-on-surface/50"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Details grid */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-on-surface/45">Start</p>
                    <p className="text-on-surface/70">{formatDateTime(booking.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface/45">End</p>
                    <p className="text-on-surface/70">{formatDateTime(booking.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface/45">Purpose</p>
                    <p className="text-on-surface/70">{booking.purpose || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface/45">Expected Attendees</p>
                    <p className="text-on-surface/70">{booking.expectedAttendees || "—"}</p>
                  </div>
                </div>

                {/* Rejection reason */}
                {booking.status === "REJECTED" && booking.rejectionReason && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 text-sm text-red-600">
                    Reason: {booking.rejectionReason}
                  </div>
                )}

                {/* Cancel action */}
                {isCancellable && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? "Cancelling…" : "Cancel Booking"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}