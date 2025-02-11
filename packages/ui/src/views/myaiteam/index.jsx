import { useState } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import AgentList from './AgentList';
import ChatWindow from './ChatWindow';

const LAST_SELECTED_AGENT_KEY = 'lastSelectedAgent';

const MyAITeam = () => {
    const theme = useTheme();
    const [selectedAgent, setSelectedAgent] = useState(null);

    return (
        <Box 
            sx={{ 
                position: 'relative',
                height: {
                    xs: 'calc(100vh - 56px)', // Mobile height
                    sm: 'calc(100vh - 64px)', // Tablet height
                    md: 'calc(100vh - 88px)'  // Desktop height
                },
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Grid 
                container 
                sx={{ 
                    flexGrow: 1,
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* Agent List Panel */}
                <Grid 
                    item 
                    xs={12} 
                    md={3} 
                    sx={{ 
                        borderRight: '1px solid',
                        borderColor: theme.palette.divider,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box sx={{ 
                        p: 3,
                        borderBottom: '1px solid',
                        borderColor: theme.palette.divider
                    }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 600,
                                color: theme.palette.mode === 'dark' ? 'text.primary' : '#1E293B'
                            }}
                        >
                            My Agents
                        </Typography>
                    </Box>
                    <Box sx={{ 
                        flexGrow: 1,
                        overflow: 'auto',
                        p: 2
                    }}>
                        <AgentList 
                            onSelectAgent={setSelectedAgent}
                            selectedAgent={selectedAgent}
                        />
                    </Box>
                </Grid>
                
                {/* Chat Panel */}
                <Grid 
                    item 
                    xs={12} 
                    md={9} 
                    sx={{ 
                        height: '100%',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ 
                        flexGrow: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        p: { xs: 2, md: 3 }
                    }}>
                        <ChatWindow selectedAgent={selectedAgent} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MyAITeam; 