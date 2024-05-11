import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true; // Si hay un error al decodificar, asume que el token es inválido
    }
};