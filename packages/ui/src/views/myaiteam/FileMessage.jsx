import { Box, Paper, Typography, Link } from '@mui/material';
import { Description, Image } from '@mui/icons-material';

const FileMessage = ({ file, isUser }) => {
    const isImage = file.type.startsWith('image/');

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
                {isImage ? (
                    <Box sx={{ maxWidth: '300px' }}>
                        <img 
                            src={file.url} 
                            alt={file.name}
                            style={{ 
                                width: '100%', 
                                height: 'auto',
                                borderRadius: '4px'
                            }} 
                        />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Description />
                        <Link 
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                                color: isUser ? 'inherit' : 'primary.main',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {file.name}
                        </Link>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default FileMessage; 