import { useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Alert, Box, CircularProgress, Typography } from '@mui/material';
import { SmartToyOutlined } from '@mui/icons-material';
import { myAITeamApi } from '../../api/myaiteam';
import { wsService } from '../../api/websocket';

const AgentList = ({ onSelectAgent, selectedAgent }) => {
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const fetchedAgents = await myAITeamApi.getAgents();
                setAgents(fetchedAgents);
                setError(null);
            } catch (err) {
                setError('Failed to load agents. Please try again later.');
                console.error('Error fetching agents:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    useEffect(() => {
        wsService.connect();

        const handleNewAgent = (agent) => {
            setAgents(prev => [...prev, agent]);
        };

        const handleAgentUpdate = (updatedAgent) => {
            setAgents(prev => prev.map(agent => 
                agent.id === updatedAgent.id ? updatedAgent : agent
            ));
        };

        const handleAgentRemove = (agentId) => {
            setAgents(prev => prev.filter(agent => agent.id !== agentId));
        };

        wsService.on('agent:created', handleNewAgent);
        wsService.on('agent:updated', handleAgentUpdate);
        wsService.on('agent:removed', handleAgentRemove);

        return () => {
            wsService.off('agent:created', handleNewAgent);
            wsService.off('agent:updated', handleAgentUpdate);
            wsService.off('agent:removed', handleAgentRemove);
        };
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
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <List sx={{ width: '100%' }}>
            {agents.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', p: 2 }}>
                    No agents available
                </Typography>
            ) : (
                agents.map((agent) => (
                    <ListItem key={agent.id} disablePadding>
                        <ListItemButton 
                            selected={selectedAgent?.id === agent.id}
                            onClick={() => onSelectAgent(agent)}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <SmartToyOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={agent.name}
                                secondary={agent.description}
                            />
                        </ListItemButton>
                    </ListItem>
                ))
            )}
        </List>
    );
};

export default AgentList; 