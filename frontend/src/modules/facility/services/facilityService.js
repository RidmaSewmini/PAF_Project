import api from "../../../services/api";

export const getFacilities = async (filters) => {
  const response = await api.get("/api/facilities", { params: filters });
  console.log("Facilities API response:", response.data);
  return response;
};

export const getFacilityById = (id) => api.get(`/api/facilities/${id}`);

export const createFacility = (formData) => api.post("/api/facilities", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const updateFacility = (id, formData) => api.put(`/api/facilities/${id}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const deleteFacility = (id) => api.delete(`/api/facilities/${id}`);