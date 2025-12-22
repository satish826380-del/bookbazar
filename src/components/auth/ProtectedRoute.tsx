import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    redirectPath?: string;
}

const ProtectedRoute = ({
    allowedRoles,
    redirectPath = '/auth'
}: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
