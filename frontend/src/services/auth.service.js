import api from '../api/config';
import { jwtDecode } from 'jwt-decode'; // You'll need to install this: npm install jwt-decode

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/api/auth/signin', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('teacher', JSON.stringify(response.data.teacher));
                return response.data;
            }
            throw new Error(response.data.message || 'Login failed');
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    signup: async (userData) => {
        try {
            const response = await api.post('/api/auth/signup', userData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('teacher', JSON.stringify(response.data.teacher));
                return response.data;
            }
            throw new Error(response.data.message || 'Registration failed');
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('teacher');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        const teacherData = localStorage.getItem('teacher');

        if (token) {
            try {
                // Verify token hasn't expired
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    // Token expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('teacher');
                    return null;
                }

                return teacherData ? JSON.parse(teacherData) : { isAuthenticated: true };
            } catch (error) {
                console.error('Token validation error:', error);
                return null;
            }
        }
        return null;
    }
};