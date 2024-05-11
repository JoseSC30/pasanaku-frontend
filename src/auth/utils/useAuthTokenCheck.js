import { useAuth } from '../context/AuthProvider';
import { isTokenExpired } from './jwtUtils';

export const useAuthTokenCheck = () => {
    const { token, logout } = useAuth();

    if (token && isTokenExpired(token)) {
        logout();
    }

    return null;
}