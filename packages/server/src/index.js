const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '*',
    credentials: true
}));
app.use(express.json());

// Get available port
const getAvailablePort = async (startPort) => {
    const net = require('net');
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(getAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
};

const startServer = async () => {
    try {
        const port = await getAvailablePort(3000);
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app; 