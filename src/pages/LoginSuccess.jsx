import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function LoginSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            navigate("/loginline");
            return;
        }

        login(token);

        navigate("/", { replace: true });
    }, []);

    return <div>Logging in...</div>;
}