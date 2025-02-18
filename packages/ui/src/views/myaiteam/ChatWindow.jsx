import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Alert } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { myAITeamApi } from '@/api/myaiteam';
import { wsService } from '@/api/webSocketService';

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const time = date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    if (date.toDateString() === today.toDateString()) {
        return time;
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${time}`;
    }

    return `${date.toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    })}, ${time}`;
};

const Message = ({ message }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2
            }}
        >
            <Paper
                sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.isUser ? 'primary.main' : '#1a237e',
                    color: 'primary.contrastText',
                    borderRadius: message.isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    wordBreak: 'break-word'
                }}
            >
                <Typography 
                    variant="caption" 
                    sx={{ 
                        display: 'block', 
                        mb: 0.5,
                        opacity: 0.8 
                    }}
                >
                    {message.isUser ? 'You' : 'Agent'}
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
                {message.timestamp && (
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            display: 'block', 
                            mt: 0.5,
                            opacity: 0.8,
                            textAlign: message.isUser ? 'right' : 'left',
                            fontSize: '0.75rem'
                        }}
                    >
                        {formatDateTime(message.timestamp)}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

const MESSAGES_PER_PAGE = 20;

const ChatWindow = ({ selectedAgent }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const [currentChatId, setCurrentChatId] = useState(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!selectedAgent) {
            setMessages([]);
            setCurrentChatId(null);
            return;
        }

        const loadInitialHistory = async () => {
            try {
                setIsLoading(true);
                const response = await myAITeamApi.getChatHistory(selectedAgent.id, {
                    limit: MESSAGES_PER_PAGE
                });

                setMessages(response.messages);
                setCurrentChatId(response.chatId);
                setError(null);
            } catch (err) {
                setError('Failed to load chat history');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialHistory();
    }, [selectedAgent]);

    useEffect(() => {
        if (!selectedAgent) return;

        wsService.connect();

        const handleNewMessage = (data) => {
            if (data.agentId !== selectedAgent.id) return;

            setMessages(prev => [
                ...prev,
                {
                    content: data.message,
                    isUser: false, // Agent mesajları için false olarak ayarladık
                    timestamp: new Date()
                }
            ]);
        };

        wsService.on('agent:message', handleNewMessage);

        return () => {
            wsService.off('agent:message', handleNewMessage);
        };
    }, [selectedAgent]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedAgent) return;

        const userMessage = {
            content: inputMessage,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            const response = await myAITeamApi.sendMessage(selectedAgent.id, inputMessage, currentChatId);
            setCurrentChatId(response.chatId);

            setMessages(prev => [
                ...prev,
                {
                    content: response.reply,
                    isUser: false, // API’den dönen mesajın agent’a ait olduğunu garantiledik
                    timestamp: new Date()
                }
            ]);
        } catch {
            setError('Failed to send message');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 1.5, backgroundColor: 'background.paper', borderTop: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        fullWidth
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <IconButton onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatWindow;