import api from '../api/config';

export const studentService = {
    getAll: async () => {
        try {
            const response = await api.get('/api/students');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/api/students/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    createStudent: async (studentData) => {
        try {
            const response = await api.post('/api/students', studentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateStudent: async (id, studentData) => {
        try {
            const response = await api.put(`/api/students/${id}`, studentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteStudent: async (id) => {
        try {
            const response = await api.delete(`/api/students/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    uploadStudentImage: async (studentId, formData) => {
        try {
            const response = await api.post(`/api/students/${studentId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};