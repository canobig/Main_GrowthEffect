import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AgentList from './AgentList';
import ChatWindow from './ChatWindow';

const LAST_SELECTED_AGENT_KEY = 'lastSelectedAgent';

const MyAITeam = () => {
    const [selectedAgent, setSelectedAgent] = useState(null);

    // Load last selected agent from localStorage
    useEffect(() => {
        const lastAgent = localStorage.getItem(LAST_SELECTED_AGENT_KEY);
        if (lastAgent) {
            try {
                setSelectedAgent(JSON.parse(lastAgent));
            } catch (error) {
                console.error('Error parsing last selected agent:', error);
            }
        }
    }, []);

    const handleSelectAgent = (agent) => {
        setSelectedAgent(agent);
        localStorage.setItem(LAST_SELECTED_AGENT_KEY, JSON.stringify(agent));
    };

    return (
        <MainCard>
            <Grid container spacing={2} sx={{ height: 'calc(100vh - 180px)' }}>
                {/* Agent List Panel */}
                <Grid item xs={12} md={3} sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h4" mb={2}>
                        My Agents
                    </Typography>
                    <AgentList 
                        onSelectAgent={handleSelectAgent}
                        selectedAgent={selectedAgent}
                    />
                </Grid>
                
                {/* Chat Panel */}
                <Grid item xs={12} md={9}>
                    <ChatWindow selectedAgent={selectedAgent} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default MyAITeam; 