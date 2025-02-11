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
        <MainCard 
            sx={{ 
                height: 'calc(100vh - 88px)', // Header height'ını çıkarıyoruz
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: 'none',
                boxShadow: 'none',
                '& .MuiCardContent-root': {
                    height: '100%',
                    p: 0
                }
            }}
        >
            <Grid 
                container 
                sx={{ 
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* Left Panel: Agent List */}
                <Grid 
                    item 
                    xs={12} 
                    md={3} 
                    sx={{ 
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            p: 2,
                            pb: 1
                        }}
                    >
                        My Agents
                    </Typography>
                    <Box 
                        sx={{ 
                            flexGrow: 1,
                            overflow: 'hidden',
                            px: 2
                        }}
                    >
                        <AgentList 
                            onSelectAgent={handleSelectAgent}
                            selectedAgent={selectedAgent}
                        />
                    </Box>
                </Grid>
                
                {/* Right Panel: Chat Window */}
                <Grid 
                    item 
                    xs={12} 
                    md={9} 
                    sx={{ 
                        height: '100%'
                    }}
                >
                    <ChatWindow selectedAgent={selectedAgent} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default MyAITeam;