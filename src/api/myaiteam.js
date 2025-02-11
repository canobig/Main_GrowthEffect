export const myAITeamApi = {
    // Get all available agents
    getAgents: async () => {
        const [chatflowsRes, agentflowsRes] = await Promise.all([
            api.get('/api/v1/workflows'),
            api.get('/api/v1/agents')
        ]);
        // Transform and combine responses
    },

    // Send message to agent
    sendMessage: async (agentId, message, agentType) => {
        const response = await api.post(`/api/v1/prediction/${agentId}`, {
            question: message,
            history: [],
            overrideConfig: {
                returnSourceDocuments: true
            }
        });
        return response.data;
    },

    // Upload file
    uploadFile: async (agentId, formData) => {
        const response = await api.post('/api/v1/upload', formData);
        return response.data;
    }
}; 