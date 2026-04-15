import { useEffect, useState } from "react";
import { getAllBookings, approveBooking, rejectBooking } from "../services/bookingService";

const STATUS_STYLES = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100  text-green-700",
  REJECTED:  "bg-red-100    text-red-700",
  CANCELLED: "bg-gray-100   text-gray-500",
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
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Per-card action state
  const [actioningId, setActioningId]       = useState(null); // which card is being acted on
  const [rejectingId, setRejectingId]       = useState(null); // which card shows reject input
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

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading bookings…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} of {bookings.length} booking
            {bookings.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                statusFilter === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">
              No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} bookings found.
            </p>
          </div>
        )}

        {/* Booking cards */}
        <div className="space-y-4">
          {filtered.map((booking) => {
            const isPending  = booking.status === "PENDING";
            const isActioning = actioningId === booking.id;
            const isRejecting = rejectingId === booking.id;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Facility:{" "}
                      <span className="font-mono text-gray-600">
                        {booking.resourceId}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      User:{" "}
                      <span className="font-mono">{booking.userId}</span>
                      {" · "}Booked on {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                      STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Details grid */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Start</p>
                    <p className="text-gray-700">{formatDateTime(booking.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">End</p>
                    <p className="text-gray-700">{formatDateTime(booking.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Purpose</p>
                    <p className="text-gray-700">{booking.purpose || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Expected Attendees</p>
                    <p className="text-gray-700">{booking.expectedAttendees || "—"}</p>
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
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 space-y-3">
                    <p className="text-xs font-medium text-gray-600">
                      Rejection reason
                    </p>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter a reason for rejection…"
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
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
                        className="text-xs text-gray-500 hover:text-gray-700 px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-white transition-colors"
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