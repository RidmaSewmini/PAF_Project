import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getFacilities, deleteFacility } from "../services/facilityService";

export default function FacilityList() {
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", location: "", status: "" });
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "LAB": return "🔬";
      case "LECTURE_HALL": return "🎓";
      case "MEETING_ROOM": return "📋";
      case "EQUIPMENT": return "🔧";
      default: return "🏛️";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Facilities</h1>
          <p className="text-gray-500 mt-1">Manage campus facilities and resources</p>
        </div>

        <Link
          to="/facilities/new"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          + Add Facility
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4 flex-wrap">
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
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
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>

        <button
          onClick={loadFacilities}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
        >
          Search
        </button>

        <button
          onClick={() => {
            const cleared = { type: "", location: "", status: "" };
            setFilters(cleared);
            loadFacilities(cleared);
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
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

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading facilities...</p>
        </div>
      ) : facilities.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No facilities found.</p>
        </div>
      ) : (
        /* Facility Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(facility.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{facility.name}</h3>
                    <p className="text-xs text-gray-500">{facility.type}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(facility.status)}`}>
                  {facility.status}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>📍 {facility.location}</p>
                <p>👥 Capacity: {facility.capacity}</p>
                {facility.description && <p>📝 {facility.description}</p>}
              </div>

              {facility.availabilityWindows?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Availability:</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.availabilityWindows.map((w, i) => (
                      <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">

                <Link
                  to={`/facilities/edit/${facility.id}`}
                  className="flex-1 text-center bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm hover:bg-purple-100 transition"
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
          ))}
        </div>
      )}
    </div>
  );
}