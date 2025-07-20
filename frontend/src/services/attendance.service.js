import api from '../api/config';

export const attendanceService = {
    getAttendanceRecords: async (filters = {}) => {
        try {
            const response = await api.get('/api/attendance', { params: filters });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAttendanceById: async (id) => {
        try {
            const response = await api.get(`/api/attendance/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    takeAttendance: async (attendanceData) => {
        try {
            const response = await api.post('/api/attendance', attendanceData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    takeCameraAttendance: async (imageData) => {
        try {
            const formData = new FormData();
            formData.append('image', imageData);

            const response = await api.post('/api/attendance/camera', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAttendanceReport: async (filters = {}) => {
        try {
            const response = await api.get('/api/attendance/report', { params: filters });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};