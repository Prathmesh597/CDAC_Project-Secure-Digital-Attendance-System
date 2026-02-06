import api from './api';

// Sends email/password to Backend
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data; // Returns { token, name, role, userId }
    } catch (error) {
        throw error; // Let the UI handle the error message
    }
};

// Clear data when logging out
export const logoutUser = () => {
    // FIX: Clear ALL user data to prevent "Welcome [Old Name]" bug
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId'); // Crucial for Faculty ID
    
    // Safety net: Clear everything
    localStorage.clear();

    window.location.href = '/'; // Force redirect to login
};