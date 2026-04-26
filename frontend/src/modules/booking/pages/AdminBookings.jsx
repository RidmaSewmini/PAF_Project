import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings, approveBooking, rejectBooking } from "../services/bookingService";

const STATUS_STYLES = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100  text-green-700",
  REJECTED:  "bg-red-100    text-red-700",
  CANCELLED: "bg-surface-container-low text-on-surface/50",
};

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

function formatDateTime(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actioningId, setActioningId]       = useState(null);
  const [rejectingId, setRejectingId]       = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllBookings();
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

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await approveBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "APPROVED" } : b))
      );
    } catch (e) {
      alert(e?.message || "Failed to approve booking.");
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectSubmit = async (id) => {
    if (!rejectionReason.trim()) return;
    setActioningId(id);
    try {
      await rejectBooking(id, rejectionReason.trim());
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, status: "REJECTED", rejectionReason: rejectionReason.trim() }
            : b
        )
      );
      setRejectingId(null);
      setRejectionReason("");
    } catch (e) {
      alert(e?.message || "Failed to reject booking.");
    } finally {
      setActioningId(null);
    }
  };

  const openRejectPanel = (id) => {
    setRejectingId(id);
    setRejectionReason("");
  };

  const closeRejectPanel = () => {
    setRejectingId(null);
    setRejectionReason("");
  };

  const filtered =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-sm text-on-surface/45">Loading bookings…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">All Bookings</h1>
            <p className="text-sm text-on-surface/55 mt-1">
              {filtered.length} of {bookings.length} booking
              {bookings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="text-sm text-on-surface/60 hover:text-on-surface px-4 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low hover:bg-surface-container-lowest transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-container-lowest text-on-surface/60 border-surface-container-highest hover:border-primary/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && filtered.length === 0 && (
          <div className="glass-panel rounded-3xl border border-surface-container-highest shadow-card p-12 text-center">
            <p className="text-on-surface/45 text-sm">
              No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} bookings found.
            </p>
          </div>
        )}

        {/* Booking cards */}
        <div className="space-y-4">
          {filtered.map((booking) => {
            const isPending   = booking.status === "PENDING";
            const isActioning = actioningId === booking.id;
            const isRejecting = rejectingId === booking.id;
            const facilityLabel = booking.resourceName || booking.resourceId;

            return (
              <div
                key={booking.id}
                className="glass-panel rounded-3xl border border-surface-container-highest shadow-card p-6"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Facility:{" "}
                      <span className="text-on-surface/70">
                        {facilityLabel}
                      </span>
                    </p>
                    <p className="text-xs text-on-surface/45 mt-0.5">
                      User:{" "}
                      <span className="font-mono">{booking.userId}</span>
                      {" · "}Booked on {formatDateTime(booking.createdAt)}
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

                {/* Rejection reason (already rejected) */}
                {booking.status === "REJECTED" && booking.rejectionReason && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 text-sm text-red-600">
                    Reason: {booking.rejectionReason}
                  </div>
                )}

                {/* Reject reason input panel */}
                {isPending && isRejecting && (
                  <div className="mt-4 bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-3 space-y-3">
                    <p className="text-xs font-medium text-on-surface/60">
                      Rejection reason
                    </p>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter a reason for rejection…"
                      rows={2}
                      className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-3 py-2 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectSubmit(booking.id)}
                        disabled={!rejectionReason.trim() || isActioning}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors"
                      >
                        {isActioning ? "Rejecting…" : "Confirm Reject"}
                      </button>
                      <button
                        onClick={closeRejectPanel}
                        className="text-xs text-on-surface/60 hover:text-on-surface px-4 py-1.5 rounded-xl border border-surface-container-highest bg-surface-container-low hover:bg-surface-container-lowest transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Approve / Reject actions — only for PENDING */}
                {isPending && !isRejecting && (
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => openRejectPanel(booking.id)}
                      disabled={isActioning}
                      className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(booking.id)}
                      disabled={isActioning}
                      className="text-sm text-white bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isActioning ? "Approving…" : "Approve"}
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