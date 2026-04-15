import { useEffect, useState } from "react";
import { getFacilities } from "../services/facilityService";

export default function FacilityList() {
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError("");
      try {
        const response = await getFacilities();
        if (!cancelled) setFacilities(response.data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load facilities.");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Facilities</h1>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <pre className="mt-4 text-xs whitespace-pre-wrap">{JSON.stringify(facilities, null, 2)}</pre>
    </div>
  );
}
