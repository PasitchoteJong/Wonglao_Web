import { mainApi } from "../assets/axios";

export async function registerLineUser(formData) {
    const response = await mainApi.post("/auth/line/register", formData)

    return response.data;
}