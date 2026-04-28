import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsByUser, cancelBooking } from "../services/bookingService";
import { QRCodeSVG } from "qrcode.react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import UserSidebar from "../../../components/layout/UserSidebar";

// ── Status pill styles ────────────────────────────────────────────────────────
const STATUS_STYLES = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100  text-green-700",
  REJECTED:  "bg-red-100    text-red-700",
  CANCELLED: "bg-surface-container-low text-on-surface/50",
};

// ── Filter tab definitions ────────────────────────────────────────────────────
const TABS = [
  { key: "ALL",       label: "All" },
  { key: "PENDING",   label: "Pending" },
  { key: "APPROVED",  label: "Approved" },
  { key: "REJECTED",  label: "Rejected" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "HISTORY",   label: "🗑 Booking History" },
];

function formatDateTime(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ── localStorage helpers for the bin ─────────────────────────────────────────
function getBinnedIds(userId) {
  try {
    const raw = localStorage.getItem(`bookings_bin_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBinnedIds(userId, ids) {
  localStorage.setItem(`bookings_bin_${userId}`, JSON.stringify(ids));
}

// ─────────────────────────────────────────────────────────────────────────────
export default function MyBookings() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";

  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab,    setActiveTab]    = useState("ALL");
  const [binnedIds,    setBinnedIds]    = useState(() => getBinnedIds(userId));

  // ── Load bookings ───────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (!userId) { setBookings([]); setLoading(false); return; }
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
  }, [userId]);

  // ── Cancel a booking ────────────────────────────────────────────────────────
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

  // ── Move a booking to the bin ───────────────────────────────────────────────
  const handleBin = (id) => {
    if (!window.confirm("Move this booking to Booking History?")) return;
    const updated = [...new Set([...binnedIds, id])];
    setBinnedIds(updated);
    saveBinnedIds(userId, updated);
  };

  // ── Restore a booking from the bin ─────────────────────────────────────────
  const handleRestore = (id) => {
    const updated = binnedIds.filter((bid) => bid !== id);
    setBinnedIds(updated);
    saveBinnedIds(userId, updated);
  };

  // ── Derived lists ───────────────────────────────────────────────────────────
  const activeBookings  = bookings.filter((b) => !binnedIds.includes(b.id));
  const binnedBookings  = bookings.filter((b) =>  binnedIds.includes(b.id));

  const filteredBookings =
    activeTab === "HISTORY"
      ? binnedBookings
      : activeTab === "ALL"
      ? activeBookings
      : activeBookings.filter((b) => b.status === activeTab);

  // ── Tab badge counts ────────────────────────────────────────────────────────
  const tabCount = (key) => {
    if (key === "HISTORY") return binnedBookings.length;
    if (key === "ALL")     return activeBookings.length;
    return activeBookings.filter((b) => b.status === key).length;
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout sidebar={<UserSidebar />}>
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <p className="text-sm text-on-surface/45">Loading your bookings…</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<UserSidebar />}>
      <div className="min-h-screen bg-surface py-10 px-4">
        <div className="max-w-4xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">My Bookings</h1>
            <p className="text-sm text-on-surface/55 mt-1">
              {activeTab === "HISTORY"
                ? `${binnedBookings.length} archived booking${binnedBookings.length !== 1 ? "s" : ""}`
                : `${filteredBookings.length} booking${filteredBookings.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-on-surface/60 hover:text-on-surface px-4 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low hover:bg-surface-container-lowest transition-colors"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/student/facilities")}
              className="bg-primary hover:bg-primary-container text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-card transition-colors"
            >
              + New Booking
            </button>
          </div>
        </div>

        {/* ── Filter tabs ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => {
            const count    = tabCount(tab.key);
            const isActive  = activeTab === tab.key;
            const isHistory = tab.key === "HISTORY";
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium
                  border transition-all duration-150
                  ${isActive
                    ? isHistory
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-primary text-white border-primary shadow-sm"
                    : isHistory
                      ? "bg-surface text-rose-500 border-rose-200 hover:bg-rose-50"
                      : "bg-surface text-on-surface/60 border-surface-container-highest hover:bg-surface-container-low"
                  }
                `}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`
                      text-xs px-1.5 py-0.5 rounded-full font-semibold leading-none
                      ${isActive
                        ? "bg-white/25 text-white"
                        : isHistory
                          ? "bg-rose-100 text-rose-600"
                          : "bg-surface-container-highest text-on-surface/60"
                      }
                    `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Error ──────────────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* ── History banner ─────────────────────────────────────────────────── */}
        {activeTab === "HISTORY" && (
          <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-700">
            <span>🗑</span>
            <span>These bookings have been archived. Restore them to move them back to your active bookings.</span>
          </div>
        )}

        {/* ── Empty state ────────────────────────────────────────────────────── */}
        {!error && filteredBookings.length === 0 && (
          <div className="glass-panel rounded-3xl border border-surface-container-highest shadow-card p-12 text-center">
            <p className="text-on-surface/45 text-sm">
              {activeTab === "HISTORY"
                ? "No archived bookings."
                : activeTab === "ALL"
                ? "You have no bookings yet."
                : `No ${activeTab.toLowerCase()} bookings.`}
            </p>
            {activeTab !== "HISTORY" && (
              <button
                onClick={() => navigate("/student/facilities")}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Browse facilities to make a booking →
              </button>
            )}
          </div>
        )}

        {/* ── Bookings list ───────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isCancellable = booking.status === "PENDING" || booking.status === "APPROVED";
            const isBinnable    = !isCancellable && activeTab !== "HISTORY";
            const isInHistory   = activeTab === "HISTORY";
            const facilityLabel = booking.resourceName || booking.resourceId;

            const qrData = JSON.stringify({
              bookingId:    booking.id,
              resourceId:   booking.resourceId,
              resourceName: facilityLabel,
              userId:       booking.userId,
              startTime:    booking.startTime,
              endTime:      booking.endTime,
            });

            return (
              <div
                key={booking.id}
                className={`
                  glass-panel rounded-3xl border shadow-card p-6 transition-opacity
                  ${isInHistory
                    ? "border-rose-100 opacity-80"
                    : "border-surface-container-highest"
                  }
                `}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Facility:{" "}
                      <span className="text-on-surface/70">{facilityLabel}</span>
                    </p>
                    <p className="text-xs text-on-surface/45 mt-0.5">
                      Booked on {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                        STATUS_STYLES[booking.status] || "bg-surface-container-low text-on-surface/50"
                      }`}
                    >
                      {booking.status}
                    </span>
                    {isBinnable && (
                      <button
                        onClick={() => handleBin(booking.id)}
                        title="Move to Booking History"
                        className="text-on-surface/30 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                      >
                        🗑
                      </button>
                    )}
                    {isInHistory && (
                      <button
                        onClick={() => handleRestore(booking.id)}
                        title="Restore booking"
                        className="text-xs text-rose-500 hover:text-rose-700 border border-rose-200 hover:bg-rose-50 px-3 py-1 rounded-lg transition-colors"
                      >
                        ↩ Restore
                      </button>
                    )}
                  </div>
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

                {/* QR Code — APPROVED only */}
                {booking.status === "APPROVED" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-6">
                    <QRCodeSVG
                      value={qrData}
                      size={100}
                      bgColor="#f0fdf4"
                      fgColor="#166534"
                      level="M"
                    />
                    <div>
                      <p className="text-sm font-bold text-green-800 mb-1">Booking Approved!</p>
                      <p className="text-xs text-green-700">
                        Show this QR code at the facility entrance to check in.
                      </p>
                    </div>
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
    </DashboardLayout>
  );
}