import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFacilities, deleteFacility } from "../services/facilityService";

export default function FacilityList() {
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
      setFacilities(response.data);
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await deleteFacility(id);
        setFacilities((prev) => prev.filter((f) => f.id !== id));
      } catch (e) {
        setError("Failed to delete facility.");
      }
    }
  };

  const getStatusColor = (status) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
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
    <div className="min-h-screen bg-surface p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Facilities</h1>
          <p className="text-on-surface/55 mt-1">Manage campus facilities and resources</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="text-sm text-on-surface/60 hover:text-on-surface px-4 py-2 rounded-xl border border-surface-container-highest bg-surface-container-low hover:bg-surface-container-lowest transition"
          >
            ← Back to Dashboard
          </button>
          <Link
            to="/admin/facilities/new"
            className="bg-primary text-white px-4 py-2 rounded-xl shadow-card hover:bg-primary-container transition text-sm"
          >
            + Add Facility
          </Link>
        </div>
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

        <select
          className="bg-surface-container-lowest border border-surface-container-highest rounded-xl px-3 py-2 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>

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
          <p className="text-on-surface/55">No facilities found.</p>
        </div>
      ) : (
        /* Facility Cards */
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
                      <p className="text-xs text-on-surface/50 mt-0.5">{facility.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(facility.status)}`}>
                      {facility.status}
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

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/facilities/edit/${facility.id}`}
                      className="flex-1 text-center bg-secondary/20 text-on-surface px-3 py-2 rounded-xl text-sm hover:bg-secondary/30 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(facility.id)}
                      className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}