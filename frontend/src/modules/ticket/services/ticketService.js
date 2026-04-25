import axios from 'axios';

// Assuming the backend is running on localhost:8080 based on the default Spring Boot port
const API_BASE_URL = 'http://localhost:8080/api/tickets';

/**
 * Sends a POST request to create a new incident ticket.
 * @param {Object} ticketData - The incident details.
 * @returns {Promise<Object>} The created ticket data.
 */
export const createTicket = async (ticketData) => {
  try {
    const response = await axios.post(API_BASE_URL, ticketData);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error.response?.data || new Error('Failed to create ticket');
  }
};

/**
 * Fetches specific ticket data via a GET request.
 * @param {string} id - The ticket ID.
 * @returns {Promise<Object>} The ticket data.
 */
export const getTicketById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket with id ${id}:`, error);
    throw error.response?.data || new Error('Failed to fetch ticket details');
  }
};

/**
 * Sends a PUT request to update the status of a ticket and add resolution notes.
 * @param {string} id - The ticket ID.
 * @param {Object} statusUpdate - The update payload { status, resolutionNotes }.
 * @returns {Promise<Object>} The updated ticket data.
 */
export const updateTicketStatus = async (id, statusUpdate) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/status`, statusUpdate);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for ticket ${id}:`, error);
    throw error.response?.data || new Error('Failed to update ticket status');
  }
};

/**
 * Fetches the list of all incidents for the dashboard via a GET request.
 * @returns {Promise<Array>} An array of ticket objects.
 */
export const getAllTickets = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    throw error.response?.data || new Error('Failed to fetch tickets');
  }
};

export default {
  createTicket,
  getTicketById,
  updateTicketStatus,
  getAllTickets
};
