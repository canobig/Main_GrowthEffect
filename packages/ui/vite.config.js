import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dotenv from 'dotenv'

export default defineConfig(async ({ mode }) => {
    dotenv.config()
    
    const serverPort = process.env.PORT || 3000
    
    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
                'views': resolve(__dirname, './src/views'),
                'ui-component': resolve(__dirname, './src/ui-component')
            },
            extensions: ['.js', '.jsx', '.json']
        },
        esbuild: {
            loader: 'jsx',
            include: /src\/.*\.jsx?$/,
            exclude: []
        },
        optimizeDeps: {
            esbuildOptions: {
                loader: {
                    '.js': 'jsx'
                }
            }
        },
        root: resolve(__dirname),
        build: {
            outDir: './build'
        },
        server: {
            port: 5173, // UI dev server port
            proxy: {
                '/api': {
                    target: `http://localhost:${serverPort}`,
                    changeOrigin: true
                },
                '/socket.io': {
                    target: `http://localhost:${serverPort}`,
                    changeOrigin: true,
                    ws: true
                }
            }
        }
    }
})
