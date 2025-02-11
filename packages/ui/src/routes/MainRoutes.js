import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';

// route imports
const Chatflows = Loadable(lazy(() => import('@/views/chatflows')));
const AgentFlows = Loadable(lazy(() => import('@/views/agentflows')));
const Marketplaces = Loadable(lazy(() => import('@/views/marketplaces')));
const Tools = Loadable(lazy(() => import('@/views/tools')));
const Assistants = Loadable(lazy(() => import('@/views/assistants')));
const Variables = Loadable(lazy(() => import('@/views/variables')));
const MyAITeam = Loadable(lazy(() => import('@/views/myaiteam')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Chatflows />
        },
        {
            path: '/chatflows',
            element: <Chatflows />
        },
        {
            path: '/chatflows/:id',
            element: <Chatflows />
        },
        {
            path: '/agentflows',
            element: <AgentFlows />
        },
        {
            path: '/agentflows/:id',
            element: <AgentFlows />
        },
        {
            path: '/marketplaces',
            element: <Marketplaces />
        },
        {
            path: '/tools',
            element: <Tools />
        },
        {
            path: '/assistants',
            element: <Assistants />
        },
        {
            path: '/variables',
            element: <Variables />
        },
        {
            path: '/myaiteam',
            element: <MyAITeam />,
            breadcrumbs: false
        }
    ]
};

export default MainRoutes; 