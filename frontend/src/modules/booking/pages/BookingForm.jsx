import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createBooking } from "../services/bookingService";

const FACILITY_TYPES = ["LAB", "LECTURE_HALL", "MEETING_ROOM", "EQUIPMENT"];
const FACILITY_STATUSES = ["ACTIVE", "OUT_OF_SERVICE"];

export default function BookingForm({ initialValues, onSaved }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const facilityId = searchParams.get("facilityId") || "";
  const facilityName = searchParams.get("facilityName") || facilityId;

  const initial = useMemo(
    () =>
      initialValues || {
        resourceId: facilityId,
        userId: localStorage.getItem("userId") || "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: "",
      },
    [initialValues, facilityId]
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
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.error || e2?.message;
      if (status === 409) {
        const msg = serverMsg || "The selected time is already booked. Please choose another slot.";
        setError(msg);
        toast.error(msg);
      } else {
        const msg = serverMsg || "Failed to create booking.";
        setError(msg);
      }
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
            Fill in the details to request a booking for <span className="font-semibold text-on-surface/80">{facilityName}</span>.
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl shadow-card border border-surface-container-highest p-8">
          <form onSubmit={onSubmit} className="space-y-6">

            {/* Facility — read only */}
            <div>
              <label className="block text-sm font-medium text-on-surface/70 mb-1">
                Facility
              </label>
              <input
                value={facilityName}
                readOnly
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