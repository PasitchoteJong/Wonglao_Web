import { mainApi } from "../assets/axios";

export const getMyPayment = async (billId) => {
    const response = await mainApi.get(`/payment/${billId}/me`);

    return response.data;
}

export const uploadPaymentSlip = async (billId, formData) => {
    const response = await mainApi.post(`/payment/${billId}/slip`, formData);

    return response.data;
}


export const getPaymentSummary = async (billId) => {
    const response = await mainApi.get(`/payment/${billId}/summary`);

    return response.data;
};


export const getPaymentMemberDetail = async (billId, billMemberId) => {
    const response = await mainApi.get(`/payment/${billId}/member/${billMemberId}`);

    return response.data;
};