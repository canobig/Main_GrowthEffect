import { useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Alert, Box, CircularProgress, Typography, IconButton } from '@mui/material';
import { SmartToyOutlined, Refresh } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { myAITeamApi } from '@/api/myaiteam';

const AgentList = ({ onSelectAgent, selectedAgent }) => {
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedAgents = await myAITeamApi.getAgents();
            setAgents(fetchedAgents || []);
        } catch (err) {
            setError('Failed to load agents. Please try again later.');
            console.error('Error fetching agents:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert 
                    severity="error" 
                    action={
                        <IconButton
                            color="inherit"
                            size="small"
                            onClick={fetchAgents}
                        >
                            <Refresh fontSize="small" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <List sx={{ width: '100%' }}>
            {agents.length === 0 ? (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        textAlign: 'center', 
                        color: 'text.secondary', 
                        p: 2,
                        fontStyle: 'italic'
                    }}
                >
                    No agents available
                </Typography>
            ) : (
                agents.map((agent) => (
                    <ListItem 
                        key={agent.id} 
                        disablePadding
                        sx={{ mb: 1 }}
                    >
                        <ListItemButton 
                            selected={selectedAgent?.id === agent.id}
                            onClick={() => onSelectAgent(agent)}
                            sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                    '&:hover': {
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                                    }
                                },
                                '&:hover': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                        color: 'primary.main'
                                    }}
                                >
                                    <SmartToyOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                        {agent.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        {agent.type} - {agent.description}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))
            )}
        </List>
    );
};

export default AgentList; 