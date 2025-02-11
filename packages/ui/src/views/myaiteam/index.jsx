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
                height: '100vh',
                position: 'fixed',
                zIndex: 1,
                mt: 0,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Grid 
                container 
                spacing={0}
                sx={{ 
                    height: '100%',   
                    overflow: 'hidden' // Grid içinde taşma olmasın
                }}
            >
                {/* SOL PANEL: Agent List */}
                <Grid 
                    item 
                    xs={12} 
                    md={3} 
                    sx={{ 
                        borderRight: '1px solid', 
                        borderColor: 'divider',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto', // Sadece sol panelde scroll
                        pt: 2
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 2, px: 1 }}>
                        My Agents
                    </Typography>
                    <Box 
                        sx={{ 
                            flexGrow: 1,
                            overflowY: 'auto', 
                            px: 1
                        }}
                    >
                        <AgentList 
                            onSelectAgent={handleSelectAgent}
                            selectedAgent={selectedAgent}
                        />
                    </Box>
                </Grid>
                
                {/* SAĞ PANEL: Chat Window (Scroll'u KAPATTIK) */}
                <Grid 
                    item 
                    xs={12} 
                    md={9} 
                    sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden', // Sayfanın scroll olmasını engelle
                    }}
                >
                    <Box 
                        sx={{ 
                            flexGrow: 1, 
                            overflow: 'hidden', // ChatWindow'un scroll olmaması için
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <ChatWindow selectedAgent={selectedAgent} />
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default MyAITeam;