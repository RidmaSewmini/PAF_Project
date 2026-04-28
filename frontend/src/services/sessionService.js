import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sessions';

const getHeaders = () => {
    const userId = localStorage.getItem('userId');
    const sessionId = localStorage.getItem('sessionId');
    return {
        'X-User-Id': userId,
        'X-Session-Id': sessionId
    };
};

export const getSessions = async () => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
};

export const terminateSession = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getHeaders() });
    return response.data;
};

export const terminateAllSessions = async () => {
    const response = await axios.delete(`${API_URL}/logout-all`, { headers: getHeaders() });
    return response.data;
};
