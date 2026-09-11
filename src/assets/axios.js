import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const mainApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,

});

mainApi.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    // console.log("Token from axios:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});