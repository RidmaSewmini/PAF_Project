import api from "../../../services/api";

export const getFacilities = (filters) => api.get("/api/facilities", { params: filters });

export const getFacilityById = (id) => api.get(`/api/facilities/${id}`);

export const createFacility = (facility) => api.post("/api/facilities", facility);

export const updateFacility = (id, facility) => api.put(`/api/facilities/${id}`, facility);

export const deleteFacility = (id) => api.delete(`/api/facilities/${id}`);
