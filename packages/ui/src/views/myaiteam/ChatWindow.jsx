import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { Send as SendIcon, AttachFile, Stop as StopIcon } from '@mui/icons-material';
import { myAITeamApi } from '../../api/myaiteam';
import { wsService } from '../../api/websocket';
import FileMessage from './FileMessage';

const Message = ({ message, isUser }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            mb: 2
        }}
    >
        <Paper
            sx={{
                p: 2,
                maxWidth: '70%',
                backgroundColor: isUser ? 'primary.main' : '#1a237e',
                color: 'primary.contrastText',
                borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                wordBreak: 'break-word'
            }}
        >
            <Typography variant="body1">{message.content}</Typography>
        </Paper>
    </Box>
);

const MESSAGES_PER_PAGE = 20;

const ChatWindow = ({ selectedAgent }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const messagesContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [currentChatId, setCurrentChatId] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load initial chat history
    useEffect(() => {
        if (selectedAgent) {
            const loadInitialHistory = async () => {
                try {
                    setIsLoading(true);
                    const response = await myAITeamApi.getChatHistory(selectedAgent.id, {
                        limit: MESSAGES_PER_PAGE
                    });
                    
                    if (response.messages.length > 0) {
                        setMessages(response.messages);
                        setCurrentChatId(response.chatId);
                    } else {
                        setMessages([]);
                        setCurrentChatId(null);
                    }
                    
                    setHasMore(response.messages.length >= MESSAGES_PER_PAGE);
                    setPage(1);
                    setError(null);
                } catch (err) {
                    setError('Failed to load chat history');
                    console.error('Error loading chat history:', err);
                } finally {
                    setIsLoading(false);
                }
            };

            loadInitialHistory();
        } else {
            setMessages([]);
            setHasMore(true);
            setPage(1);
            setCurrentChatId(null);
        }
    }, [selectedAgent]);

    // Load more messages when scrolling up
    const handleScroll = async (e) => {
        const container = e.target;
        if (container.scrollTop <= 100 && !isLoading && hasMore) {
            try {
                setIsLoading(true);
                const response = await myAITeamApi.getChatHistory(selectedAgent.id, {
                    page: page + 1,
                    limit: MESSAGES_PER_PAGE
                });
                
                const scrollHeightBefore = container.scrollHeight;
                
                setMessages(prev => [...response.messages, ...prev]);
                setHasMore(response.hasMore);
                setPage(prev => prev + 1);

                // Maintain scroll position
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight - scrollHeightBefore;
                });
            } catch (error) {
                console.error('Error loading more messages:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (selectedAgent) {
            // Connect to WebSocket when an agent is selected
            wsService.connect();

            // Listen for agent typing status
            const handleTyping = (data) => {
                if (data.agentId === selectedAgent.id) {
                    setIsAgentTyping(data.isTyping);
                }
            };

            // Listen for new messages
            const handleNewMessage = (data) => {
                if (data.agentId === selectedAgent.id) {
                    setMessages(prev => [...prev, {
                        content: data.message,
                        isUser: false,
                        timestamp: new Date()
                    }]);
                }
            };

            wsService.on('agent:typing', handleTyping);
            wsService.on('agent:message', handleNewMessage);

            return () => {
                wsService.off('agent:typing', handleTyping);
                wsService.off('agent:message', handleNewMessage);
            };
        }
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
        setIsLoading(true);
        setError(null);

        try {
            const response = await myAITeamApi.sendMessage(
                selectedAgent.id, 
                inputMessage, 
                currentChatId
            );
            
            if (response.chatId) {
                setCurrentChatId(response.chatId);
            }
            
            if (response.reply) {
                const agentResponse = {
                    content: response.reply,
                    isUser: false,
                    timestamp: new Date(),
                    chatId: response.chatId
                };
                setMessages(prev => [...prev, agentResponse]);
            }
        } catch (error) {
            setError('Failed to send message. Please try again.');
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !selectedAgent) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsLoading(true);
            const response = await myAITeamApi.uploadFile(selectedAgent.id, formData);
            
            const fileMessage = {
                type: 'file',
                content: {
                    name: file.name,
                    type: file.type,
                    url: response.fileUrl
                },
                isUser: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, fileMessage]);
        } catch (error) {
            setError('Failed to upload file. Please try again.');
            console.error('Error uploading file:', error);
        } finally {
            setIsLoading(false);
            event.target.value = '';
        }
    };

    const handleAbortMessage = async () => {
        if (selectedAgent && currentChatId) {
            try {
                await myAITeamApi.abortMessage(selectedAgent.id, currentChatId);
                setIsLoading(false);
            } catch (error) {
                console.error('Error aborting message:', error);
            }
        }
    };

    const renderMessage = (message) => {
        if (message.type === 'file') {
            return <FileMessage key={message.timestamp} file={message.content} isUser={message.isUser} />;
        }
        return <Message key={message.timestamp} message={message} isUser={message.isUser} />;
    };

    return (
        <Box 
            sx={{ 
                height: 'calc(100vh - 240px)', // Adjust height to account for header and padding
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative' // Add this for proper positioning
            }}
        >
            {error && (
                <Alert severity="error" sx={{ m: 2, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
                    {error}
                </Alert>
            )}
            
            <Box
                ref={messagesContainerRef}
                onScroll={handleScroll}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 1,
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'background.paper',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'grey.400',
                        borderRadius: '4px',
                    }
                }}
            >
                {isLoading && hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, position: 'sticky', top: 0, zIndex: 1 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
                
                {!selectedAgent ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                        Select an agent to start chatting
                    </Typography>
                ) : (
                    <Box sx={{ flexGrow: 1, minHeight: 'min-content' }}>
                        {messages.map((message, index) => 
                            renderMessage(message)
                        )}
                        {isAgentTyping && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                                <CircularProgress size={16} />
                                <Typography variant="body2" color="text.secondary">
                                    Agent is typing...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area - Make it stick to bottom with minimal spacing */}
            <Box 
                sx={{ 
                    p: 0.5,
                    backgroundColor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider',
                    mt: 'auto'
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    '& .MuiInputBase-root': {
                        py: 0.5
                    }
                }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!selectedAgent || isLoading}
                    >
                        <AttachFile />
                    </IconButton>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={selectedAgent ? "Type your message..." : "Select an agent to start chatting"}
                        disabled={!selectedAgent || isLoading}
                        sx={{ 
                            backgroundColor: 'background.paper',
                            '& .MuiOutlinedInput-root': {
                                padding: '8px 14px'
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLoading && (
                            <>
                                <IconButton 
                                    size="small"
                                    color="error"
                                    onClick={handleAbortMessage}
                                    sx={{
                                        backgroundColor: '#ffebee',
                                        '&:hover': {
                                            backgroundColor: '#ffcdd2'
                                        }
                                    }}
                                >
                                    <StopIcon />
                                </IconButton>
                                <CircularProgress size={20} />
                            </>
                        )}
                        {!isLoading && (
                            <IconButton 
                                size="small"
                                color="primary" 
                                onClick={handleSendMessage}
                                disabled={!selectedAgent || !inputMessage.trim()}
                            >
                                <SendIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatWindow; 