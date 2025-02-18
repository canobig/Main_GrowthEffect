import client from './client';

export const myAITeamApi = {
  // Get the list of agents and chatflows
  getAgents: async () => {
    try {
      // Get multiagent chatflows (agents)
      const agentsResponse = await client.get('/chatflows?type=MULTIAGENT');
      const agents = agentsResponse.data.map(agent => ({
        ...agent,
        isAgent: true // Add flag to identify as agent
      }));

      // Get regular chatflows
      const chatflowsResponse = await client.get('/chatflows?type=CHATFLOW');
      const chatflows = chatflowsResponse.data.map(chatflow => ({
        ...chatflow,
        isAgent: false // Add flag to identify as chatflow
      }));

      // Combine and return both
      return [...agents, ...chatflows];
    } catch (error) {
      console.error('Error fetching agents and chatflows:', error);
      throw error;
    }
  },

  // Send message to an agent
  sendMessage: async (agentId, message, chatId = null) => {
    try {
      const response = await client.post(`/internal-prediction/${agentId}`, {
        question: message,
        history: [],
        chatId: chatId,
        overrideConfig: {
          returnSourceDocuments: true
        }
      });
      
      // The response structure matches the internal prediction endpoint
      return {
        reply: response.data.text || response.data.answer,
        chatId: response.data.chatId
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get chat history for an agent
  getChatHistory: async (agentId, params = {}) => {
    try {
      const response = await client.get(`/chatmessage/${agentId}`, {
        params: {
          order: 'DESC',
          feedback: true,
          ...params
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        return { messages: [] };
      }

      // Transform the messages to our format
      const messages = response.data.map(msg => {
        // Determine if it's a user message
        const isUser = msg.role === 'userMessage';

        return {
          content: (msg.answer || msg.content),
          isUser: isUser,
          timestamp: new Date(msg.createdDate),
          chatId: msg.chatId
        };
      });

      // Sort messages by timestamp (oldest first)
      messages.sort((a, b) => a.timestamp - b.timestamp);

      return {
        messages,
        chatId: messages[messages.length - 1]?.chatId
      };
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Upload a file for the agent
  uploadFile: async (agentId, formData) => {
    try {
      const pathResponse = await client.get('/get-upload-path');
      const uploadPath = pathResponse.data;

      const response = await client.post(`/upload/${agentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        fileUrl: `${uploadPath}/${response.data.filename}`
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Abort an ongoing message
  abortMessage: async (agentId, chatId) => {
    try {
      await client.put(`/chatmessage/abort/${agentId}/${chatId}`);
    } catch (error) {
      console.error('Error aborting message:', error);
      throw error;
    }
  },

  // Clear chat history for an agent
  clearChatHistory: async (agentId) => {
    try {
      await client.delete(`/chatmessage/${agentId}`);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  },
};