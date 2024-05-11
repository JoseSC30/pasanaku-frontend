import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useAuthTokenCheck } from "../utils/useAuthTokenCheck";

export const PrivateRoute = () => {
    useAuthTokenCheck();
    const user = useAuth();
    if (!user.token) return <Navigate to="/login" />;
    return <Outlet />;
}

export const PublicRoute = () => {
    useAuthTokenCheck();
    const user = useAuth();
    if (user.token) return <Navigate to="/" />;
    return <Outlet />;
}