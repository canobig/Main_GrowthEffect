import api from './api';

export const myAITeamApi = {
    // Fetch all available agents
    getAgents: async () => {
        try {
            const response = await api.get('/api/v1/agents');
            return response.data;
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    },

    // Send message to an agent
    sendMessage: async (agentId, message) => {
        try {
            const response = await api.post(`/api/v1/chat/${agentId}`, {
                message
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Get chat history for an agent
    getChatHistory: async (agentId) => {
        try {
            const response = await api.get(`/api/v1/chat/${agentId}/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    },

    uploadFile: async (agentId, formData) => {
        try {
            const response = await api.post(`/api/v1/chat/${agentId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}; 