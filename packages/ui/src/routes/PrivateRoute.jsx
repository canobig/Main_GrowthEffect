import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(['authToken']);
    if (!cookies.authToken) {
        return <Navigate to="/login" />;
    }
    
        return children;
};

export default PrivateRoute;