import { Box, Paper, Typography, Link } from '@mui/material';
import { AttachFile, Image } from '@mui/icons-material';

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
                    <Box sx={{ maxWidth: '100%' }}>
                        <img 
                            src={file.url} 
                            alt={file.name}
                            style={{ 
                                maxWidth: '100%', 
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.open(file.url, '_blank')}
                        />
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            {file.name}
                        </Typography>
                    </Box>
                ) : (
                    <Link 
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 1,
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        <AttachFile />
                        <Typography>{file.name}</Typography>
                    </Link>
                )}
            </Paper>
        </Box>
    );
};

export default FileMessage; 