import { useMemo, useState } from "react";
import { createFacility, updateFacility } from "../services/facilityService";

export default function FacilityForm({ initialValues, facilityId, onSaved }) {
  const initial = useMemo(
    () =>
      initialValues || {
        name: "",
        type: "",
        location: "",
        capacity: "",
        status: "",
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

      onSaved?.(response.data);
    } catch (e2) {
      setError(e2?.message || "Failed to save facility.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6">
      <h1 className="text-xl font-semibold">Facility</h1>

      <div className="mt-4 grid gap-3 max-w-xl">
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Name"
          className="border rounded px-3 py-2"
        />
        <input
          name="type"
          value={values.type}
          onChange={onChange}
          placeholder="Type"
          className="border rounded px-3 py-2"
        />
        <input
          name="location"
          value={values.location}
          onChange={onChange}
          placeholder="Location"
          className="border rounded px-3 py-2"
        />
        <input
          name="capacity"
          value={values.capacity}
          onChange={onChange}
          placeholder="Capacity"
          type="number"
          className="border rounded px-3 py-2"
        />
        <input
          name="status"
          value={values.status}
          onChange={onChange}
          placeholder="Status"
          className="border rounded px-3 py-2"
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="border rounded px-3 py-2"
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
