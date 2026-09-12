import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { jwtDecode } from "jwt-decode";


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

        const user = jwtDecode(token);
        // console.log("Decode User:",user)
        login(token, user);

        // console.log("token from loginsuccess:",token)
        // console.log("user from loginsuccess:",user)

        navigate("/", { replace: true });
    }, [login, navigate, searchParams]);

    return <div>Logging in...</div>;
}