import { mainApi } from "../assets/axios";

export const getFoodSelection = async (billId) => {
    const response = await mainApi.get(`/foodsplit/${billId}`);

    return response.data;
};

export const updateFoodSelection = async (billId, selections) => {
    const response = await mainApi.patch(`/foodsplit/${billId}`, { selections });

    return response.data;
};

export const getFoodSelectionStatus = async (billId) => {
    const response = await mainApi.get(`/foodsplit/${billId}/status`);

    return response.data;
};

export const calculateProportionalSplit = async (billId) => {
    const response = await mainApi.post(`/foodsplit/${billId}/calculate`);

    return response.data;
};