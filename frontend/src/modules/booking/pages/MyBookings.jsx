import { useEffect, useState } from "react";
import { getBookingsByUser } from "../services/bookingService";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError("");
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setBookings([]);
          return;
        }
        const response = await getBookingsByUser(userId);
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
      <h1 className="text-xl font-semibold">My Bookings</h1>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <pre className="mt-4 text-xs whitespace-pre-wrap">{JSON.stringify(bookings, null, 2)}</pre>
    </div>
  );
}
