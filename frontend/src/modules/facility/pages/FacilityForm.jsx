import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFacility, updateFacility } from "../services/facilityService";

const FACILITY_TYPES = ["LAB", "LECTURE_HALL", "MEETING_ROOM", "EQUIPMENT"];
const FACILITY_STATUSES = ["ACTIVE", "OUT_OF_SERVICE"];

export default function FacilityForm({ initialValues, facilityId, onSaved }) {
  const navigate = useNavigate();

  const initial = useMemo(
    () =>
      initialValues || {
        name: "",
        type: "",
        location: "",
        capacity: "",
        status: "ACTIVE",
        description: "",
        availabilityWindows: [],
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
      const payload = {
        ...values,
        capacity: values.capacity === "" ? undefined : Number(values.capacity),
      };

      const response = facilityId
        ? await updateFacility(facilityId, payload)
        : await createFacility(payload);

      if (onSaved) {
        onSaved(response.data);
      } else {
        navigate("/facilities");
      }
    } catch (e2) {
      setError(e2?.message || "Failed to save facility.");
    } finally {
      setLoading(false);
    }
  };

  const isEdit = Boolean(facilityId);

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/facilities")}
            className="flex items-center gap-1 text-sm text-on-surface/55 hover:text-on-surface mb-4 transition-colors"
          >
            ← Back to Facilities
          </button>
          <h1 className="text-2xl font-bold text-on-surface">
            {isEdit ? "Edit Facility" : "Add New Facility"}
          </h1>
          <p className="text-sm text-on-surface/55 mt-1">
            {isEdit
              ? "Update the details for this facility."
              : "Fill in the details to register a new facility."}
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl shadow-card border border-surface-container-highest p-8">
          <form onSubmit={onSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-on-surface/70 mb-1">
                Facility Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={values.name}
                onChange={onChange}
                placeholder="e.g. Computer Lab A"
                required
                className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
              />
            </div>

            {/* Type + Status row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface/70 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={values.type}
                  onChange={onChange}
                  required
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
                >
                  <option value="">Select type…</option>
                  {FACILITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface/70 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={values.status}
                  onChange={onChange}
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
                >
                  {FACILITY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location + Capacity row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface/70 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  name="location"
                  value={values.location}
                  onChange={onChange}
                  placeholder="e.g. Block B, Floor 2"
                  required
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface/70 mb-1">
                  Capacity
                </label>
                <input
                  name="capacity"
                  value={values.capacity}
                  onChange={onChange}
                  placeholder="e.g. 30"
                  type="number"
                  min="1"
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-on-surface/70 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={onChange}
                placeholder="Optional notes about this facility…"
                rows={3}
                className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition resize-none"
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
                {loading ? "Saving…" : isEdit ? "Update Facility" : "Create Facility"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/facilities")}
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