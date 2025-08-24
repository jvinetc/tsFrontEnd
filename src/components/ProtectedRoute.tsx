import { type JSX } from 'react';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { token} = useUser();
    const tokenSession = sessionStorage.getItem('token');
    if (!token || !tokenSession) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute