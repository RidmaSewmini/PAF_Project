import { useMemo, useState } from "react";
import { createBooking } from "../services/bookingService";

export default function BookingForm({ initialValues, onSaved }) {
  const initial = useMemo(
    () =>
      initialValues || {
        facilityId: "",
        userId: localStorage.getItem("userId") || "",
        startTime: "",
        endTime: "",
        purpose: "",
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

    try {
      const response = await createBooking(values);
      onSaved?.(response.data);
    } catch (e2) {
      setError(e2?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6">
      <h1 className="text-xl font-semibold">Create Booking</h1>

      <div className="mt-4 grid gap-3 max-w-xl">
        <input
          name="facilityId"
          value={values.facilityId}
          onChange={onChange}
          placeholder="Facility ID"
          className="border rounded px-3 py-2"
        />
        <input
          name="userId"
          value={values.userId}
          onChange={onChange}
          placeholder="User ID"
          className="border rounded px-3 py-2"
        />
        <input
          name="startTime"
          value={values.startTime}
          onChange={onChange}
          placeholder="Start Time"
          className="border rounded px-3 py-2"
        />
        <input
          name="endTime"
          value={values.endTime}
          onChange={onChange}
          placeholder="End Time"
          className="border rounded px-3 py-2"
        />
        <input
          name="purpose"
          value={values.purpose}
          onChange={onChange}
          placeholder="Purpose"
          className="border rounded px-3 py-2"
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button type="submit" disabled={loading} className="border rounded px-3 py-2">
          {loading ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
