import { mainApi } from "../assets/axios";

export const getJoinBill = async (billId)=>{
    const response = await mainApi.get(`/jbill/${billId}/join`);

    return response.data;
}

export const joinBill = async (billId)=>{
    const response = await mainApi.post(`jbill/${billId}/join`);

    return response.data
}