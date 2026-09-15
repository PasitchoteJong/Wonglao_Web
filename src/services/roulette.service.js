import { mainApi } from "../assets/axios";

export const getRoulette = async (billId) => {
    const response = await get(`${API_URL}/${billId}`);

    return response.data;
};


export const submitRoulette = async (billId) => {
    const response = await axios.post(`${API_URL}/${billId}/submit`);

    return response.data;
};


export const spinRoulette = async (billId) => {
    const response = await axios.post(`${API_URL}/${billId}/spin`);

    return response.data;
};


export const updateRouletteMember = async (billId, memberId, isJoined) => {
    const response = await axios.patch(`${API_URL}/${billId}/members/${memberId}`, { isJoined });

    return response.data;
};