import { mainApi } from "../assets/axios";

// ========================================
// GET MY PROFILE
// ========================================

export const getMyProfile = async () => {
    const response = await mainApi.get("/profile/me");

    return response.data;
};


// ========================================
// UPDATE MY PROFILE
// ========================================

export const updateMyProfile = async (formData) => {
    const response = await mainApi.patch("/profile/me", formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;
};