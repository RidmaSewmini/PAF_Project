import { useEffect, useState } from "react";
import { getAllBookings } from "../services/bookingService";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError("");
      try {
        const response = await getAllBookings();
        if (!cancelled) setBookings(response.data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load bookings.");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">All Bookings (Admin)</h1>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <pre className="mt-4 text-xs whitespace-pre-wrap">{JSON.stringify(bookings, null, 2)}</pre>
    </div>
  );
}
