// frontend/src/api/suratApi.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/surat`;

// Ambil token dari localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const getAllJenisSurat = async () => {
    const response = await axios.get(`${API_URL}/master/jenis`, { headers: getAuthHeader() });
    return response.data;
};

export const createJenisSurat = async (data) => {
    const response = await axios.post(`${API_URL}/master/jenis`, data, { headers: getAuthHeader() });
    return response.data;
};

export const updateJenisSurat = async (id, data) => {
    const response = await axios.put(`${API_URL}/master/jenis/${id}`, data, { headers: getAuthHeader() });
    return response.data;
};

export const deleteJenisSurat = async (id) => {
    const response = await axios.delete(`${API_URL}/master/jenis/${id}`, { headers: getAuthHeader() });
    return response.data;
};