import { useState, useEffect, useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Avatar,
  Collapse,
  Alert,
  Box,
  CircularProgress,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { SmartToyOutlined, Chat as ChatIcon, Search as SearchIcon, ExpandLess, ExpandMore, Folder as FolderIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon, ViewList as ViewListIcon, ViewModule as ViewModuleIcon, CheckBox, CheckBoxOutlineBlank, Star as StarIcon, StarBorder as StarBorderIcon, Archive as ArchiveIcon, Unarchive as UnarchiveIcon } from '@mui/icons-material';
import { myAITeamApi } from '../../api/myaiteam';
import { wsService } from '../../api/websocket';

const ViewToggle = ({ isGroupedView, onChange }) => (
    <Box 
        sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 0.5,
            border: '1px solid',
            borderColor: 'divider'
        }}
    >
        <IconButton
            size="small"
            color={!isGroupedView ? 'primary' : 'default'}
            onClick={() => onChange(false)}
            sx={{ p: 0.5 }}
        >
            <ViewListIcon fontSize="small" />
        </IconButton>
        <IconButton
            size="small"
            color={isGroupedView ? 'primary' : 'default'}
            onClick={() => onChange(true)}
            sx={{ p: 0.5 }}
        >
            <ViewModuleIcon fontSize="small" />
        </IconButton>
    </Box>
);

const FavoritesMenu = ({ favorites, agents, onSelectAgent, anchorEl, onClose }) => {
    const favoriteAgents = agents.filter(agent => favorites.includes(agent.id));
    
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            PaperProps={{
                sx: {
                    maxHeight: 300,
                    minWidth: 200
                }
            }}
        >
            <MenuItem disabled sx={{ opacity: 1, fontWeight: 500 }}>
                <ListItemIcon>
                    <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
                </ListItemIcon>
                Favorites
            </MenuItem>
            <Divider />
            {favoriteAgents.length === 0 ? (
                <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                        No favorite agents yet
                    </Typography>
                </MenuItem>
            ) : (
                favoriteAgents.map(agent => (
                    <MenuItem 
                        key={agent.id}
                        onClick={() => {
                            onSelectAgent(agent);
                            onClose();
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: agent.isAgent ? 'primary.main' : 'secondary.main'
                                }}
                            >
                                {agent.isAgent ? 
                                    <SmartToyOutlined sx={{ fontSize: 16 }} /> : 
                                    <ChatIcon sx={{ fontSize: 16 }} />
                                }
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                            primary={agent.name}
                            primaryTypographyProps={{
                                variant: 'body2',
                                noWrap: true
                            }}
                        />
                    </MenuItem>
                ))
            )}
        </Menu>
    );
};

const AgentList = ({ onSelectAgent, selectedAgent }) => {
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState({});
  const [customGroups, setCustomGroups] = useState(() => {
    const saved = localStorage.getItem('customGroups');
    return saved ? JSON.parse(saved) : {};
  });
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGroupedView, setIsGroupedView] = useState(() => {
    const saved = localStorage.getItem('agentListViewMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [agentMenuAnchorEl, setAgentMenuAnchorEl] = useState(null);
  const [selectedAgentForMenu, setSelectedAgentForMenu] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteAgents');
    return saved ? JSON.parse(saved) : [];
  });
  const [favoritesAnchorEl, setFavoritesAnchorEl] = useState(null);
  const [archivedAgents, setArchivedAgents] = useState(() => {
    const saved = localStorage.getItem('archivedAgents');
    return saved ? JSON.parse(saved) : [];
  });
  const [showArchived, setShowArchived] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('customGroups', JSON.stringify(customGroups));
  }, [customGroups]);

  useEffect(() => {
    localStorage.setItem('agentListViewMode', JSON.stringify(isGroupedView));
  }, [isGroupedView]);

  useEffect(() => {
    localStorage.setItem('favoriteAgents', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('archivedAgents', JSON.stringify(archivedAgents));
  }, [archivedAgents]);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesArchiveState = showArchived ? archivedAgents.includes(agent.id) : !archivedAgents.includes(agent.id);
      return matchesSearch && matchesArchiveState;
    });
  }, [agents, searchQuery, archivedAgents, showArchived]);

  const handleToggleGroup = (groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setNewGroupName('');
    setGroupDialogOpen(true);
  };

  const handleEditGroup = (groupName) => {
    setEditingGroup(groupName);
    setNewGroupName(groupName);
    setGroupDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteGroup = (groupName) => {
    const newGroups = { ...customGroups };
    delete newGroups[groupName];
    setCustomGroups(newGroups);
    handleCloseMenu();
  };

  const handleSaveGroup = () => {
    if (!newGroupName.trim()) return;

    setCustomGroups(prev => {
      const updated = { ...prev };
      if (editingGroup) {
        const groupData = updated[editingGroup];
        delete updated[editingGroup];
        updated[newGroupName] = groupData;
      } else {
        updated[newGroupName] = { agents: [], isDefault: false };
      }
      return updated;
    });

    setGroupDialogOpen(false);
  };

  const handleMenuOpen = (event, groupName) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(groupName);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const handleMoveToGroup = (agentId, targetGroup) => {
    setCustomGroups(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(groupName => {
        updated[groupName].agents = updated[groupName].agents.filter(id => id !== agentId);
      });
      updated[targetGroup].agents.push(agentId);
      return updated;
    });
  };

  const toggleFavorite = (agentId) => {
    setFavorites(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      }
      return [...prev, agentId];
    });
  };

  const isFavorite = (agentId) => favorites.includes(agentId);

  const toggleArchive = (agentId) => {
    setArchivedAgents(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      }
      return [...prev, agentId];
    });
  };

  const isArchived = (agentId) => archivedAgents.includes(agentId);

  const sortedAgents = useMemo(() => {
    return filteredAgents.sort((a, b) => {
      const aFav = isFavorite(a.id);
      const bFav = isFavorite(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [filteredAgents, favorites]);

  const organizedAgents = useMemo(() => {
    if (isGroupedView) {
      const organized = {
        'All Items': sortedAgents
      };

      Object.entries(customGroups).forEach(([groupName, groupData]) => {
        organized[groupName] = groupData.agents
          .map(agentId => filteredAgents.find(a => a.id === agentId))
          .filter(Boolean)
          .sort((a, b) => {
            const aFav = isFavorite(a.id);
            const bFav = isFavorite(b.id);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
          });
      });

      return organized;
    } else {
      return {
        'Favorites': sortedAgents.filter(agent => isFavorite(agent.id)),
        'All Items': sortedAgents
      };
    }
  }, [filteredAgents, customGroups, favorites, isGroupedView]);

  const handleAgentMenuOpen = (event, agent) => {
    event.stopPropagation();
    setAgentMenuAnchorEl(event.currentTarget);
    setSelectedAgentForMenu(agent);
  };

  const handleAgentMenuClose = () => {
    setAgentMenuAnchorEl(null);
    setSelectedAgentForMenu(null);
  };

  const isAgentInGroup = (agentId, groupName) => {
    return customGroups[groupName]?.agents.includes(agentId);
  };

  const toggleAgentInGroup = (agentId, groupName) => {
    setCustomGroups(prev => {
      const updated = { ...prev };
      if (!updated[groupName]) {
        updated[groupName] = { agents: [], isDefault: false };
      }
      
      const groupAgents = updated[groupName].agents;
      const agentIndex = groupAgents.indexOf(agentId);
      
      if (agentIndex === -1) {
        groupAgents.push(agentId);
      } else {
        groupAgents.splice(agentIndex, 1);
      }
      
      return updated;
    });
  };

  const renderAgentItem = (agent, inGroup = false) => (
    <ListItem 
      key={agent.id} 
      disablePadding 
      sx={{ 
        pl: inGroup ? 4 : 0,
        opacity: isArchived(agent.id) ? 0.7 : 1
      }}
    >
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
                backgroundColor: 'transparent'
              }
            }}
          >
            {agent.isAgent ? <SmartToyOutlined /> : <ChatIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText 
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography>{agent.name}</Typography>
              {isFavorite(agent.id) && (
                <StarIcon 
                  fontSize="small" 
                  sx={{ color: 'warning.main' }}
                />
              )}
              {isArchived(agent.id) && (
                <ArchiveIcon 
                  fontSize="small" 
                  sx={{ color: 'text.secondary' }}
                />
              )}
            </Box>
          }
          secondary={agent.description}
        />
      </ListItemButton>
      <IconButton 
        size="small"
        onClick={(e) => handleAgentMenuOpen(e, agent)}
        sx={{ mr: 1 }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </ListItem>
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
        height: '100%'
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
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" sx={{ fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          px: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 500,
              color: 'text.primary'
            }}
          >
            {isGroupedView ? 'Groups' : 'All Items'}
          </Typography>
          {isGroupedView && (
            <IconButton 
              size="small" 
              onClick={handleAddGroup}
              color="primary"
              sx={{ 
                ml: 0.5,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => setFavoritesAnchorEl(e.currentTarget)}
            sx={{
              color: favorites.length > 0 ? 'warning.main' : 'action.active',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <StarIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setShowArchived(!showArchived)}
            sx={{
              color: showArchived ? 'primary.main' : 'action.active',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            {showArchived ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
          </IconButton>
          <ViewToggle 
            isGroupedView={isGroupedView} 
            onChange={setIsGroupedView}
          />
        </Box>
      </Box>

      <List
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
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
          }
        }}
      >
        {isGroupedView ? (
          Object.entries(organizedAgents).map(([groupName, agents]) => (
            <div key={groupName}>
              <ListItem 
                disablePadding 
                sx={{ 
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemButton onClick={() => handleToggleGroup(groupName)}>
                  <ListItemIcon>
                    <FolderIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={groupName} 
                    secondary={`${agents.length} items`}
                  />
                  {openGroups[groupName] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {groupName !== 'All Items' && (
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, groupName)}
                    sx={{ mr: 1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </ListItem>
              <Collapse in={openGroups[groupName]} timeout="auto">
                <List component="div" disablePadding>
                  {agents.map((agent) => renderAgentItem(agent, isAgentInGroup(agent.id, groupName)))}
                </List>
              </Collapse>
            </div>
          ))
        ) : (
          Object.entries(organizedAgents).map(([groupName, agents]) => (
            <div key={groupName}>
              <ListItem 
                disablePadding 
                sx={{ 
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemButton onClick={() => handleToggleGroup(groupName)}>
                  <ListItemIcon>
                    <FolderIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={groupName} 
                    secondary={`${agents.length} items`}
                  />
                  {openGroups[groupName] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {groupName !== 'All Items' && (
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, groupName)}
                    sx={{ mr: 1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </ListItem>
              <Collapse in={openGroups[groupName]} timeout="auto">
                <List component="div" disablePadding>
                  {agents.map((agent) => renderAgentItem(agent, isAgentInGroup(agent.id, groupName)))}
                </List>
              </Collapse>
            </div>
          ))
        )}
      </List>

      <FavoritesMenu 
        favorites={favorites}
        agents={agents}
        onSelectAgent={onSelectAgent}
        anchorEl={favoritesAnchorEl}
        onClose={() => setFavoritesAnchorEl(null)}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleEditGroup(selectedGroup)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Group
        </MenuItem>
        <MenuItem onClick={() => handleDeleteGroup(selectedGroup)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete Group
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={agentMenuAnchorEl}
        open={Boolean(agentMenuAnchorEl)}
        onClose={handleAgentMenuClose}
      >
        <MenuItem 
          onClick={() => {
            toggleFavorite(selectedAgentForMenu.id);
            handleAgentMenuClose();
          }}
        >
          <ListItemIcon>
            {isFavorite(selectedAgentForMenu?.id) ? (
              <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </ListItemIcon>
          {isFavorite(selectedAgentForMenu?.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </MenuItem>
        <MenuItem 
          onClick={() => {
            toggleArchive(selectedAgentForMenu.id);
            handleAgentMenuClose();
          }}
        >
          <ListItemIcon>
            {isArchived(selectedAgentForMenu?.id) ? (
              <UnarchiveIcon fontSize="small" />
            ) : (
              <ArchiveIcon fontSize="small" />
            )}
          </ListItemIcon>
          {isArchived(selectedAgentForMenu?.id) ? 'Unarchive' : 'Archive'}
        </MenuItem>
        <Divider />
        <MenuItem disabled sx={{ opacity: 1, fontWeight: 500 }}>
          Add to Group
        </MenuItem>
        <Divider />
        {Object.entries(customGroups).map(([groupName]) => (
          <MenuItem 
            key={groupName}
            onClick={() => {
              toggleAgentInGroup(selectedAgentForMenu.id, groupName);
              handleAgentMenuClose();
            }}
          >
            <ListItemIcon>
              {isAgentInGroup(selectedAgentForMenu?.id, groupName) ? (
                <CheckBox fontSize="small" />
              ) : (
                <CheckBoxOutlineBlank fontSize="small" />
              )}
            </ListItemIcon>
            {groupName}
          </MenuItem>
        ))}
        {Object.keys(customGroups).length === 0 && (
          <MenuItem disabled>
            No groups available
          </MenuItem>
        )}
        <Divider />
        <MenuItem 
          onClick={() => {
            handleAddGroup();
            handleAgentMenuClose();
          }}
        >
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Create New Group
        </MenuItem>
      </Menu>

      <Dialog open={groupDialogOpen} onClose={() => setGroupDialogOpen(false)}>
        <DialogTitle>{editingGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveGroup} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentList;