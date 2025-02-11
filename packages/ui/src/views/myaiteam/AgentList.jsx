import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  Box,
  CircularProgress,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { SmartToyOutlined, Chat as ChatIcon, Search as SearchIcon } from '@mui/icons-material';
import { myAITeamApi } from '../../api/myaiteam';
import { wsService } from '../../api/websocket';

const AgentList = ({ onSelectAgent, selectedAgent }) => {
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      setAgents((prev) => [...prev, agent]);
    };

    const handleAgentUpdate = (updatedAgent) => {
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === updatedAgent.id ? updatedAgent : agent
        )
      );
    };

    const handleAgentRemove = (agentId) => {
      setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
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

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.description &&
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '550px', // Fixed height for scrolling
        // border: '1px solid #ccc', // Removed border line
      }}
    >
      <TextField
        size="small"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" sx={{ fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      <List
        sx={{
          width: '100%',
          flexGrow: 1,
          overflowY: 'auto', // Enables vertical scrolling
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'background.paper',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.400',
            borderRadius: '4px',
          },
          '& .MuiListItem-root': {
            py: 0.5,
          },
        }}
      >
        {filteredAgents.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary', p: 2 }}
          >
            {searchQuery ? 'No matching agents found' : 'No agents or chatflows available'}
          </Typography>
        ) : (
          filteredAgents.map((agent) => (
            <ListItem key={agent.id} disablePadding>
              <ListItemButton
                selected={selectedAgent?.id === agent.id}
                onClick={() => onSelectAgent(agent)}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: agent.isAgent ? 'primary.main' : 'secondary.main',
                      '& .MuiSvgIcon-root': {
                        color: '#fff',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {agent.isAgent ? <SmartToyOutlined /> : <ChatIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={agent.name} secondary={agent.description} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default AgentList;