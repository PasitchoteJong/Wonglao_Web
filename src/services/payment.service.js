import { mainApi } from "../assets/axios";

export const getMyPayment = async (billId) => {
    const response = await mainApi.get(`/payment/${billId}/me`);

    return response.data;
}

export const uploadPaymentSlip = async (billId, formData) => {
    const response = await mainApi.post(`/payment/${billId}/slip`, formData);

    return response.data;
}


export const getPaymentSummary_be = async (billId) => {
    const response = await mainApi.get(`/payment/${billId}/summary`);

    return response.data;
};


export const getPaymentMemberDetail = async (billId, billMemberId) => {
    const response = await mainApi.get(`/payment/${billId}/member/${billMemberId}`);

    return response.data;
};


export const getPaymentSummary = async (page = 1, limit = 5) => {
    const response = await mainApi.get(`/payment/summary?page=${page}&limit=${limit}`);

    return response.data;
};

export const verifyPaymentSlip = async (paymentSlipId) => {
    const response = await mainApi.patch(`/payment/slip/${paymentSlipId}/verify`);

    return response.data;
};

export const completePayment = async (billId) => {
    const response = await mainApi.patch(
        `/payment/${billId}/complete`
    );

    return response.data;
};