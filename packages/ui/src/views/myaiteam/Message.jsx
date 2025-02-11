import { Box, Paper, Typography } from '@mui/material';

const Message = ({ message }) => {
    const { isUser, content, sourceDocuments } = message;

    return (
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
                    backgroundColor: isUser ? 'primary.main' : 'background.paper',
                    color: isUser ? 'primary.contrastText' : 'text.primary',
                    borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px'
                }}
            >
                <Typography variant="body1">{content}</Typography>
                {sourceDocuments && sourceDocuments.length > 0 && (
                    <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                            Sources:
                        </Typography>
                        {sourceDocuments.map((doc, index) => (
                            <Typography 
                                key={index} 
                                variant="caption" 
                                component="div"
                                color="text.secondary"
                            >
                                {doc.metadata.source || doc.metadata.filename}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default Message; 