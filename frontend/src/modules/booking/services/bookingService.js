import api from "../../../services/api";

export const getAllBookings = (filters) => api.get("/api/bookings", { params: filters });

export const getBookingsByUser = (userId) => api.get(`/api/bookings/user/${userId}`);

export const getBookingById = (id) => api.get(`/api/bookings/${id}`);

export const createBooking = (booking) => api.post("/api/bookings", booking);

export const approveBooking = (id) => api.put(`/api/bookings/${id}/approve`);

export const rejectBooking = (id, reason) => api.put(`/api/bookings/${id}/reject`, { reason });

export const cancelBooking = (id) => api.put(`/api/bookings/${id}/cancel`);
