import { useRoutes } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import config from '@/config'

// routes
import MainRoutes from './MainRoutes'
import CanvasRoutes from './CanvasRoutes'
import ChatbotRoutes from './ChatbotRoutes'
import Login from '@/views/login'

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() { 
   
    const [cookies] = useCookies(['authToken']);
    const isAuthenticated = !!cookies.authToken; 

    const routes = isAuthenticated
        ? [
              MainRoutes,
              CanvasRoutes,
              ChatbotRoutes,
              {
                  path: '*', // Tüm eşleşmeyen rotalar
                  element: <Login />,
              },
          ]
        : [
              {
                  path: '*', // Tüm eşleşmeyen rotalar
                  element: <Login />,
              },
              {
                  path: '/login',
                  element: <Login />,
              },
          ];

    return useRoutes(routes, config.basename)
}

