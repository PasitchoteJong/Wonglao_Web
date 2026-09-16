import { mainApi } from "../assets/axios";


export const getRoulette = async (billId) => {
    const response = await mainApi.get(`/roulette/${billId}`);

    return response.data;
};

export const updateRouletteEligibility = async (billId, billMemberId, eligible) => {
    const response = await mainApi.patch(`/roulette/${billId}/members/${billMemberId}/eligibility`, { eligible });

    return response.data;
};

export const spinRoulette = async (billId) => {
    const response = await mainApi.post(`/roulette/${billId}/spin`);

    return response.data;
};

export const confirmRoulettePayment = async (billId) => {
    const response = await mainApi.patch(`/roulette/${billId}/confirm-payment`);

    return response.data;
};