import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute() {
    // const token = localStorage.getItem("accessToken");
    const isLoggedIn = useAuthStore((state)=>state.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}