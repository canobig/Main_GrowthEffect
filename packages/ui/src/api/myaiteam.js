import api from './api';

export const myAITeamApi = {
    // Get all available agents
    getAgents: async () => {
        try {
            const [chatflowsRes, agentflowsRes] = await Promise.all([
                api.get('/api/v1/workflows'),
                api.get('/api/v1/agents')
            ]);

            // Transform chatflows data
            const chatflows = (chatflowsRes.data || [])
                .filter(chatflow => chatflow.deployed)
                .map(chatflow => ({
                    id: chatflow.id,
                    name: chatflow.name || 'Untitled Chatflow',
                    description: chatflow.description || 'Chatflow Agent',
                    type: 'chatflow',
                    flowData: chatflow.flowData,
                    deployed: true,
                    category: chatflow.category || 'Default'
                }));

            // Transform agentflows data
            const agentflows = (agentflowsRes.data || [])
                .filter(agentflow => agentflow.deployed)
                .map(agentflow => ({
                    id: agentflow.id,
                    name: agentflow.name || 'Untitled Agentflow',
                    description: agentflow.description || 'Agentflow Agent',
                    type: 'agentflow',
                    flowData: agentflow.flowData,
                    deployed: true,
                    category: agentflow.category || 'Default'
                }));

            return [...chatflows, ...agentflows];
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    },

    // Send message to an agent
    sendMessage: async (agentId, message, agentType) => {
        try {
            const response = await api.post(`/api/v1/prediction/${agentId}`, {
                question: message,
                history: [],
                overrideConfig: {
                    returnSourceDocuments: true
                }
            });

            return {
                reply: response.data.text || response.data.message || 'No response',
                sourceDocuments: response.data.sourceDocuments || []
            };
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Upload file
    uploadFile: async (agentId, formData) => {
        try {
            const response = await api.post('/api/v1/upload', formData);
            return {
                fileUrl: response.data.url
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}; 