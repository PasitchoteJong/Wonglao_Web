import { mainApi } from "../assets/axios";

export const getJoinBill = async (billId)=>{
    const response = await mainApi.get(`/jbill/${billId}/join`);

    return response.data;
}

export const joinBillMember = async (billId)=>{
    const response = await mainApi.post(`/jbill/${billId}/join`);

    return response.data
}

// export const joinBillMember = async (billId)=>{
//     const response = await mainApi.post('')
// }




// axios.post(`http://localhost:8000/api/bills/${billId}/join`, {}, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });