import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFacilities } from "../services/facilityService";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import UserSidebar from "../../../components/layout/UserSidebar";

export default function StudentFacilityList() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", location: "", status: "", name: "" });
  const [loading, setLoading] = useState(true);

  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const loadFacilities = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError("");
    try {
      const effectiveFilters = overrideFilters ?? filtersRef.current;
      const activeFilters = Object.fromEntries(
        Object.entries(effectiveFilters).filter(([_, v]) => v !== "")
      );
      const response = await getFacilities(activeFilters);
      setFacilities(response.data.filter((f) => f.status === "ACTIVE"));
    } catch (e) {
      setError(e?.message || "Failed to load facilities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  const handleSearch = () => {
    loadFacilities(filtersRef.current);
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "LAB":           return { icon: "🔬", bg: "bg-emerald-100" };
      case "LECTURE_HALL":  return { icon: "🎓", bg: "bg-violet-100" };
      case "MEETING_ROOM":  return { icon: "📋", bg: "bg-blue-100" };
      case "EQUIPMENT":     return { icon: "🔧", bg: "bg-amber-100" };
      default:              return { icon: "🏛️", bg: "bg-gray-100" };
    }
  };

  return (
    <DashboardLayout sidebar={<UserSidebar />}>
      <div className="min-h-screen bg-surface p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Book a Facility</h1>
            <p className="text-on-surface/55 mt-1">Browse and book available campus facilities</p>
          </div>
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-primary text-white px-4 py-2 rounded-xl shadow-card hover:bg-primary-container transition text-sm font-medium"
          >
            My Bookings
          </button>
        </div>

        {/* Filters */}
        <div className="glass-panel rounded-2xl border border-surface-container-highest shadow-card p-4 mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name..."
            className="bg-surface-container-lowest border border-surface-container-highest rounded-xl px-3 py-2 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <select
            className="bg-surface-container-lowest border border-surface-container-highest rounded-xl px-3 py-2 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="LAB">Lab</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>

          <input
            type="text"
            placeholder="Filter by location..."
            className="bg-surface-container-lowest border border-surface-container-highest rounded-xl px-3 py-2 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            onClick={handleSearch}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm shadow-card hover:bg-primary-container transition"
          >
            Search
          </button>

          <button
            onClick={() => {
              const cleared = { type: "", location: "", status: "", name: "" };
              setFilters(cleared);
              loadFacilities(cleared);
            }}
            className="bg-surface-container-low text-on-surface/70 px-4 py-2 rounded-xl text-sm border border-surface-container-highest hover:bg-surface-container-lowest hover:text-on-surface transition"
          >
            Clear
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-on-surface/55">Loading facilities...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-on-surface/55">No facilities available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => {
              const { icon, bg } = getTypeConfig(facility.type);
              return (
                <div
                  key={facility.id}
                  className="glass-panel rounded-2xl border border-surface-container-highest shadow-card hover:shadow-card-hover transition overflow-hidden"
                >
                  {/* Image / Banner */}
                  {facility.imageUrl ? (
                    <img
                      src={`http://localhost:8080/uploads/${facility.imageUrl}`}
                      alt={facility.name}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className={`${bg} h-36 flex items-center justify-center`}>
                      <span className="text-5xl">{icon}</span>
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-on-surface">{facility.name}</h3>
                        <p className="text-xs text-on-surface/50 mt-0.5">{facility.type.replace("_", " ")}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-on-surface/60 mb-4">
                      <p>📍 {facility.location}</p>
                      <p>👥 Capacity: {facility.capacity}</p>
                      {facility.description && <p>📝 {facility.description}</p>}
                    </div>

                    {facility.availabilityWindows?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-on-surface/50 mb-1">Availability:</p>
                        <div className="flex flex-wrap gap-1">
                          {facility.availabilityWindows.map((w, i) => (
                            <span key={i} className="text-xs bg-secondary/20 text-on-surface/70 px-2 py-1 rounded">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/bookings/new?facilityId=${facility.id}&facilityName=${encodeURIComponent(facility.name)}`)}
                      className="w-full bg-primary hover:bg-primary-container text-white px-3 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                      Book This Facility
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}