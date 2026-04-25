import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService";

export default function BookingForm({ initialValues, onSaved }) {
  const navigate = useNavigate();

  const initial = useMemo(
    () =>
      initialValues || {
        resourceId: "",        // ✅ fixed: was facilityId
        userId: localStorage.getItem("userId") || "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: "",
      },
    [initialValues]
  );

  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic client-side time validation
    if (values.startTime && values.endTime && values.startTime >= values.endTime) {
      setError("End time must be after start time.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...values,
        expectedAttendees:
          values.expectedAttendees === ""
            ? undefined
            : Number(values.expectedAttendees),
      };

      const response = await createBooking(payload);

      if (onSaved) {
        onSaved(response.data);
      } else {
        navigate("/my-bookings");
      }
    } catch (e2) {
      setError(e2?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-on-surface/55 hover:text-on-surface mb-4 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-on-surface">New Booking</h1>
          <p className="text-sm text-on-surface/55 mt-1">
            Fill in the details to request a facility booking.
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl shadow-card border border-surface-container-highest p-8">
          <form onSubmit={onSubmit} className="space-y-6">

            {/* Resource ID */}
            <div>
              <label className="block text-sm font-medium text-on-surface/70 mb-1">
                Facility ID <span className="text-red-500">*</span>
              </label>
              <input
                name="resourceId"
                value={values.resourceId}
                onChange={onChange}
                placeholder="Enter the facility ID"
                required
                className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
              />
              <p className="text-xs text-on-surface/45 mt-1">
                You can find this on the Facilities page.
              </p>
            </div>

            {/* User ID — pre-filled, read only */}
            <div>
              <label className="block text-sm font-medium text-on-surface/70 mb-1">
                User ID
              </label>
              <input
                name="userId"
                value={values.userId}
                onChange={onChange}
                placeholder="User ID"
                readOnly={Boolean(localStorage.getItem("userId"))}
                className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/55 focus:outline-none transition"
              />
            </div>

            {/* Start + End time row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface/70 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="startTime"
                  value={values.startTime}
                  onChange={onChange}
                  type="datetime-local"
                  required
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface/70 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="endTime"
                  value={values.endTime}
                  onChange={onChange}
                  type="datetime-local"
                  required
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-on-surface/70 mb-1">
                Purpose <span className="text-red-500">*</span>
              </label>
              <textarea
                name="purpose"
                value={values.purpose}
                onChange={onChange}
                placeholder="e.g. CS101 Lab Session, Team Meeting…"
                rows={3}
                required
                className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition resize-none"
              />
            </div>

            {/* Expected Attendees */}
            <div>
              <label className="block text-sm font-medium text-on-surface/70 mb-1">
                Expected Attendees
              </label>
              <input
                name="expectedAttendees"
                value={values.expectedAttendees}
                onChange={onChange}
                placeholder="e.g. 25"
                type="number"
                min="1"
                className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-container disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-card transition-colors"
              >
                {loading ? "Submitting…" : "Request Booking"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-sm text-on-surface/60 hover:text-on-surface px-4 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low hover:bg-surface-container-lowest transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}